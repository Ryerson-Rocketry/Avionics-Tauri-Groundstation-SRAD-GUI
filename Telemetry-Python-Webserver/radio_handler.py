import datetime
import re

import serial
import serial_asyncio
import asyncio
import json

import numpy as np

import time as t
from websockets.exceptions import ConnectionClosedOK


import serial.tools.list_ports #https://stackoverflow.com/questions/12090503/listing-available-com-ports-with-python 

#TODO: MUST CHECK IF WEBSOCKET HAS DISCONNECTED DURING THIS LOOP, ELSE SHIT IS STUCK
async def serial_connect():
    while(True):
        try:
            ports = serial.tools.list_ports.comports()
            for port, desc, hwid in sorted(ports):
                print("INFO: available COM port found at:" + port , flush = True)
            reader, writer = await serial_asyncio.open_serial_connection(url=port, baudrate=115200)
            print ("SUCCESS: SERIAL CONNECTION MADE. Redirecting back to main serial data read loop", flush = True)
            return reader, writer
        except Exception as e:
            print("ERR: failed to find radio reciever device, trying again...", flush = True)
            ports = serial.tools.list_ports.comports()
            print(e, flush = True)
            await asyncio.sleep(1)


""" ASSUME FOLLOWING IS THE FORMAT OF DATA
------------------------------------------------
Callsign: CUMMER1
Packet #: 129
Battery: 41.81 V
Accel X/Y/Z: 8.10, 0.99, -7.85 g
Gyro X/Y/Z: 7.01, 6.18, 24.90 rad/s
Temp: -267.68 C
Pressure: 2173.30 mbar
Altitude: 6050 ft
Latitude: 0.0051835
Longitude: 0.0044057
Status: 0xC46535FF
RSSI: 100 dBm
SNR: -96000 dB
Freq Error: 433 Hz
"""

"""
#Assumed format of main data string: timestamp [0], x [1], y [2], z [3], battVolt [4], temp [5], press [6], speed [7], acceleration [8]
async def radio_handler(websocket):
    print ("INFO: ATTEMPTING CONNECTION, WILL SHOW MESSAGE IF CONNECTED", flush = True)

    reader, writer = await serial_connect()

    while True:
        try:
            line = await reader.readline()
            parsed = str(line, 'utf-8')
            parsed = parsed.split("\n")
            #print(parsed, flush = True)
            parsed = parsed[0].split(", ")
            #print(parsed, flush = True)
            
            data = {
                "timestamp": float(0),
                "state": 'main',

                #LAT, LONG, ALT
                "position": {'x': float(0),
                            'y': float(0),
                            'z': float(0)},
                "alt": float(0),           

                #UNUSED IGNORE
                "quaternion": {'x': 0,
                'y': 0.707,
                'z': -0.707,
                'w': 0},

                #GYRO X/Y/Z (ASSUMING CONVERTED TO PITCH/ROLL/YAW)
                "orientation": {'pitch': float(0),
                'roll': float(0),
                'yaw': float(0),
                },
                
                #ACCELERATION AXIS X/Y/Z
                "acceleration_axis": {
                    'pitch': float(0),
                    'roll': float(0),
                    'yaw': float(0),
                },
                #get the magnitude of acceleration
                "acceleration": np.linalg.norm(np.array([0,0,0])),

                #MISC DATA POINTS
                "battVolt": float(0),
                "temp": float(0),
                "acceleration": float(0),
                "velocity": float(0),
                "pressure": float(0),

                #RADIO STUFF
                "RSSI": float(0),
                "SNR": float(0),
                "freqError": float(0),
                "callsign": "Crackhoe",
                

                #32 Bit Status Check
                "Status": int(2147483647),

                #NOT USED
                "drogVolt": float(-1),
                "mainVolt": float(-1),
            }

            await websocket.send(json.dumps(data))


        except ConnectionClosedOK:
            print("INFO: CONNECTION (DASHBOARD) CLOSED", flush = True)
            break
        except Exception as e:

            writer.close()
            match (str(e)):
                case "ClearCommError failed (PermissionError(13, 'The device does not recognize the command.', None, 22))":
                    print("ERR: Serial Communication device disconnected, will make another attempt to reconnect", flush = True)


                    reader, writer = await serial_connect()
                    print ("SUCCESS: successful reconnect, returning to main loop", flush = True)

                case _:
                    print("ERR: unknown error, fuck if i know: " + str(e), flush = True)
"""


# ---------- PACKET PARSING HELPERS (look up values by label instead of line position) ----------
NUMBER_PATTERN = re.compile(r"-?\d+(?:\.\d+)?")

def packet_to_fields(packet):
    """Turn ["Battery: 41.81 V", ...] into {"Battery": "41.81 V", ...}"""
    fields = {}
    for line in packet:
        key, _, value = line.partition(":")
        fields[key.strip()] = value.strip()
    return fields

def get_text(fields, label, default=""):
    """For fields that are text, like Callsign and Status."""
    value = fields.get(label)
    if value is None:
        print("WARN: missing field '" + label + "', using default: " + str(default), flush = True)
        return default
    return value

def get_number(fields, label, default=0.0):
    """For one number, like '41.81 V' -> 41.81"""
    value = fields.get(label)
    if value is None:
        print("WARN: missing field '" + label + "', using default: " + str(default), flush = True)
        return default
    match = NUMBER_PATTERN.search(value)
    if match is None:
        print("WARN: no number found in '" + label + "', using default: " + str(default), flush = True)
        return default
    return float(match.group())

def get_numbers(fields, label, count, default=0.0):
    """For lines with several numbers, like 'Accel X/Y/Z: 8.10, 0.99, -7.85 g' -> [8.10, 0.99, -7.85]"""
    value = fields.get(label)
    if value is None:
        print("WARN: missing field '" + label + "', using default: " + str(default), flush = True)
        return [default] * count
    found = NUMBER_PATTERN.findall(value)
    if len(found) < count:
        print("WARN: expected " + str(count) + " numbers in '" + label + "', using default: " + str(default), flush = True)
        return [default] * count
    return [float(n) for n in found[:count]]
# ---------------------------------------------------------------------------------------------

#Assumed format of main data string: timestamp [0], x [1], y [2], z [3], battVolt [4], temp [5], press [6], speed [7], acceleration [8]
async def radio_handler(websocket):
    print ("INFO: ATTEMPTING CONNECTION, WILL SHOW MESSAGE IF CONNECTED", flush = True)

    reader, writer = await serial_connect()

    missed_packets = 0
    total_packets = 0

    while True:   

        packet = []

        full_packet_recieved = False
        while full_packet_recieved == False:
            try:
                
                line = await reader.readline()
                str_line = str(line, 'utf-8')
                str_line = str_line.replace("\n", "")
                str_line = str_line.replace("\r", "")
                print (str_line)

                #len(packet) == 0 to check if this is the very first ---- 
                
                    
                
                if "------------------------------------------------" in str_line and not (len(packet) == 0):
                    full_packet_recieved = True

                #ignore if it is the very first shit
                elif "------------------------------------------------" in str_line and (len(packet) == 0):
                    pass
                else:
                    if "Missed packets:" not in str_line:
                        packet.append(str_line)
                        total_packets += 1
                    else:
                        missed_packets += 1
                        total_packets += 1
                        
                    #print(len(packet))
                    pass


            except ConnectionClosedOK:
                print("INFO: CONNECTION (DASHBOARD) CLOSED", flush = True)
                break
            except Exception as e:
                writer.close()
                match (str(e)):
                    case "ClearCommError failed (PermissionError(13, 'The device does not recognize the command.', None, 22))":
                        print("ERR: Serial Communication device disconnected, will make another attempt to reconnect", flush = True)


                        reader, writer = await serial_connect()
                        print ("SUCCESS: successful reconnect, returning to main loop", flush = True)

                    case _:
                        print("ERR: unknown error, " + str(e), flush = True)
                        await asyncio.sleep(1)
        
        try:
            #print ("FULL PACKET RECIEVED: NOW PARSING packet length of: " + str(len(packet)), flush = True)
            

            fields = packet_to_fields(packet)

            callsign = get_text(fields, "Callsign", "NA")
            timestamp = get_number(fields, "Packet #")      # old code also used the Packet # line as "timestamp"
            battery = get_number(fields, "Battery")
            accel_array = get_numbers(fields, "Accel X/Y/Z", 3)
            gyro_array = get_numbers(fields, "Gyro X/Y/Z", 3)
            temp = get_number(fields, "Temp")
            pressure = get_number(fields, "Pressure")
            altitude = get_number(fields, "Altitude")
            lat = get_number(fields, "Latitude")
            long = get_number(fields, "Longitude")
            status = get_text(fields, "Status", "0x00000000")
            rssi = get_number(fields, "RSSI")
            snr = get_number(fields, "SNR")
            freq_err = get_number(fields, "Freq Error")

            data = {
                "timestamp": float(timestamp),
                "state": 'main',

                #LAT, LONG, ALT
                "position": {'x': float(lat),
                            'y': float(altitude),
                            'z': float(long)},
                "alt": float(altitude),           

                #UNUSED IGNORE
                "quaternion": {'x': 0,
                'y': 0.707,
                'z': -0.707,
                'w': 0},

                #GYRO X/Y/Z (ASSUMING CONVERTED TO PITCH/ROLL/YAW)
                "orientation": {
                'pitch': float(gyro_array[0]),
                'roll': float(gyro_array[1]),
                'yaw': float(gyro_array[2]),
                },
                
                #ACCELERATION AXIS X/Y/Z
                "acceleration_axis": {
                    'x': float(accel_array[0]),
                    'y': float(accel_array[1]),
                    'z': float(accel_array[2]),
                },
                #get the magnitude of acceleration
                "acceleration": float(np.linalg.norm(np.array([accel_array[0],accel_array[1],accel_array[2]]))),

                #MISC DATA POINTS
                "battVolt": float(battery),
                "temp": float(temp),
                "velocity": 1000,
                "pressure": float(pressure),

                #RADIO STUFF
                "radio_info": {
                    "rssi": float(rssi),
                    "snr": float(snr),
                    "freqError": float(freq_err),
                    "callsign": callsign,
                    "totalPackets": total_packets,
                    "missedPackets": missed_packets
                },
     

                #32 Bit Status Check
                "statusBits": status,

                #NOT USED
                "drogVolt": float(-1),
                "mainVolt": float(-1),
            }

            await websocket.send(json.dumps(data))


        except ConnectionClosedOK:
            print("INFO: CONNECTION (DASHBOARD) CLOSED", flush = True)
            break
        except Exception as e:

            writer.close()
            match (str(e)):
                case "ClearCommError failed (PermissionError(13, 'The device does not recognize the command.', None, 22))":
                    print("ERR: Serial Communication device disconnected, will make another attempt to reconnect", flush = True)


                    reader, writer = await serial_connect()
                    print ("SUCCESS: successful reconnect, returning to main loop", flush = True)

                case _:
                    print("ERR: unknown error, fuck if i know: " + str(e), flush = True)

                    
#pass some fake shit in when ussing the standalone moc test
class fake_websocket():
    async def send(*args):
        return 
    
def mock_serial_test():
    asyncio.run(radio_handler(fake_websocket()))
    #radiorun()
    pass

if __name__ == "__main__":
    print ("performing mock serial", flush = True)
    mock_serial_test()
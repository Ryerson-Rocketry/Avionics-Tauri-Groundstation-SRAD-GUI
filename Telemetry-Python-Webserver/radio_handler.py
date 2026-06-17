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
                    if (len(packet) == 14): #ONLY ACCEPT IF THE       
                        full_packet_recieved = True
                    else:
                        print ("INFO: IRREGULAR PACKET LENGTH FOUND (NOT 14 LINES); REJECTING PACKET; DELETING PACKET, WILL TRY AGAIN", flush = True)
                        packet = []

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
            

            # REPLACE LATER WITH FOR LOOPS BRAH, ACTUALLY RETARDED
            callsign = packet[0].split(": ")
            callsign = callsign[1]
            #print ("callsign: " + callsign)

            timestamp = packet[1].split(": ")
            timestamp = timestamp[1]
            #print ("timestamp: " + timestamp)

            battery = packet[2].split(" ")
            battery = battery[1]
            #print ("battery: " + battery)

            accel_array = packet[3].split(":")
            accel_array = accel_array[1].split(", ")
            accel_array[0] = re.sub('[^0-9,.,-]', '', accel_array[0])
            accel_array[1] = re.sub('[^0-9,.,-]', '', accel_array[1])
            accel_array[2] = re.sub('[^0-9,.,-]', '', accel_array[2])
            #print ("accel x/y/z: " +  str(accel_array[0]) + " " +  (accel_array[1]) + " " + (accel_array[2]))

            gyro_array = packet[4].split(":")
            gyro_array = gyro_array[1].split(", ")
            gyro_array[0] = re.sub('[^0-9,.,-]', '', gyro_array[0])
            gyro_array[1] = re.sub('[^0-9,.,-]', '', gyro_array[1])
            gyro_array[2] = re.sub('[^0-9,.,-]', '', gyro_array[2])
            #print ("gyro x/y/z: " +  str(gyro_array[0]) + " " +  (gyro_array[1]) + " " + (gyro_array[2]))

            temp = packet[5].split(" ")
            temp = temp[1]
            #print ("temp: " + temp)

            pressure = packet[6].split(" ")
            pressure = pressure[1]
            #print ("pressure: " + pressure)

            altitude = packet[7].split(" ")
            altitude = altitude[1]
            #print ("altitude: " + altitude)

            lat = packet[8].split(" ")
            lat = lat[1]
            #print ("lat: " + lat)
            long = packet[9].split(" ")
            long = long[1]
            #print ("long: " + long)

            status = packet[10].split(" ")
            status = status[1]
            #print ("status: " + status)

            rssi = packet[11].split(" ")
            rssi = rssi[1]
            #print ("rssi: " + rssi)

            snr = packet[12].split(" ")
            snr = rssi[1]
            #print ("snr: " + snr)

            freq_err = packet[13].split(" ")
            freq_err = rssi[1]
            #print ("freq_err: " + freq_err)

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
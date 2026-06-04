import datetime

import serial
import serial_asyncio
import asyncio
import json


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
                "alt": float(parsed[3]),
                "velocity": float(parsed[7]),
                "timestamp": float(parsed[0]),
                "acceleration": float(parsed[8]),
                "pressure": float(parsed[6]),
                "state": ("test").strip(),
                "position": {'x': float(parsed[1]),
                            'y': float(parsed[2]),
                            'z': float(parsed[3])},
                "quaternion": {'x': 0,
                'y': 0.707,
                'z': -0.707,
                'w': 0},

                "orientation": {'pitch': 30,
                'roll': 20,
                'yaw': 20,
                },

                "battVolt": float(parsed[4]),
                "drogVolt": float(-1000),
                "temp": float(parsed[5]),
                "mainVolt": -1000,
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
import datetime

import serial
from websockets.asyncio.server import serve
from serial_asyncio import open_serial_connection
import asyncio
import json


import time as t

import unittest 

port = "COM6"
baud  = 115200 
from websockets.exceptions import ConnectionClosedOK

async def radio_handler(websocket):
    ####    initilization    ####
    i =0 
    count = 0
    #uno = serial.Serial(port,115200)
    flag=True
    radio_connect = True
    radio_connect2 = False

    rx_command = False
    #while True:
    print("MAKING CONNECT ATTEMPT " + port + "\n")

    while True:
        try:
            #radio =serial.Serial(port=port,baudrate=baud)
            print("CONNECTING...")
            radio = await open_serial_connection(port=port,baudrate=baud)
            radio_connect = True
            break
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, NO RADIO CONNECTION WAS MADE")
            break
        except Exception as e:
            print("FAILED AT INITIAL CONNECT, WILL NOT MAKE ANOTHER ATTEMPT" + "\n")
            #print(e)
            radio_connect = True
            #exit(-1)
            await asyncio.sleep(1)
            break
        
        

    while (radio_connect == True):
        
        try:
            print("CONNECTED" + "\n"  + datetime.now.time())

            #byteInWait = radio._RadioSerialBuffer.inWaiting()
            data_str = await radio.readline().strip().decode("utf-8") #write a string
            
            if (data_str==None):
                print("no data in")
            else: # TRANSMIT TO GUI VIA WEBSOCKET
                print (data_str)
                await websocket.send(json.dumps("TEST"))
                #self.populatefileradio(data_str)

                #data_str= data_str.split('\n')
                #print("data is %s " % data_str[0])
                #print("# bytes in wait: %d \n" % byteInWait)
                await asyncio.sleep(1)
                print('...\n')
                
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, RADIO CONNECTION WAS MADE")
            break
        

        """ 
        #TEST 
        try:
            print("CONNECTED")

            #byteInWait = radio._RadioSerialBuffer.inWaiting()
            data_str = {
                "alt": 5,
                "velocity": 3,
                "timestamp": 7,
                "acceleration": 4,
                "pressure": 1,
                "state": "TEST",
                "position": {'x':432,
                            'y': 31,
                            'z': 432},
                "quaternion": {'x': 0,
                'y': 0.707,
                'z': -0.707,
                'w': 0},

                "battVolt": 12,
                "drogVolt": 43,
                "temp": 423,
                "mainVolt": 6,
            }
            
            if (data_str==None):
                print("no data in")
                await asyncio.sleep(1)
            else: # TRANSMIT TO GUI VIA WEBSOCKET
                print ("data send")
                await websocket.send(json.dumps(data_str))
                #self.populatefileradio(data_str)

                #data_str= data_str.split('\n')
                #print("data is %s " % data_str[0])
                #print("# bytes in wait: %d \n" % byteInWait)
                await asyncio.sleep(1)
                
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, RADIO CONNECTION WAS MADE")
            break
        """

    print("CLOSING TRANSMMISSION")

    pass




def mock_serial_test():
    asyncio.run(radio_handler(None))
    pass

if __name__ == "__main__":
    print ("performing mock serial")
    mock_serial_test()
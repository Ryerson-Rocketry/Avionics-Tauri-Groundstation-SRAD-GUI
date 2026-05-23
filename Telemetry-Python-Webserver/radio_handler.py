import datetime

import serial
from websockets.asyncio.server import serve
import serial_asyncio
import asyncio
import json


import time as t

import unittest 

port = "COM3"
baud  = 115200 
from websockets.exceptions import ConnectionClosedOK


"""
class InputChunkProtocol(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        try:
            #print('data received', repr(data))
            self.transport.write(b'Hello, World!\n')

            # stop callbacks again immediately
            self.pause_reading()
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, NO RADIO CONNECTION WAS MADE")

    def pause_reading(self):
        # This will stop the callbacks to data_received
        self.transport.pause_reading()

    def resume_reading(self):
        # This will start the callbacks to data_received again with all data that has been received in the meantime.
        self.transport.resume_reading()
"""

async def radio_handler(websocket):
    reader, writer = await serial_asyncio.open_serial_connection(url='COM3', baudrate=115200)
    while True:
        try:
            line = await reader.readline()
            parsed = str(line, 'utf-8')
            parsed = parsed.split("\n")
            print(parsed)
            
            """
            ['------------------------------------------------\r', '']
            ['Packet: VE3SOH>GROUND:PKT=1586,ALT=9144.0m,BAT=4.05V\r', '']
            ['Callsign: VE3SOH\r', '']
            ['Packet #: 1586\r', '']
            ['RSSI: -22 dBm\r', '']
            ['SNR: 13 dB\r', '']
            ['Freq Error: -643 Hz\r', '']
            """

            """
            data = {
                "alt": float(0),
                "velocity": float(0),
                "timestamp": float(0),
                "acceleration": float(0),
                "pressure": float(0),
                "state": ("test").strip(),
                "position": {'x': float(0),
                            'y': float(0),
                            'z': float(0)},
                "quaternion": {'x': 0,
                'y': 0.707,
                'z': -0.707,
                'w': 0},

                "battVolt": float(0),
                "drogVolt": float(0),
                "temp": float(0),
                "mainVolt": -1,
            }
            """
            #print("sending (Sleeptime): " + str(total_sleep_time) )
            #await websocket.send(json.dumps(data))

        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, NO RADIO CONNECTION WAS MADE")
            break
        

"""
async def radio_handler(websocket):
    ####    initilization    ####
    loop = asyncio.get_event_loop()

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
            print("READING...")
            transport, protocol = await serial_asyncio.create_serial_connection(loop, InputChunkProtocol, 'COM3', baudrate=115200)
            print("CONNECTED...")
            while True:
                await asyncio.sleep(0.3)
                #print("MSG RECIEVED...")
                protocol.resume_reading()
                print(transport.rea)
            break
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, NO RADIO CONNECTION WAS MADE")
            break
        except Exception as e:
            print("FAILED AT INITIAL CONNECT, WILL NOT MAKE ANOTHER ATTEMPT" + "\n")
            print(e)
            radio_connect = True
            #exit(-1)
            await asyncio.sleep(1)
"""   

"""
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
            radio = await open_serial_connection(None, None,'COM4',baudrate=baud)
            radio_connect = True
            break
        except ConnectionClosedOK:
            print("CONNECTION (DASHBOARD) CLOSED, NO RADIO CONNECTION WAS MADE")
            break
        except Exception as e:
            print("FAILED AT INITIAL CONNECT, WILL NOT MAKE ANOTHER ATTEMPT" + "\n")
            print(e)
            radio_connect = True
            #exit(-1)
            await asyncio.sleep(1)
            
        
        

    while (radio_connect == True):
        
        try:
            print("CONNECTED" + "\n")

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


    print("CLOSING TRANSMMISSION")

    pass
    
"""

#for testing with radio without async
def radiorun():

    i =0 
    count = 0
    #uno = serial.Serial(port,115200)
    flag=True
    radio_connect = True
    radio_connect2 = False

    rx_command = False
    while True:
        print("MAKING CONNECT ATTEMPT" + "\n")

        try:
            radio =serial.Serial(port=port,baudrate=baud)
            radio_connect = True
            break

        except Exception as e:
            print("FAILED AT INITIAL CONNECT" + "\n")
            print()
            #print(e)
            radio_connect = False
            exit(-1)


    #print("Connected")

    #filedescriptors = termios.tcgetattr(sys.stdin) # retrieves current terminal settings 
    #tty.setcbreak(sys.stdin) # allows for single character commands in terminal ; RAW mode instead of COOKED  mode
    #tty and termios make sure terminal reads the key inputs 

    while (radio_connect == True):
        
        
        #byteInWait = radio._RadioSerialBuffer.inWaiting()

        data_str= radio.readline().strip().decode("utf-8") #write a string
        
        if (data_str==None):
            print("no data in")

            
        else:
            print (data_str)
            #self.populatefileradio(data_str)


            #data_str= data_str.split('\n')
            #print("data is %s " % data_str[0])
            #print("# bytes in wait: %d \n" % byteInWait)
            t.sleep(0.1)
            '''
            if (data_str[0] == 'idle'):
                start=t.time()
                while True:
                    end=t.time()
                    timer=end-start
                    if keyboard.is_pressed('space'):
                        rx_command = True
                        print("sending launch command \n") 
                        t.sleep(1)
                        flag=False
                        break
                    elif (timer>2):
                        rx_command= False
                        break
            if flag==False:
                break
            
            else:
                #t.sleep(0.5)
                print("data command is: %s\n"% data_str[0]) 
                radio.sendCommand("launch\n")
                print("launch command sent\n")
                t.sleep(1)
                if keyboard.is_pressed('D'):
                    t.sleep(1)
                    print("exitting connect loop \n")
                    break
            '''






def mock_serial_test():
    asyncio.run(radio_handler(None))
    #radiorun()
    pass

if __name__ == "__main__":
    print ("performing mock serial")
    mock_serial_test()
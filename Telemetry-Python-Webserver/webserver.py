#Websserver stuff for communicating with GUI
import asyncio
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK
from websockets.exceptions import ConnectionClosedError
from websockets.exceptions import ConnectionClosed
from websockets.exceptions import ConcurrencyError

#for proper file path handling when packaging these files into a binary
from os import path 
path_to_dat = path.abspath(path.join(path.dirname(__file__), 'test_data/test-flight-2026-March-modified.csv'))

#for exiting this process
import sys

#Data handling imports
from radio_handler import radio_handler as radio_handle
from csv_handler import rocketry_data_test_handler
from csv_handler import rocketry_data_file_test_handler
from csv_handler import rocketry_data_csv_test_console


async def kill_command():
    ''' 
    Since this webserver should be spawned as a child process of the main GUI application as a Pyinstaller binary, said server should handle creation and deletion of this process.
    However, since the pyinstaller binary actually spawns 2 processes (the bootstrapper, then the actual process (this thing)), closing is somewhat more annoying on that end \n

    Therefore, the tauri backend on the main GUI instead sends a stdin input to this process on exit, after which, we kill this webserver as well
    '''
    await asyncio.get_event_loop().run_in_executor(None, lambda: input("Enter something: "))
    sys.exit()

async def main():
    '''
    Main entry of the webserver
    '''
    #async with serve(rocketry_data_file_test_handler, "localhost", 8765) as server:
    async with serve(state_handler, "localhost", 8765) as server:
        loop = asyncio.get_event_loop()
        loop.create_task(kill_command())

        await server.serve_forever()

        #input('Press ANY to exit')
        #sys.exit()

            

async def state_handler(websocket):
    '''
    when a new websocket connection is established, this method is called from the main loop. \n
    Webserver then checks for input from the websocket. 
    '''
    #await rocketry_data_file_test_handler(websocket)
    print("SERVER CONNECTED TO GUI", flush = True);
    print ("AWAITING INITIALIZATION INPUT: ############################", flush = True)
    running = False

    process = None

    try:
        async for message in websocket:   
            print ("MESSAGE RECIEVED:", flush = True)
            if (running == False): #do not allow launching more handlers on same connection
                print ("(FIRST MESSAGE: \"" + message + "\") SERVER INITIALIZING TELEMETRY MODE:", flush = True)
                match message:
                    case "demo":
                        print ("TELEMETRY IN DEMO MODE ----------", flush = True)
                        running = True
                        await rocketry_data_file_test_handler(websocket)
                        
                    case "live":
                        print ("TELEMETRY IN LIVE MODE ----------", flush = True)
                        running = True
                        await radio_handle(websocket)
                    case _:
                        print ("INVALID CASE", flush = True)
            else:
                print ("(SECOND+ MESSAGE: \"" + message + ") SERVER ALREADY RUNNING", flush = True)
    except ConnectionClosedError:
        print ("ERROR", flush = True)
    except ConnectionClosedOK:
        print ("CLOSED GRACEFULLY", flush = True)
    except ConnectionClosed:
        print ("GENERIC CLOSE", flush = True)

    #if (process != None):
    #    print("async routine is running")
    #    process.close()
    print("Connection ENDED", flush = True);

#Note: Flush specifically for buffer flushing so that the tauri backend recieves stdout properly 
if __name__ == "__main__":
    print("server start", flush = True)
    asyncio.run(main())
    #asyncio.run(rocketry_data_csv_test_console())
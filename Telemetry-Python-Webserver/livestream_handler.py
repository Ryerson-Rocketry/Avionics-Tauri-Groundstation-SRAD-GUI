

import asyncio
import subprocess
import os
import time

from websockets import ConnectionClosedError, ConnectionClosedOK


async def livestream_process_handler(websocket):
    """ideally should exit if websocket is terminated frontend side, should ensure the ffmpeg proc is gone as well"""
    pipe = None
    while True:
        try: #main loop
            startTime = time.time()
            buffer = []
            sentBurst = False

            #-re: "Read input at native frame rate. Mainly used to simulate a grab device."
            #-f: stream a mpeg video to the process pipe
            """
            proc_string = f"ffmpeg.exe -y \
                -re \
                -framerate 15\
                -i test_video.mp4 \
                -c:v libvpx \
                -c:a libopus \
                -f webm pipe:stdout"
            """
            #proc_string =  f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" -b 900k -c:v libvpx -c:a libopus -f webm pipe:stdout"
            #proc_string =  f"ffmpeg.exe -i test_video.mp4 -b 900k -c:v libvpx -c:a libopus -f webm pipe:stdout" 
            #proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" -g 52 -vcodec copy -f mp4 -movflags frag_keyframe+empty_moov+default_base_moof pipe:stdout"
            proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" \
                -rtbufsize 0 -g 144 -r 144\
                -preset slow -tune zerolatency\
                -max_delay 0\
                -audio_buffer_size 0\
                -flush_packets 0\
                -avioflags direct\
                -c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -b:v 2000k -sc_threshold 0 -c:a aac -f mp4 -movflags frag_keyframe+empty_moov+default_base_moof pipe:1"

            pipe = subprocess.Popen(
                proc_string,
                cwd=os.path.dirname("./livestream_deps/"),
                shell = True,
                stdout = subprocess.PIPE,
                stderr = subprocess.DEVNULL,
                bufsize=-1
                )
            
            while (pipe.poll() is None): #while process is still alive
                #stderr = pipe.stderr.read()
                line = pipe.stdout.read(8*1024) 
                #line = pipe.stdout.read(256)
                #print(line)
                """ NOTE IGNORE, buffering here is impossible, have to do it in frontend
                # We buffer everything before outputting it
                buffer.append(line)
                # Minimum buffer time, 3 seconds
                
                if sentBurst is False and time.time() > startTime + 3 and len(buffer) > 0:
                    print ("Send initial")
                    sentBurst = True

                    for i in range(0, len(buffer) - 2):
                        #print ("Send initial burst #", i)
                        await websocket.send(buffer.pop(0)) 

                else:
                    if (sentBurst is True):
                        await websocket.send(buffer.pop(0))
                    else:
                        print("waiting for initial burst")
                """
                await websocket.send(line) 
                #await asyncio.sleep(0.05)
                
                

            print ("STREAM DONE EXITING")
        
            return None
        except ConnectionClosedError:
            print ("ERR", flush = True)
            pipe.terminate()
            break
        except ConnectionClosedOK:
            print ("CONNECTION CLOSED ON LIVESTREAM SOCKET", flush = True)
            pipe.terminate()
            break
        except Exception as e:
            print ("CONNECTION CLOSED ON LIVESTREAM SOCKET (generic error) " + str(e), flush = True)
            pipe.terminate()
            break
    pass


def test_ffmpeg():
    """just a random function to test ffmpeg by itself, minimum reproduction to stream data to a pipe
    https://gist.github.com/anthonyeden/f3b3bdf6f62badd8f87bb574283f488a
    """

    print (os.path.dirname("./livestream_deps/"))


    startTime = time.time()
    buffer = []
    sentBurst = False

    #-re: "Read input at native frame rate. Mainly used to simulate a grab device."
    #-f: stream a mpeg video to the process pipe
    """
    proc_string = f"ffmpeg.exe -y \
        -re \
        -i test_video.mp4 \
        -framerate 1\
        -f webm pipe:stdout"
    """

    #proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" -b 900k -c:v libvpx -c:a libopus -f webm pipe:stdout"
    #proc_string =  f"ffmpeg.exe -i test_video.mp4 -b 900k -c:v libvpx -c:a libopus -f webm pipe:stdout"
    #proc_string = f"ffmpeg.exe -re -i test_video.mp4 -c:v libvpx -b:v 900k -c:a libopus -b:a 128k -f webm test.webm"

    """
    proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" -g 52 \
    -c:a aac -b:a 64k -c:v libx264 -b:v 448k \
    -f mp4 -movflags frag_keyframe+empty_moov \
    pipe:stdout"
    """

    #proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" -g 52 -vcodec copy -f mp4 -movflags frag_keyframe+empty_moov+default_base_moof pipe:stdout"

    proc_string = f"ffmpeg.exe -f dshow -i video=\"Integrated Camera\" \
                    -rtbufsize 0 -g 24 -r 24\
                    -preset ultrafast -tune zerolatency\
                    -max_delay 0\
                    -audio_buffer_size 0\
                    -flush_packets 0\
                    -avioflags direct\
                    -c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -b:v 900k -sc_threshold 0 -c:a aac -f mp4 -movflags frag_keyframe+empty_moov+default_base_moof pipe:1"
    

    pipe = subprocess.Popen(
        proc_string,
        cwd=os.path.dirname("./livestream_deps/"),
        shell = True,
        stdout = subprocess.PIPE,
        stderr = subprocess.DEVNULL,
        bufsize=-1
        )
    while (pipe.poll() is None): #while process is still alive
        line = pipe.stdout.read(1024)
        print(line)

        #stderr = pipe.stderr.read() #ignore this, reading it purely to clear the buffer https://stackoverflow.com/questions/40964071/piping-to-ffmpeg-with-python-subprocess-freezes
        """
        # We buffer everything before outputting it
        buffer.append(line)

        
        # Minimum buffer time, 3 seconds
        if sentBurst is False and time.time() > startTime + 3 and len(buffer) > 0:
            sentBurst = True

            for i in range(0, len(buffer) - 2):
                print ("Send initial burst #", i)
                yield buffer.pop(0)

        elif time.time() > startTime + 3 and len(buffer) > 0:
            yield buffer.pop(0)
        """
    


if __name__ == "__main__":
    test_ffmpeg()
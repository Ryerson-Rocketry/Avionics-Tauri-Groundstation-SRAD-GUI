import { useState, useEffect, useMemo, useRef, useCallback } from "react";

export default function LivestreamPlayer({}) { 
    const [socketOBJ, setSocketOBJ] = useState(null);
    const [videoData, setVideoData] = useState(null);
    const videoRef = useRef(null);
    
    
    useEffect(() => {
      let queue = [];

      let socket;
      socket = new WebSocket("ws://localhost:8765");
      socket.binaryType = "arraybuffer";
      setSocketOBJ(socket);

      socket.onopen = () => {
          //set mode on server
          console.log("SOCKET CREATED FOR LIVESTREAM");
          socket.send("livestream");
      };

      // socket.onmessage = (event) => {
      // Create a MediaSource object
      var mediaSource = new MediaSource();

      let video = videoRef.current;
      video.src = URL.createObjectURL(mediaSource);

      // When the MediaSource is successfully opened
      mediaSource.addEventListener('sourceopen', () => {
        // Create a new SourceBuffer
        var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
        //var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

        /*
        // When a chunk of data is received from the WebSocket
        socket.onmessage = (event) => {
          //const arrayU8 = new Uint8Array(event.data);
          // Check if the MediaSource is still open
          if (mediaSource.readyState === 'open' && sourceBuffer.updating === false) {
            console.log('APPENDING DATA');
            // Append the received data to the SourceBuffer
            sourceBuffer.appendBuffer(event.data);
          } else if (sourceBuffer.updating === true) {
            //TODO - figure out some form of buffering on this side, (otherwise when we reach here, video crashes)
            //idea - queue input buffers, use a useEffect on sourceBuffer.updating, if it changes to true, we can instantly dequeue another source Buffer
            sourceBuffer.appendBuffer(event.data); //then appendd
          }
          else{
            console.log('Media source is not in open state: ', mediaSource.readyState);
          }
        };
        */


          // When a chunk of data is received from the WebSocket
        socket.onmessage = (event) => {
          //const arrayU8 = new Uint8Array(event.data);
          // Check if the MediaSource is still open
          if (mediaSource.readyState === 'open' && sourceBuffer.updating === false && queue.length == 0) { //only append immediate if no backlog
            console.log('APPENDING DATA');
            // Append the received data to the SourceBuffer
            sourceBuffer.appendBuffer(event.data);
          } else if (mediaSource.readyState === 'open') {
            console.log('APPENDING TO QUEUE');
            queue.push(event.data);
          }
          else{
            console.log('Media source is not in open state: ', mediaSource.readyState);
          }
        };
        
        sourceBuffer.addEventListener(
          "update",
          (event) =>{
            if (queue.length != 0 && sourceBuffer.updating === false){
              console.log('APPENDING BACKLOG DATA');
              sourceBuffer.appendBuffer(queue[0]);
              queue.shift();
              console.log('CURRENT BACKLOG: ' + queue.length);
            }

          }
        );


        /*
        // When the SourceBuffer has enough data to start playing
        sourceBuffer.addEventListener('updateend', () => {
          // If the video element is not already playing, start playing it
          if (video.paused) {
            video.play(); 
          }
        });
        */

        sourceBuffer.addEventListener('error', (event) => {
          console.error('SourceBuffer error:', event);
        });
      });


      // When a WebSocket error occurs
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // When the WebSocket connection is closed
      socket.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      
      return () => {
      socket?.close();
      URL.revokeObjectURL(video.src);
      };

    /*
        
        const video = videoRef.current;
        const mediaSource = new MediaSource();
        //mediaUrl = URL.createObjectURL(mediaSource);
        video.src = URL.createObjectURL(mediaSource);

        //console.log("MEDIAURL " + mediaUrl);

        let sourceBuffer;
        const queue = [];

        //appending data
        const appendNext = () => {
            if (!sourceBuffer || sourceBuffer.updating || queue.length === 0) {
                return;
            }

            sourceBuffer.appendBuffer(queue.shift());
        };


        let socket;
        mediaSource.addEventListener("sourceopen", () => {
            const mime = 'video/webm; codecs="vp8,vorbis"';

            sourceBuffer = mediaSource.addSourceBuffer(mime);
            sourceBuffer.addEventListener("updateend", appendNext);
            
            socket = new WebSocket("ws://localhost:8765");
                socket.binaryType = "arraybuffer";
                setSocketOBJ(socket);

            socket.onopen = () => {
                //set mode on server
                console.log("SOCKET CREATED FOR LIVESTREAM");
                socket.send("livestream");
            };

            socket.onmessage = (event) => {
                try {
                    console.log("Message from server ", event.data);
                    queue.push(new Uint8Array(event.data));
                    appendNext();
                }
                catch{

                }
            }
        
        });
        

    
        

        return () => {
        socket?.close();
        URL.revokeObjectURL(video.src);
        };
    */
    }, []);
    
    return (
   
            
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      playsInline
      style={{
        width: "100%",
        maxWidth: "800px",
      }}
    />


        
    );
 }
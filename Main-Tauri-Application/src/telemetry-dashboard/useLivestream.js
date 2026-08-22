import { useState, useEffect, useMemo, useRef, useCallback } from "react";

//where dummy mode = don't actually run the thing
export function useLivestream() {
    const [socketOBJ, setSocketOBJ] = useState(null);;
    const [video, setVideo] = useState(null);

    const videoRef = useRef(null);

    useEffect(() => {
        const mediaSource = new MediaSource();
        const mediaUrl = URL.createObjectURL(mediaSource);
        setVideo(mediaUrl);

        console.log("MEDIAURL " + mediaUrl)

        let sourceBuffer;
        const queue = [];

        //appending data
        const appendNext = () => {
            if (!sourceBuffer || sourceBuffer.updating || queue.length === 0) {
                return;
            }

            sourceBuffer.appendBuffer(queue.shift());
        };

        const socket = new WebSocket("ws://localhost:8765");
        socket.binaryType = "arraybuffer";
        setSocketOBJ(socket);

        socket.onopen = () => {
        //set mode on server
            console.log("SOCKET CREATED FOR LIVESTREAM");
            socket.send("livestream");

        };

        socket.onmessage = (event) => {
            try {
                //console.log("Message from server ", event.data);
                queue.push(new Uint8Array(event.data));
                appendNext();
            }
            catch{

            }
        }

        //close use effect
        return () => {
            socket?.close();
            URL.revokeObjectURL(mediaUrl);
        };

    }, []);

        
    return{
        video
    };
}
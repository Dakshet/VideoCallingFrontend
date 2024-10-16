import React, { useCallback, useContext, useEffect, useState } from 'react'
import videoContext from '../context/videoContext'
import ReactPlayer from "react-player"
import peer from '../service/peer';

const Room = () => {

    const { socket } = useContext(videoContext);

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();



    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`User ${email} joined to this group.`)

        setRemoteSocketId(id);
    }, [])


    const handleCallUser = useCallback(async () => {
        //Now we play our stream first
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true, })

        // Here creating offer and send to second user
        const offer = await peer.getOffer();

        //Send to second user
        socket.emit("user:call", { to: remoteSocketId, offer })

        setMyStream(stream);
    }, [remoteSocketId, socket])


    const handleIncomingCall = useCallback(async ({ from, offer }) => {

        setRemoteSocketId(from);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true, })
        setMyStream(stream);

        console.log("Incomming call from", from, "and", offer);

        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });

    }, [socket])


    const sendStreams = useCallback(() => {
        // Now we exchange our stream with each other.
        // We exchange tracks means audio, video, share screen all of this nothing but tracks so we are sending all tracks to second user or each other.
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }

    }, [myStream])


    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans);
        console.log('Call Accepted!')

        sendStreams();

    }, [sendStreams])


    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();

        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket])


    //negotiationneeded means re-connect to each other again. this error we get from second user not on first user because first user is send our video but when second user is tried to send their video that we get error.
    useEffect(() => {

        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        }

    }, [handleNegoNeeded])


    const handleNegoNeedIncoming = useCallback(async ({ from, offer }) => {

        const ans = await peer.getAnswer(offer);

        socket.emit("peer:nego:done", { to: from, ans });

    }, [socket])


    const handleNegoNeedFinal = useCallback(async ({ from, ans }) => {

        await peer.setLocalDescription(ans);

    }, [])


    //Now we are useEffect for accepting the tracks and handle event listner on that tracks.
    useEffect(() => {
        peer.peer.addEventListener("track", async (event) => {
            const remoteStream = event.streams;
            console.log("GOT TRACKS!");

            setRemoteStream(remoteStream[0]);
        })
    })


    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncoming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncoming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        }

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedIncoming, handleNegoNeedFinal])

    return (
        <div>
            <h1>It is room</h1>
            <h4>{remoteSocketId ? "Connected!" : "No one in room"}</h4>
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
            {
                remoteSocketId && <button onClick={handleCallUser}>Call</button>
            }
            {
                myStream &&
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer playing muted height="300px" width="500px" url={myStream} />
                </>
            }
            {
                remoteStream &&
                <>
                    <h1>Remote Stream</h1>
                    <ReactPlayer playing muted height="300px" width="500px" url={remoteStream} />
                </>
            }
        </div>
    )
}

export default Room



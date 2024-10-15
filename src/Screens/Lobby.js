import React, { useCallback, useContext, useState } from 'react'
import videoContext from '../context/videoContext';
import { useNavigate } from "react-router-dom";

const Lobby = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const { socket } = useContext(videoContext);


    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();

        socket.emit("room:join", { email, room });
    }, [email, room, socket])


    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data;
        console.log(email); //It is write temporary uses.
        navigate(`/room/${room}`)

    }, [navigate])

    useState(() => {

        socket.on("room:join", handleJoinRoom)

        return () => {
            socket.off("room:join", handleJoinRoom)
        }

    }, [socket])

    return (
        <div>
            <h1>Lobby</h1>
            <form action="" onSubmit={handleSubmitForm}>
                <label htmlFor="email">Email Id</label>
                <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="room">Room Number</label>
                <input type="text" id='room' value={room} onChange={(e) => setRoom(e.target.value)} />
                <button type='submit'>Join</button>
            </form>
        </div>
    )
}

export default Lobby

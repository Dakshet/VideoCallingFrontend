import React, { useMemo } from 'react'
import videoContext from './videoContext'
import { io } from 'socket.io-client'


const VideoState = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;

    const socket = useMemo(() => io(`${host}`), [host]);

    // useEffect(() => {
    //     socket.on("connect", () => {
    //         console.log(`Your id is: ${socket.id}`);
    //     })
    // }, [socket])

    return (
        <videoContext.Provider value={{ socket }}>
            {props.children}
        </videoContext.Provider>
    )
}

export default VideoState

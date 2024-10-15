import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route

} from "react-router-dom";
import Lobby from "./Screens/Lobby.js"
import VideoState from "./context/VideoState.js"
import Room from "./Screens/Room.js"

function App() {
  return (
    <VideoState>
      <div >
        <Router>

          <Routes>

            <Route path="/" element={<Lobby />} />
            <Route path="/room/:roomId" element={<Room />} />

          </Routes>

        </Router>
      </div>
    </VideoState>
  );
}

export default App;

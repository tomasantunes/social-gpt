import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import UserTimeline from './components/UserTimeline';
import BotsTimeline from './components/BotsTimeline';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserTimeline />} />
        <Route path="/user-timeline" element={<UserTimeline />} />
        <Route path="/bots-timeline" element={<BotsTimeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

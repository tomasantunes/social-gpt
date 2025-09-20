import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import UserTimeline from './components/UserTimeline';
import BotsTimeline from './components/BotsTimeline';
import CreateBot from './components/CreateBot';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserTimeline />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-timeline" element={<UserTimeline />} />
        <Route path="/bots-timeline" element={<BotsTimeline />} />
        <Route path="/create-bot" element={<CreateBot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

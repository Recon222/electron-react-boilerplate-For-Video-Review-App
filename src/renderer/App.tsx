import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Card, Classes } from './utils/blueprintComponents';
import ThemeProvider from './components/ui/ThemeProvider';
import { PlayerProvider } from './context/PlayerContext';
import VideoPlayer from './components/player/VideoPlayer';
import icon from '../../assets/icon.svg';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainScreen />} />
          </Routes>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

function MainScreen() {
  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <img width="32" alt="icon" src={icon} />
          <h1>Video Player</h1>
        </div>
        <div className="header-right">
          <Button
            icon="help"
            minimal={true}
            className={Classes.BUTTON}
            title="Help"
          />
          <Button
            icon="cog"
            minimal={true}
            className={Classes.BUTTON}
            title="Settings"
          />
        </div>
      </div>

      <div className="content">
        <div className="main-player-container">
          <VideoPlayer
            showFrameInfo={true}
            showExportButton={true}
          />
        </div>

        <div className="sidebar">
          <Card className={Classes.CARD}>
            <h3>Recent Files</h3>
            <div className="recent-files-list">
              <p className="empty-message">No recent files</p>
              {/* We would populate this with actual files in a real implementation */}
            </div>
          </Card>

          <Card className={Classes.CARD}>
            <h3>Export Queue</h3>
            <div className="export-queue">
              <p className="empty-message">No pending exports</p>
              {/* We would populate this with actual queue items in a real implementation */}
            </div>
          </Card>
        </div>
      </div>

      <div className="footer">
        <div className="footer-left">
          <span className="status">Ready</span>
        </div>
        <div className="footer-right">
          <span className="version">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

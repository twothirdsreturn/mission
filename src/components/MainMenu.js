import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import '../styles/main-menu.css';

const MainMenu = ({ setGameState }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handlePlayGame = () => {
    setLoading(true);
    setGameState('CHARACTER_SELECT');
    setTimeout(() => {
      history.push('/character-select');
      setLoading(false);
    }, 500);
  };

  const handleScoreboard = () => {
    setLoading(true);
    setTimeout(() => {
      history.push('/scoreboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="main-menu">
      <h1 className="game-title">THE GOOD MISSION</h1>
      <h2 className="game-subtitle">SEARCH FOR THE GOLDEN MSP</h2>
      
      <div className="menu-options">
        <button 
          className="menu-button play-button" 
          onClick={handlePlayGame}
          disabled={loading}
        >
          PLAY GAME
        </button>
        
        <button 
          className="menu-button scoreboard-button" 
          onClick={handleScoreboard}
          disabled={loading}
        >
          SCOREBOARD
        </button>
        
        <button 
          className="menu-button settings-button" 
          disabled={loading}
        >
          SETTINGS
        </button>
      </div>
      
      <div className="animated-background">
        {/* Animated pixel art will be added here */}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state })
});

export default connect(null, mapDispatchToProps)(MainMenu);

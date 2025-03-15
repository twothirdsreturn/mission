import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import { SELECT_DEAL, DECAY_DEALS } from '../reducers/dealReducer';
import '../styles/galactic-map.css';

const GalacticMap = ({ 
  selectedCharacter, 
  characters, 
  deals, 
  dealStatus,
  setGameState, 
  selectDeal,
  decayDeals,
  score,
  dealsPursued
}) => {
  const history = useHistory();
  const [selectedDealInfo, setSelectedDealInfo] = useState(null);
  
  // Get the current character
  const character = characters.find(char => char.id === selectedCharacter);
  
  // Set up deal decay timer
  useEffect(() => {
    const decayInterval = setInterval(() => {
      decayDeals(1); // Reduce time remaining by 1 unit
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(decayInterval);
  }, [decayDeals]);
  
  const handleDealSelect = (deal) => {
    setSelectedDealInfo(deal);
  };
  
  const handleFlyToDeal = () => {
    if (selectedDealInfo) {
      selectDeal(selectedDealInfo.id);
      setGameState('FLIGHT');
      history.push(`/flight/${selectedDealInfo.id}`);
    }
  };
  
  const getStatusColor = (status) => {
    return dealStatus[status]?.color || 'green';
  };
  
  return (
    <div className="galactic-map">
      <div className="map-header">
        <div className="player-info">
          <span>PLAYER: {character?.name.toUpperCase()}</span>
          <span>DEALS PURSUED: {dealsPursued}</span>
          <span>SCORE: {score}</span>
        </div>
      </div>
      
      <div className="map-container">
        {/* Map background */}
        <div className="map-background">
          {/* Player ship */}
          <div 
            className="player-ship"
            style={{
              left: `${character?.position.x}px`,
              top: `${character?.position.y}px`
            }}
          >
            🚀
          </div>
          
          {/* Deal locations */}
          {deals.map(deal => (
            <div 
              key={deal.id}
              className={`deal-location ${deal.status}`}
              style={{
                left: `${deal.position.x}px`,
                top: `${deal.position.y}px`,
                color: getStatusColor(deal.status)
              }}
              onClick={() => handleDealSelect(deal)}
            >
              {deal.status === 'fresh' ? '🟢' : 
               deal.status === 'aging' ? '🟡' : 
               deal.status === 'stale' ? '🔴' : '💀'}
              <span className="deal-name">{deal.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="deal-info-panel">
        {selectedDealInfo ? (
          <>
            <h3>{selectedDealInfo.name} - {selectedDealInfo.location}</h3>
            <p>Status: {dealStatus[selectedDealInfo.status]?.label}</p>
            <p>Time Remaining: {selectedDealInfo.timeRemaining} hours</p>
            <button 
              className="select-deal-button"
              onClick={handleFlyToDeal}
              disabled={selectedDealInfo.status === 'expired'}
            >
              {selectedDealInfo.status === 'expired' ? 'DEAL EXPIRED' : 'FLY TO DEAL'}
            </button>
          </>
        ) : (
          <p>Select a deal to view details</p>
        )}
        
        <button 
          className="back-button"
          onClick={() => {
            setGameState('CHARACTER_SELECT');
            history.push('/character-select');
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedCharacter: state.character.selectedCharacter,
  characters: state.character.characters,
  deals: state.deals.deals,
  dealStatus: state.deals.dealStatus,
  score: state.game.score,
  dealsPursued: state.game.dealsPursued
});

const mapDispatchToProps = (dispatch) => ({
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state }),
  selectDeal: (dealId) => dispatch({ type: SELECT_DEAL, payload: dealId }),
  decayDeals: (amount) => dispatch({ type: DECAY_DEALS, payload: amount })
});

export default connect(mapStateToProps, mapDispatchToProps)(GalacticMap);

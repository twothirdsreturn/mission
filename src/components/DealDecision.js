import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SET_GAME_STATE, INCREMENT_DEALS_PURSUED, INCREMENT_DEALS_DROPPED, INCREMENT_SCORE } from '../reducers/gameReducer';
import { MAKE_DECISION } from '../reducers/dealReducer';
import '../styles/deal-decision.css';

const DealDecision = ({ 
  deals, 
  setGameState,
  makeDecision,
  incrementDealsPursued,
  incrementDealsDropped,
  incrementScore
}) => {
  const history = useHistory();
  const { dealId } = useParams();
  const [decisionMade, setDecisionMade] = useState(false);
  const [decision, setDecision] = useState(null);
  
  const deal = deals.find(d => d.id === dealId) || {};
  
  // Get collected gems
  const collectedGems = deal.gems ? deal.gems.filter(gem => gem.collected) : [];
  
  // Get revealed risks
  const revealedRisks = deal.boss && deal.boss.defeated ? deal.risks || [] : [];
  
  const handleDecision = (decision) => {
    setDecision(decision);
    setDecisionMade(true);
    
    // Update store
    makeDecision(dealId, decision);
    
    if (decision === 'pursue') {
      incrementDealsPursued();
      incrementScore(calculateScore());
    } else {
      incrementDealsDropped();
    }
    
    // Return to map after delay
    setTimeout(() => {
      setGameState('GALACTIC_MAP');
      history.push('/galactic-map');
    }, 3000);
  };
  
  const calculateScore = () => {
    // Base score for completing the level
    let score = 100;
    
    // Add points for each collected gem
    score += collectedGems.length * 50;
    
    // Subtract points for each risk
    score -= revealedRisks.length * 25;
    
    return Math.max(50, score); // Minimum score of 50
  };
  
  return (
    <div className="deal-decision">
      <h1 className="decision-title">DEAL ASSESSMENT: {deal.name}</h1>
      
      <div className="assessment-container">
        <div className="strengths-section">
          <h2>BUSINESS STRENGTHS:</h2>
          {collectedGems.length > 0 ? (
            <ul>
              {collectedGems.map(gem => (
                <li key={gem.id} className="strength-item">
                  ✅ {gem.type}: {gem.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No gems collected. Limited information available.</p>
          )}
        </div>
        
        <div className="risks-section">
          <h2>HIDDEN RISKS:</h2>
          {revealedRisks.length > 0 ? (
            <ul>
              {revealedRisks.map((risk, index) => (
                <li key={index} className="risk-item">
                  ❌ {risk.type}: {risk.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No risks revealed. Boss not defeated.</p>
          )}
        </div>
      </div>
      
      {!decisionMade ? (
        <div className="decision-buttons">
          <h2>WHAT'S YOUR DECISION?</h2>
          <div className="button-container">
            <button 
              className="drop-button"
              onClick={() => handleDecision('drop')}
            >
              DROP IT
            </button>
            <button 
              className="pursue-button"
              onClick={() => handleDecision('pursue')}
            >
              PURSUE
            </button>
          </div>
        </div>
      ) : (
        <div className="decision-result">
          <h2>
            {decision === 'pursue' 
              ? '✅ MISSION COMPLETE! DEAL SENT TO HQ!' 
              : '❌ DEAL DROPPED! MOVING ON TO THE NEXT OPPORTUNITY.'}
          </h2>
          <p>Returning to galactic map...</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  deals: state.deals.deals
});

const mapDispatchToProps = (dispatch) => ({
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state }),
  makeDecision: (dealId, decision) => dispatch({ 
    type: MAKE_DECISION, 
    payload: { dealId, decision } 
  }),
  incrementDealsPursued: () => dispatch({ type: INCREMENT_DEALS_PURSUED }),
  incrementDealsDropped: () => dispatch({ type: INCREMENT_DEALS_DROPPED }),
  incrementScore: (amount) => dispatch({ type: INCREMENT_SCORE, payload: amount })
});

export default connect(mapStateToProps, mapDispatchToProps)(DealDecision);

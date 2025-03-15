import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../styles/scoreboard.css';

const Scoreboard = ({ deals, gameState }) => {
  const history = useHistory();
  
  // Filter completed deals
  const completedDeals = deals.filter(deal => deal.completed);
  
  return (
    <div className="scoreboard">
      <h1 className="scoreboard-title">HISTORICAL SCOREBOARD</h1>
      
      <div className="scoreboard-container">
        <table className="deals-table">
          <thead>
            <tr>
              <th>LEVEL NAME</th>
              <th>PLAYER</th>
              <th>RESULT</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {completedDeals.length > 0 ? (
              completedDeals.map(deal => (
                <tr key={deal.id}>
                  <td>{deal.name}</td>
                  <td>{deal.playerName || 'Mike'}</td>
                  <td className={deal.pursued ? 'pursued' : 'dropped'}>
                    {deal.pursued ? 'Pursued' : 'Dropped'}
                  </td>
                  <td>{new Date(deal.completedAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No deals completed yet. Start hunting!</td>
              </tr>
            )}
            
            {/* Sample historical data */}
            <tr>
              <td>Packet Pirates HQ</td>
              <td>Reif</td>
              <td className="pursued">Pursued</td>
              <td>03/14/25</td>
            </tr>
            <tr>
              <td>Firewall Fortress</td>
              <td>Mark</td>
              <td className="dropped">Dropped</td>
              <td>03/12/25</td>
            </tr>
            <tr>
              <td>Server Overlords</td>
              <td>Mike</td>
              <td className="pursued">Pursued</td>
              <td>03/10/25</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="scoreboard-summary">
        <p>
          TOTAL DEALS: {completedDeals.length + 3} 
          PURSUED: {completedDeals.filter(d => d.pursued).length + 2} 
          DROPPED: {completedDeals.filter(d => !d.pursued).length + 1}
        </p>
        
        <button 
          className="back-button"
          onClick={() => history.push('/')}
        >
          BACK TO MAIN MENU
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  deals: state.deals.deals,
  gameState: state.game.gameState
});

export default connect(mapStateToProps)(Scoreboard);

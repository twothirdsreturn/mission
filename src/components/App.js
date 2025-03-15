// Update App.js to include DataIntegration component
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import CharacterSelect from './CharacterSelect';
import GalacticMap from './GalacticMap';
import SpaceshipFlight from './SpaceshipFlight';
import PlatformerLevel from './PlatformerLevel';
import BossFight from './BossFight';
import DealDecision from './DealDecision';
import Scoreboard from './Scoreboard';
import DataIntegration from './DataIntegration';
import '../styles/main.css';

const App = ({ gameState }) => {
  return (
    <div className="game-container">
      {/* DataIntegration component to handle MSP data sourcing */}
      <DataIntegration />
      
      <Switch>
        <Route exact path="/" component={MainMenu} />
        <Route path="/character-select" component={CharacterSelect} />
        <Route path="/galactic-map" component={GalacticMap} />
        <Route path="/flight/:dealId" component={SpaceshipFlight} />
        <Route path="/level/:dealId" component={PlatformerLevel} />
        <Route path="/boss/:dealId" component={BossFight} />
        <Route path="/decision/:dealId" component={DealDecision} />
        <Route path="/scoreboard" component={Scoreboard} />
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameState: state.game.gameState
});

export default connect(mapStateToProps)(App);

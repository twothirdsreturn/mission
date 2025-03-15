// Update PlatformerLevel.js to use the CityLevelGenerator
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Phaser from 'phaser';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import { COLLECT_GEM } from '../reducers/dealReducer';
import { generateCityLevel } from '../services/CityLevelGenerator';
import '../styles/platformer-level.css';

class PlatformerScene extends Phaser.Scene {
  constructor(onComplete, onGemCollect, onCheckpoint, dealData, levelConfig) {
    super({ key: 'PlatformerScene' });
    this.onComplete = onComplete;
    this.onGemCollect = onGemCollect;
    this.onCheckpoint = onCheckpoint;
    this.dealData = dealData;
    this.levelConfig = levelConfig;
    this.gemsCollected = 0;
    this.checkpointsReached = 0;
  }

  preload() {
    // Load assets
    this.load.image('player', '/assets/player.png');
    this.load.image('platform', '/assets/platform.png');
    this.load.image('gem', '/assets/gem.png');
    this.load.image('checkpoint', '/assets/checkpoint.png');
    
    // Load city-specific assets
    this.load.image('background', `/assets/backgrounds/${this.levelConfig.background}`);
    
    // Load platform images
    this.levelConfig.platforms.forEach(platform => {
      const key = `platform-${platform.image}`;
      this.load.image(key, `/assets/platforms/${platform.image}`);
    });
    
    // Load decoration images
    this.levelConfig.decorations.forEach(decoration => {
      const key = `decoration-${decoration.image}`;
      this.load.image(key, `/assets/decorations/${decoration.image}`);
    });
  }

  create() {
    // Add background
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.game.config.width, this.game.config.height);

    // Add platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Create platforms based on level config
    this.levelConfig.platforms.forEach(platform => {
      const platformSprite = this.platforms.create(
        platform.x, 
        platform.y, 
        `platform-${platform.image}`
      );
      platformSprite.setDisplaySize(platform.width, platform.height);
      platformSprite.refreshBody();
    });
    
    // Add decorations (landmarks)
    this.levelConfig.decorations.forEach(decoration => {
      this.add.image(
        decoration.x,
        decoration.y,
        `decoration-${decoration.image}`
      ).setScale(0.5);
    });
    
    // Add player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    // Add gems
    this.gems = this.physics.add.group();
    
    // Create gems based on level config
    this.levelConfig.gems.forEach(gem => {
      const gemSprite = this.gems.create(gem.x, gem.y, 'gem');
      gemSprite.gemId = gem.id;
      gemSprite.gemType = gem.type;
      gemSprite.setBounceY(0.4);
      gemSprite.setCollideWorldBounds(true);
    });
    
    // Add checkpoints
    this.checkpoints = this.physics.add.staticGroup();
    
    // Create checkpoints based on level config
    this.levelConfig.checkpoints.forEach(checkpoint => {
      const checkpointSprite = this.checkpoints.create(
        checkpoint.x, 
        checkpoint.y, 
        'checkpoint'
      );
      checkpointSprite.setScale(0.5).refreshBody();
      checkpointSprite.checkpointId = checkpoint.id;
      checkpointSprite.infoType = checkpoint.infoType;
    });
    
    // Add final vault (boss entrance)
    this.finalVault = this.physics.add.sprite(
      this.levelConfig.finalVault.x, 
      this.levelConfig.finalVault.y, 
      'checkpoint'
    );
    this.finalVault.setScale(0.7);
    this.finalVault.setTint(0xff0000);
    
    // Set up collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.gems, this.platforms);
    this.physics.add.collider(this.checkpoints, this.platforms);
    this.physics.add.collider(this.finalVault, this.platforms);
    
    // Set up overlaps
    this.physics.add.overlap(
      this.player, 
      this.gems, 
      this.collectGem, 
      null, 
      this
    );
    
    this.physics.add.overlap(
      this.player, 
      this.checkpoints, 
      this.reachCheckpoint, 
      null, 
      this
    );
    
    this.physics.add.overlap(
      this.player, 
      this.finalVault, 
      this.enterFinalVault, 
      null, 
      this
    );
    
    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    
    // HUD
    this.gemsText = this.add.text(16, 16, 'Gems: 0/' + this.gems.countActive(true), { 
      fontSize: '18px', 
      fill: '#fff' 
    }).setScrollFactor(0);
    
    // Level name
    this.levelNameText = this.add.text(16, 50, this.levelConfig.name, {
      fontSize: '16px',
      fill: '#ffcc00'
    }).setScrollFactor(0);
  }

  update() {
    // Handle player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Handle jumping
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    
    // Update HUD
    this.gemsText.setText('Gems: ' + this.gemsCollected + '/' + this.levelConfig.gems.length);
  }

  collectGem(player, gem) {
    gem.disableBody(true, true);
    this.gemsCollected++;
    
    // Call the gem collect callback
    this.onGemCollect(gem.gemId, gem.gemType);
  }

  reachCheckpoint(player, checkpoint) {
    if (!checkpoint.reached) {
      checkpoint.reached = true;
      checkpoint.setTint(0x00ff00);
      this.checkpointsReached++;
      
      // Call the checkpoint callback with the checkpoint info type
      this.onCheckpoint(checkpoint.checkpointId, checkpoint.infoType);
    }
  }

  enterFinalVault(player, vault) {
    // Only allow entry if all checkpoints have been reached
    if (this.checkpointsReached >= 3) {
      this.onComplete();
    }
  }
}

const PlatformerLevel = ({ 
  selectedDeal, 
  deals, 
  setGameState,
  collectGem 
}) => {
  const history = useHistory();
  const { dealId } = useParams();
  const gameRef = useRef(null);
  const [game, setGame] = useState(null);
  const [checkpointInfo, setCheckpointInfo] = useState(null);
  const [collectedGems, setCollectedGems] = useState([]);
  
  const deal = deals.find(d => d.id === dealId) || {};
  
  // Generate city-specific level configuration
  const levelConfig = generateCityLevel(deal);
  
  useEffect(() => {
    if (!gameRef.current || !deal) return;
    
    const handleComplete = () => {
      setGameState('BOSS_FIGHT');
      history.push(`/boss/${dealId}`);
    };
    
    const handleGemCollect = (gemId, gemType) => {
      collectGem(dealId, gemId);
      setCollectedGems(prev => [...prev, { id: gemId, type: gemType }]);
      
      // Show gem collection info
      // This would be a modal or overlay with gem details
    };
    
    const handleCheckpoint = (checkpointId, infoType) => {
      // Set checkpoint info based on the type
      let title = '';
      let content = '';
      
      switch (infoType) {
        case 'basic':
          title = 'Basic Overview';
          content = (
            <div>
              <p><strong>Location:</strong> {deal.location}</p>
              <p><strong>Industry:</strong> {deal.industry}</p>
              <p><strong>Description:</strong> {deal.description}</p>
            </div>
          );
          break;
        case 'financial':
          title = 'Financial Snapshot';
          content = (
            <div>
              <p><strong>Recurring Revenue:</strong> {deal.financials.recurringRevenue * 100}%</p>
              <p><strong>Net Income:</strong> ${deal.financials.netIncome.toLocaleString()}</p>
              <p><strong>Employees:</strong> {deal.financials.employees}</p>
            </div>
          );
          break;
        case 'owner':
          title = 'Owner Involvement & Growth Factors';
          content = (
            <div>
              <p><strong>Owner Involvement:</strong> {deal.ownerInvolvement}</p>
              <p><strong>Growth Potential:</strong> Moderate to High</p>
              <p><strong>Key Risks:</strong> To be revealed in boss fight</p>
            </div>
          );
          break;
        default:
          title = 'Checkpoint Information';
          content = <p>Additional business details revealed.</p>;
      }
      
      setCheckpointInfo({ title, content });
    };
    
    const newGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: [new PlatformerScene(handleComplete, handleGemCollect, handleCheckpoint, deal, levelConfig)]
    });
    
    setGame(newGame);
    
    return () => {
      if (newGame) {
        newGame.destroy(true);
      }
    };
  }, [gameRef, dealId, deal, levelConfig, history, setGameState, collectGem]);
  
  const renderCheckpointInfo = () => {
    if (!checkpointInfo) return null;
    
    return (
      <div className="checkpoint-info">
        <h3>CHECKPOINT REACHED: {checkpointInfo.title}</h3>
        <div className="checkpoint-content">
          {checkpointInfo.content}
        </div>
        <button onClick={() => setCheckpointInfo(null)}>CONTINUE</button>
      </div>
    );
  };
  
  return (
    <div className="platformer-level">
      <div className="level-header">
        <h2>LEVEL: {deal.name}</h2>
        <div className="level-stats">
          <span>GEMS: {collectedGems.length}/{deal.gems?.length || 0}</span>
          <span>HEALTH: ■■■■■</span>
        </div>
      </div>
      
      <div className="game-container" ref={gameRef}></div>
      
      {renderCheckpointInfo()}
      
      <div className="business-info-panel">
        <h3>BUSINESS INFO:</h3>
        <p>{deal.name} - {deal.description}</p>
        <p>Located in: {deal.location}</p>
        
        <button 
          className="back-button"
          onClick={() => {
            setGameState('GALACTIC_MAP');
            history.push('/galactic-map');
          }}
        >
          ABORT MISSION
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedDeal: state.deals.selectedDeal,
  deals: state.deals.deals
});

const mapDispatchToProps = (dispatch) => ({
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state }),
  collectGem: (dealId, gemId) => dispatch({ 
    type: COLLECT_GEM, 
    payload: { dealId, gemId } 
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(PlatformerLevel);

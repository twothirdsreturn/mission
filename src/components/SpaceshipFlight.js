import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Phaser from 'phaser';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import '../styles/spaceship-flight.css';

class FlightScene extends Phaser.Scene {
  constructor(onSuccess, onFailure) {
    super({ key: 'FlightScene' });
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  preload() {
    // Load assets
    this.load.image('ship', '/assets/ship.png');
    this.load.image('cloud', '/assets/cloud.png');
    this.load.image('asteroid', '/assets/asteroid.png');
    this.load.image('satellite', '/assets/satellite.png');
    this.load.image('background', '/assets/space-background.png');
  }

  create() {
    // Add background
    this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Add ship
    this.ship = this.physics.add.sprite(100, 300, 'ship');
    this.ship.setCollideWorldBounds(true);
    this.ship.setGravityY(300);

    // Add obstacles group
    this.obstacles = this.physics.add.group();

    // Create obstacles
    this.createObstacles();

    // Add destination
    this.destination = this.add.rectangle(
      this.game.config.width - 50, 
      this.game.config.height / 2, 
      20, 
      100, 
      0x00ff00
    );
    this.physics.add.existing(this.destination, true);

    // Set up collisions
    this.physics.add.overlap(
      this.ship, 
      this.destination, 
      this.handleSuccess, 
      null, 
      this
    );

    this.physics.add.collider(
      this.ship, 
      this.obstacles, 
      this.handleCrash, 
      null, 
      this
    );

    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Progress bar
    this.progressBar = this.add.rectangle(
      this.game.config.width / 2,
      20,
      0,
      10,
      0x00ff00
    ).setOrigin(0, 0);
    
    this.progressBarBackground = this.add.rectangle(
      this.game.config.width / 2 - 100,
      20,
      200,
      10,
      0x333333
    ).setOrigin(0, 0);
    
    // Distance to destination
    this.startX = this.ship.x;
    this.endX = this.destination.x;
    this.totalDistance = this.endX - this.startX;
  }

  createObstacles() {
    // Create clouds
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(300, this.game.config.width - 100);
      const y = Phaser.Math.Between(50, this.game.config.height - 50);
      
      const obstacle = this.obstacles.create(x, y, 'cloud');
      obstacle.setImmovable(true);
    }
    
    // Create asteroids
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(400, this.game.config.width - 100);
      const y = Phaser.Math.Between(50, this.game.config.height - 50);
      
      const obstacle = this.obstacles.create(x, y, 'asteroid');
      obstacle.setImmovable(true);
    }
    
    // Create satellites
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(500, this.game.config.width - 100);
      const y = Phaser.Math.Between(50, this.game.config.height - 50);
      
      const obstacle = this.obstacles.create(x, y, 'satellite');
      obstacle.setImmovable(true);
    }
  }

  update() {
    // Handle ship movement
    if (this.cursors.left.isDown) {
      this.ship.setVelocityX(-150);
    } else if (this.cursors.right.isDown) {
      this.ship.setVelocityX(150);
    } else {
      this.ship.setVelocityX(0);
    }

    // Handle ship flight (spacebar)
    if (this.cursors.space.isDown) {
      this.ship.setVelocityY(-200);
    }
    
    // Update progress bar
    const currentDistance = this.ship.x - this.startX;
    const progress = (currentDistance / this.totalDistance) * 100;
    const progressWidth = (progress / 100) * 200;
    this.progressBar.width = Math.max(0, Math.min(200, progressWidth));
  }

  handleSuccess() {
    this.onSuccess();
  }

  handleCrash() {
    this.onFailure();
  }
}

const SpaceshipFlight = ({ selectedDeal, deals, setGameState }) => {
  const history = useHistory();
  const { dealId } = useParams();
  const gameRef = useRef(null);
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState('flying'); // flying, success, crashed
  
  const deal = deals.find(d => d.id === dealId) || {};
  
  useEffect(() => {
    if (!gameRef.current) return;
    
    const handleSuccess = () => {
      setStatus('success');
      setTimeout(() => {
        setGameState('PLATFORMER');
        history.push(`/level/${dealId}`);
      }, 2000);
    };
    
    const handleFailure = () => {
      setStatus('crashed');
      setTimeout(() => {
        setStatus('flying');
        // Reset the game
        if (game) {
          game.scene.start('FlightScene');
        }
      }, 2000);
    };
    
    const newGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [new FlightScene(handleSuccess, handleFailure)]
    });
    
    setGame(newGame);
    
    return () => {
      if (newGame) {
        newGame.destroy(true);
      }
    };
  }, [gameRef, dealId, history, setGameState]);
  
  return (
    <div className="spaceship-flight">
      <div className="flight-header">
        <h2>DESTINATION: {deal.name}</h2>
        <div className="flight-status">
          {status === 'flying' && <span>Flying to destination...</span>}
          {status === 'success' && <span className="success">Landing successful!</span>}
          {status === 'crashed' && <span className="crashed">Ship crashed! Restarting...</span>}
        </div>
      </div>
      
      <div className="game-container" ref={gameRef}></div>
      
      <div className="flight-controls">
        <p>CONTROLS:</p>
        <p>SPACEBAR to fly up | ARROW KEYS to move left/right</p>
        
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
  setGameState: (state) => dispatch({ type: SET_GAME_STATE, payload: state })
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceshipFlight);

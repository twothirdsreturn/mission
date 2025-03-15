import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Phaser from 'phaser';
import { SET_GAME_STATE } from '../reducers/gameReducer';
import { DEFEAT_BOSS } from '../reducers/dealReducer';
import '../styles/boss-fight.css';

class BossFightScene extends Phaser.Scene {
  constructor(onDefeat, dealData) {
    super({ key: 'BossFightScene' });
    this.onDefeat = onDefeat;
    this.dealData = dealData;
    this.currentRisk = 0;
    this.risks = [
      'Customer Concentration Hydra',
      'Owner Reliance Doom-Bot',
      'Cashflow Phantom'
    ];
    this.risksDefeated = 0;
  }

  preload() {
    // Load assets
    this.load.image('player', '/assets/player.png');
    this.load.image('platform', '/assets/platform.png');
    this.load.image('boss', '/assets/boss.png');
    this.load.image('projectile', '/assets/projectile.png');
    this.load.image('background', '/assets/boss-background.png');
  }

  create() {
    // Add background
    this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Add platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Ground platform
    this.platforms.create(400, 580, 'platform').setScale(2).refreshBody();
    
    // Add player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    // Add boss
    this.boss = this.physics.add.sprite(600, 300, 'boss');
    this.boss.setScale(2);
    this.boss.setBounce(0.2);
    this.boss.setCollideWorldBounds(true);
    this.boss.setImmovable(true);
    
    // Add projectiles
    this.projectiles = this.physics.add.group();
    
    // Set up collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.boss, this.platforms);
    this.physics.add.collider(this.projectiles, this.platforms, this.hitPlatform, null, this);
    
    // Set up overlaps
    this.physics.add.overlap(
      this.projectiles, 
      this.boss, 
      this.hitBoss, 
      null, 
      this
    );
    
    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Shooting control
    this.input.keyboard.on('keydown-SPACE', this.shootProjectile, this);
    
    // Boss health
    this.bossHealth = 100;
    
    // HUD
    this.riskText = this.add.text(16, 16, 'BOSS: ' + this.risks[this.currentRisk], { 
      fontSize: '18px', 
      fill: '#fff' 
    }).setScrollFactor(0);
    
    this.healthText = this.add.text(16, 40, 'HEALTH: ' + this.bossHealth + '%', { 
      fontSize: '18px', 
      fill: '#fff' 
    }).setScrollFactor(0);
    
    // Boss movement
    this.bossTween = this.tweens.add({
      targets: this.boss,
      y: 200,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Boss attack timer
    this.time.addEvent({
      delay: 2000,
      callback: this.bossAttack,
      callbackScope: this,
      loop: true
    });
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
    
    // Update projectiles
    this.projectiles.getChildren().forEach(projectile => {
      if (projectile.x > this.game.config.width || projectile.x < 0) {
        projectile.destroy();
      }
    });
  }

  shootProjectile() {
    const projectile = this.projectiles.create(this.player.x, this.player.y, 'projectile');
    projectile.setVelocityX(400);
    projectile.setCollideWorldBounds(false);
  }

  bossAttack() {
    const projectile = this.projectiles.create(this.boss.x, this.boss.y, 'projectile');
    projectile.setTint(0xff0000);
    projectile.setVelocityX(-300);
    projectile.setCollideWorldBounds(false);
    projectile.isBossProjectile = true;
    
    this.physics.add.overlap(
      this.player, 
      projectile, 
      this.hitPlayer, 
      null, 
      this
    );
  }

  hitBoss(boss, projectile) {
    if (!projectile.isBossProjectile) {
      projectile.destroy();
      this.bossHealth -= 10;
      this.healthText.setText('HEALTH: ' + this.bossHealth + '%');
      
      if (this.bossHealth <= 0) {
        this.defeatCurrentRisk();
      }
    }
  }

  hitPlayer(player, projectile) {
    if (projectile.isBossProjectile) {
      projectile.destroy();
      // Handle player damage
    }
  }

  hitPlatform(projectile, platform) {
    projectile.destroy();
  }

  defeatCurrentRisk() {
    this.risksDefeated++;
    
    if (this.risksDefeated >= this.dealData.risks.length || this.currentRisk >= 2) {
      // All risks defeated
      this.onDefeat();
    } else {
      // Move to next risk
      this.currentRisk++;
      this.bossHealth = 100;
      this.riskText.setText('BOSS: ' + this.risks[this.currentRisk]);
      this.healthText.setText('HEALTH: ' + this.bossHealth + '%');
    }
  }
}

const BossFight = ({ 
  selectedDeal, 
  deals, 
  setGameState,
  defeatBoss 
}) => {
  const history = useHistory();
  const { dealId } = useParams();
  const gameRef = useRef(null);
  const [game, setGame] = useState(null);
  const [riskRevealed, setRiskRevealed] = useState(null);
  
  const deal = deals.find(d => d.id === dealId) || {
    risks: [
      { type: 'Customer Concentration Hydra', description: 'Too much revenue from a single client (80%+ risk).' },
      { type: 'Owner Reliance Doom-Bot', description: 'The owner is the business (no real team in place).' }
    ]
  };
  
  useEffect(() => {
    if (!gameRef.current || !deal) return;
    
    const handleDefeat = () => {
      defeatBoss(dealId);
      setGameState('DEAL_DECISION');
      history.push(`/decision/${dealId}`);
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
      scene: [new BossFightScene(handleDefeat, deal)]
    });
    
    setGame(newGame);
    
    return () => {
      if (newGame) {
        newGame.destroy(true);
      }
    };
  }, [gameRef, dealId, deal, history, setGameState, defeatBoss]);
  
  const renderRiskInfo = () => {
    if (!riskRevealed) return null;
    
    return (
      <div className="risk-info">
        <h3>RISK REVEALED: {riskRevealed.type}</h3>
        <p>{riskRevealed.description}</p>
        <button onClick={() => setRiskRevealed(null)}>CONTINUE FIGHT</button>
      </div>
    );
  };
  
  return (
    <div className="boss-fight">
      <div className="boss-header">
        <h2>BOSS FIGHT: Deal Killers</h2>
        <div className="boss-stats">
          <span>HEALTH: ■■■■■</span>
        </div>
      </div>
      
      <div className="game-container" ref={gameRef}></div>
      
      {renderRiskInfo()}
      
      <div className="risk-info-panel">
        <h3>CONTROLS:</h3>
        <p>ARROW KEYS to move | SPACEBAR to shoot</p>
        
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
  defeatBoss: (dealId) => dispatch({ type: DEFEAT_BOSS, payload: dealId })
});

export default connect(mapStateToProps, mapDispatchToProps)(BossFight);

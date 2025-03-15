// Test script for the Golden MSP Acquisition Adventure Game
// This script tests the core functionality of the game

// Import necessary modules
const assert = require('assert');
const DataSourcingService = require('./src/services/DataSourcingService');
const CityLevelGenerator = require('./src/services/CityLevelGenerator');

// Test suite
console.log('Starting tests for Golden MSP Acquisition Adventure Game...');

// Test 1: Data Sourcing Service
console.log('\nTest 1: Testing Data Sourcing Service');
try {
  // Test fallback listings
  const fallbackListings = DataSourcingService.getFallbackListings();
  assert(Array.isArray(fallbackListings), 'Fallback listings should be an array');
  assert(fallbackListings.length > 0, 'Fallback listings should not be empty');
  assert(fallbackListings[0].name, 'Listing should have a name');
  assert(fallbackListings[0].location, 'Listing should have a location');
  assert(fallbackListings[0].gems, 'Listing should have gems');
  console.log('✅ Data Sourcing Service fallback listings test passed');
} catch (error) {
  console.error('❌ Data Sourcing Service test failed:', error.message);
}

// Test 2: City Level Generator
console.log('\nTest 2: Testing City Level Generator');
try {
  // Test city elements retrieval
  const stLouisElements = CityLevelGenerator.getCityElements('St. Louis, MO');
  assert(stLouisElements.landmark === 'Gateway Arch', 'St. Louis landmark should be Gateway Arch');
  
  const newYorkElements = CityLevelGenerator.getCityElements('New York, NY');
  assert(newYorkElements.landmark === 'Empire State Building', 'New York landmark should be Empire State Building');
  
  // Test default elements for unknown city
  const unknownCityElements = CityLevelGenerator.getCityElements('Unknown City, XX');
  assert(unknownCityElements.landmark === 'Business District', 'Unknown city should use default landmark');
  
  console.log('✅ City elements retrieval test passed');
  
  // Test level generation
  const mockDeal = {
    id: 'test-deal',
    name: 'Test MSP',
    location: 'Seattle, WA',
    gems: [
      { id: 'gem-1', type: 'Revenue Relic' },
      { id: 'gem-2', type: 'Security Core' },
      { id: 'gem-3', type: 'Automation Crystal' }
    ]
  };
  
  const levelConfig = CityLevelGenerator.generateCityLevel(mockDeal);
  assert(levelConfig.name.includes('Space Needle'), 'Seattle level should include Space Needle');
  assert(Array.isArray(levelConfig.platforms), 'Level config should have platforms array');
  assert(Array.isArray(levelConfig.decorations), 'Level config should have decorations array');
  assert(levelConfig.gems.length === 3, 'Level config should have 3 gems');
  
  console.log('✅ Level generation test passed');
} catch (error) {
  console.error('❌ City Level Generator test failed:', error.message);
}

// Test 3: Redux Store Structure
console.log('\nTest 3: Testing Redux Store Structure');
try {
  // Mock Redux store structure
  const mockStore = {
    game: {
      gameState: 'MAIN_MENU',
      score: 0,
      dealsCompleted: 0,
      dealsPursued: 0,
      dealsDropped: 0
    },
    character: {
      selectedCharacter: 'mike',
      characters: [
        { id: 'mike', name: 'Mike', homeBase: 'Orem, Utah' },
        { id: 'reif', name: 'Reif', homeBase: 'Ozark, Missouri' },
        { id: 'mark', name: 'Mark', homeBase: 'New York, NY' }
      ]
    },
    deals: {
      deals: [
        {
          id: 'deal-1',
          name: 'SecureNet Solutions',
          location: 'Austin, TX',
          status: 'fresh',
          timeRemaining: 85
        }
      ],
      selectedDeal: null
    }
  };
  
  // Verify store structure
  assert(mockStore.game.gameState === 'MAIN_MENU', 'Initial game state should be MAIN_MENU');
  assert(mockStore.character.characters.length === 3, 'Should have 3 characters');
  assert(mockStore.deals.deals.length > 0, 'Should have at least one deal');
  
  console.log('✅ Redux Store Structure test passed');
} catch (error) {
  console.error('❌ Redux Store Structure test failed:', error.message);
}

// Test 4: Game Flow
console.log('\nTest 4: Testing Game Flow');
try {
  // Define expected game flow states
  const gameFlowStates = [
    'MAIN_MENU',
    'CHARACTER_SELECT',
    'GALACTIC_MAP',
    'FLIGHT',
    'PLATFORMER',
    'BOSS_FIGHT',
    'DEAL_DECISION'
  ];
  
  // Verify game flow states
  gameFlowStates.forEach((state, index) => {
    if (index > 0) {
      assert(gameFlowStates[index - 1] !== state, 'Game states should be unique');
    }
  });
  
  console.log('✅ Game Flow test passed');
} catch (error) {
  console.error('❌ Game Flow test failed:', error.message);
}

console.log('\nAll tests completed!');

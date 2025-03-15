// City-specific level map generator
import React from 'react';

// Map of city names to their iconic landmarks and elements
const cityLandmarks = {
  'St. Louis': {
    landmark: 'Gateway Arch',
    elements: [
      { type: 'background', image: 'st-louis-skyline.png' },
      { type: 'platform', image: 'arch-platform.png', positions: [[100, 300], [300, 400], [500, 300]] },
      { type: 'decoration', image: 'gateway-arch.png', position: [400, 200] }
    ]
  },
  'New York': {
    landmark: 'Empire State Building',
    elements: [
      { type: 'background', image: 'nyc-skyline.png' },
      { type: 'platform', image: 'skyscraper-platform.png', positions: [[150, 350], [350, 250], [550, 350]] },
      { type: 'decoration', image: 'empire-state.png', position: [500, 150] },
      { type: 'decoration', image: 'statue-liberty.png', position: [200, 200] }
    ]
  },
  'San Francisco': {
    landmark: 'Golden Gate Bridge',
    elements: [
      { type: 'background', image: 'sf-skyline.png' },
      { type: 'platform', image: 'bridge-platform.png', positions: [[100, 400], [300, 300], [500, 400]] },
      { type: 'decoration', image: 'golden-gate.png', position: [350, 150] }
    ]
  },
  'Seattle': {
    landmark: 'Space Needle',
    elements: [
      { type: 'background', image: 'seattle-skyline.png' },
      { type: 'platform', image: 'needle-platform.png', positions: [[150, 350], [350, 250], [550, 350]] },
      { type: 'decoration', image: 'space-needle.png', position: [450, 150] }
    ]
  },
  'Chicago': {
    landmark: 'Willis Tower',
    elements: [
      { type: 'background', image: 'chicago-skyline.png' },
      { type: 'platform', image: 'tower-platform.png', positions: [[100, 300], [300, 400], [500, 300]] },
      { type: 'decoration', image: 'willis-tower.png', position: [350, 150] },
      { type: 'decoration', image: 'cloud-gate.png', position: [200, 350] }
    ]
  },
  'Miami': {
    landmark: 'South Beach',
    elements: [
      { type: 'background', image: 'miami-skyline.png' },
      { type: 'platform', image: 'beach-platform.png', positions: [[150, 350], [350, 250], [550, 350]] },
      { type: 'decoration', image: 'palm-trees.png', position: [400, 200] }
    ]
  },
  'Austin': {
    landmark: 'Texas State Capitol',
    elements: [
      { type: 'background', image: 'austin-skyline.png' },
      { type: 'platform', image: 'capitol-platform.png', positions: [[100, 300], [300, 400], [500, 300]] },
      { type: 'decoration', image: 'state-capitol.png', position: [350, 150] }
    ]
  },
  'Denver': {
    landmark: 'Rocky Mountains',
    elements: [
      { type: 'background', image: 'denver-skyline.png' },
      { type: 'platform', image: 'mountain-platform.png', positions: [[150, 350], [350, 250], [550, 350]] },
      { type: 'decoration', image: 'rocky-mountains.png', position: [400, 100] }
    ]
  },
  'Toronto': {
    landmark: 'CN Tower',
    elements: [
      { type: 'background', image: 'toronto-skyline.png' },
      { type: 'platform', image: 'tower-platform.png', positions: [[100, 300], [300, 400], [500, 300]] },
      { type: 'decoration', image: 'cn-tower.png', position: [350, 150] }
    ]
  },
  'Mexico City': {
    landmark: 'Angel of Independence',
    elements: [
      { type: 'background', image: 'mexico-city-skyline.png' },
      { type: 'platform', image: 'monument-platform.png', positions: [[150, 350], [350, 250], [550, 350]] },
      { type: 'decoration', image: 'angel-independence.png', position: [400, 150] }
    ]
  }
};

// Default city elements if the city is not in our database
const defaultCityElements = {
  landmark: 'Business District',
  elements: [
    { type: 'background', image: 'generic-skyline.png' },
    { type: 'platform', image: 'generic-platform.png', positions: [[100, 300], [300, 400], [500, 300]] },
    { type: 'decoration', image: 'office-building.png', position: [350, 150] }
  ]
};

// Function to get city elements based on location
export const getCityElements = (location) => {
  // Extract city name from location (e.g., "Austin, TX" -> "Austin")
  const cityName = location.split(',')[0].trim();
  
  // Find matching city or closest match
  for (const [city, data] of Object.entries(cityLandmarks)) {
    if (cityName.includes(city) || city.includes(cityName)) {
      return data;
    }
  }
  
  // Return default elements if no match found
  return defaultCityElements;
};

// Function to generate a level configuration based on city and deal data
export const generateCityLevel = (deal) => {
  const cityData = getCityElements(deal.location);
  
  // Create level configuration
  const levelConfig = {
    name: `${deal.name} - ${cityData.landmark}`,
    background: cityData.elements.find(el => el.type === 'background')?.image || 'generic-skyline.png',
    platforms: cityData.elements
      .filter(el => el.type === 'platform')
      .flatMap(platform => platform.positions.map(pos => ({
        x: pos[0],
        y: pos[1],
        width: 200,
        height: 30,
        image: platform.image
      }))),
    decorations: cityData.elements
      .filter(el => el.type === 'decoration')
      .map(decoration => ({
        x: decoration.position[0],
        y: decoration.position[1],
        image: decoration.image
      })),
    gems: deal.gems.map((gem, index) => ({
      id: gem.id,
      type: gem.type,
      x: 150 + (index * 200),
      y: 150 + (index * 50)
    })),
    checkpoints: [
      { id: 1, x: 200, y: 500, infoType: 'basic' },
      { id: 2, x: 400, y: 250, infoType: 'financial' },
      { id: 3, x: 700, y: 150, infoType: 'owner' }
    ],
    finalVault: {
      x: 750,
      y: 500
    }
  };
  
  return levelConfig;
};

export default {
  getCityElements,
  generateCityLevel
};

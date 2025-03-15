// Data sourcing service for fetching MSP listings from various marketplaces
import axios from 'axios';

class DataSourcingService {
  constructor() {
    this.marketplaces = [
      {
        name: 'bizbuysell',
        url: 'https://www.bizbuysell.com/api/listings',
        requiresAuth: false
      },
      {
        name: 'dealforce',
        url: 'https://www.dealforce.com/api/listings',
        requiresAuth: true,
        credentials: {
          username: 'reif@thegoodproject.net',
          password: 'qwk6pfn9quq4xdy.DVM'
        }
      },
      {
        name: 'dealstream',
        url: 'https://www.dealstream.com/api/listings',
        requiresAuth: false
      }
    ];
  }

  // Fetch listings from all marketplaces
  async fetchAllListings() {
    try {
      const allPromises = this.marketplaces.map(marketplace => 
        this.fetchFromMarketplace(marketplace)
      );
      
      const results = await Promise.all(allPromises);
      const allListings = results.flat();
      
      // Filter for MSP businesses
      const mspListings = this.filterMSPListings(allListings);
      
      // Apply quality filters
      const qualityListings = this.applyQualityFilters(mspListings);
      
      // Convert to game format
      return this.convertToGameFormat(qualityListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      return this.getFallbackListings();
    }
  }

  // Fetch from a specific marketplace
  async fetchFromMarketplace(marketplace) {
    try {
      let response;
      
      if (marketplace.requiresAuth) {
        response = await axios.post(marketplace.url, {
          username: marketplace.credentials.username,
          password: marketplace.credentials.password
        });
      } else {
        response = await axios.get(marketplace.url);
      }
      
      return response.data.map(listing => ({
        ...listing,
        source: marketplace.name
      }));
    } catch (error) {
      console.error(`Error fetching from ${marketplace.name}:`, error);
      return [];
    }
  }

  // Filter for MSP (Managed Service Provider) businesses
  filterMSPListings(listings) {
    const mspKeywords = [
      'managed service provider', 'msp', 'it services', 
      'it support', 'tech support', 'computer services',
      'network services', 'cloud services', 'cybersecurity'
    ];
    
    return listings.filter(listing => {
      const text = `${listing.title} ${listing.description}`.toLowerCase();
      return mspKeywords.some(keyword => text.includes(keyword));
    });
  }

  // Apply quality filters based on requirements
  applyQualityFilters(listings) {
    return listings.filter(listing => {
      // Filter for recurring revenue
      const hasRecurringRevenue = listing.recurringRevenue > 0.5; // >50% recurring
      
      // Filter for net income
      const hasGoodIncome = listing.netIncome >= 500000; // $500K+
      
      // Filter for customer concentration
      const hasLowCustomerConcentration = 
        !listing.customerConcentration || listing.customerConcentration < 0.3; // <30% from single client
      
      // Filter for geographic focus (US, Mexico, Canada)
      const inTargetRegion = ['US', 'USA', 'Mexico', 'Canada'].includes(listing.country);
      
      return hasRecurringRevenue && hasGoodIncome && hasLowCustomerConcentration && inTargetRegion;
    });
  }

  // Convert marketplace listings to game format
  convertToGameFormat(listings) {
    return listings.map((listing, index) => {
      // Generate random position on the map
      const position = {
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400
      };
      
      // Generate random gems based on business strengths
      const gems = this.generateGems(listing);
      
      // Generate risks based on business weaknesses
      const risks = this.generateRisks(listing);
      
      // Calculate time remaining (fresh deals have more time)
      const timeRemaining = 100 - (Date.now() - new Date(listing.listedDate)) / (24 * 60 * 60 * 1000);
      
      // Determine status based on time remaining
      let status = 'fresh';
      if (timeRemaining <= 25) {
        status = 'stale';
      } else if (timeRemaining <= 75) {
        status = 'aging';
      }
      
      return {
        id: `deal-${index}-${Date.now()}`,
        name: listing.title || `MSP Business ${index + 1}`,
        location: listing.location || 'Unknown Location',
        industry: 'IT Services',
        description: listing.description || 'Managed Service Provider business',
        financials: {
          recurringRevenue: listing.recurringRevenue || 0.7,
          netIncome: listing.netIncome || 600000,
          employees: listing.employees || 10
        },
        ownerInvolvement: listing.ownerInvolvement || 'Medium',
        risks: risks,
        gems: gems,
        boss: {
          type: risks.length > 0 ? risks[0].type : 'Cashflow Phantom',
          defeated: false
        },
        timeRemaining: Math.max(0, timeRemaining),
        status: status,
        pursued: false,
        position: position,
        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        sourceMarketplace: listing.source
      };
    });
  }

  // Generate gems based on business strengths
  generateGems(listing) {
    const allGemTypes = [
      { type: 'Revenue Relic', description: 'High recurring revenue and strong financials' },
      { type: 'Automation Crystal', description: 'Low owner involvement, stable operations' },
      { type: 'Security Core', description: 'High customer retention, low churn, reliable contracts' },
      { type: 'Scalability Spark', description: 'Growth potential and ability to expand' },
      { type: 'Market Magnet', description: 'Strong market position or niche dominance' }
    ];
    
    // Randomly select 3 gems
    const selectedGems = [];
    const availableGems = [...allGemTypes];
    
    for (let i = 0; i < 3; i++) {
      if (availableGems.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableGems.length);
      const gem = availableGems.splice(randomIndex, 1)[0];
      
      selectedGems.push({
        id: `gem-${i}-${Date.now()}`,
        ...gem,
        collected: false,
        position: {
          x: 100 + Math.random() * 600,
          y: 100 + Math.random() * 400
        }
      });
    }
    
    return selectedGems;
  }

  // Generate risks based on business weaknesses
  generateRisks(listing) {
    const allRiskTypes = [
      { type: 'Customer Concentration Hydra', description: 'Too much revenue from a single client (80%+ risk).' },
      { type: 'Owner Reliance Doom-Bot', description: 'The owner is the business (no real team in place).' },
      { type: 'Cashflow Phantom', description: 'Weak profitability, hidden debt, or unsustainable growth.' }
    ];
    
    const risks = [];
    
    // Check for customer concentration
    if (listing.customerConcentration && listing.customerConcentration > 0.2) {
      risks.push(allRiskTypes[0]);
    }
    
    // Check for owner reliance
    if (listing.ownerInvolvement === 'High') {
      risks.push(allRiskTypes[1]);
    }
    
    // Check for cashflow issues
    if (listing.netIncome < 600000 || listing.debt > 0) {
      risks.push(allRiskTypes[2]);
    }
    
    // If no risks detected, randomly add one (for gameplay purposes)
    if (risks.length === 0 && Math.random() > 0.3) {
      const randomIndex = Math.floor(Math.random() * allRiskTypes.length);
      risks.push(allRiskTypes[randomIndex]);
    }
    
    return risks;
  }

  // Provide fallback listings in case API calls fail
  getFallbackListings() {
    return [
      {
        id: 'deal-1-fallback',
        name: 'SecureNet Solutions',
        location: 'Austin, TX',
        industry: 'IT Services',
        description: 'Established MSP with strong client base in healthcare sector',
        financials: {
          recurringRevenue: 0.87,
          netIncome: 750000,
          employees: 12
        },
        ownerInvolvement: 'Medium',
        risks: [
          { type: 'Customer Concentration Hydra', description: 'Too much revenue from a single client (85% risk).' }
        ],
        gems: [
          { id: 'gem-1-1', type: 'Revenue Relic', description: 'High recurring revenue and strong financials', collected: false, position: { x: 200, y: 150 } },
          { id: 'gem-1-2', type: 'Security Core', description: 'High customer retention, low churn, reliable contracts', collected: false, position: { x: 400, y: 250 } },
          { id: 'gem-1-3', type: 'Automation Crystal', description: 'Low owner involvement, stable operations', collected: false, position: { x: 600, y: 350 } }
        ],
        boss: {
          type: 'Customer Concentration Hydra',
          defeated: false
        },
        timeRemaining: 85,
        status: 'fresh',
        pursued: false,
        position: { x: 300, y: 200 },
        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sourceMarketplace: 'fallback'
      },
      {
        id: 'deal-2-fallback',
        name: 'CloudSync MSP',
        location: 'Toronto, CA',
        industry: 'IT Services',
        description: 'Cloud-focused MSP specializing in AWS and Azure migrations',
        financials: {
          recurringRevenue: 0.92,
          netIncome: 620000,
          employees: 8
        },
        ownerInvolvement: 'High',
        risks: [
          { type: 'Owner Reliance Doom-Bot', description: 'The owner is the business (no real team in place).' }
        ],
        gems: [
          { id: 'gem-2-1', type: 'Revenue Relic', description: 'High recurring revenue and strong financials', collected: false, position: { x: 150, y: 200 } },
          { id: 'gem-2-2', type: 'Scalability Spark', description: 'Growth potential and ability to expand', collected: false, position: { x: 350, y: 300 } },
          { id: 'gem-2-3', type: 'Market Magnet', description: 'Strong market position or niche dominance', collected: false, position: { x: 550, y: 400 } }
        ],
        boss: {
          type: 'Owner Reliance Doom-Bot',
          defeated: false
        },
        timeRemaining: 65,
        status: 'aging',
        pursued: false,
        position: { x: 500, y: 300 },
        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        sourceMarketplace: 'fallback'
      },
      {
        id: 'deal-3-fallback',
        name: 'DataVault IT',
        location: 'Denver, CO',
        industry: 'IT Services',
        description: 'Data backup and recovery specialist with strong SMB client base',
        financials: {
          recurringRevenue: 0.78,
          netIncome: 580000,
          employees: 15
        },
        ownerInvolvement: 'Low',
        risks: [],
        gems: [
          { id: 'gem-3-1', type: 'Automation Crystal', description: 'Low owner involvement, stable operations', collected: false, position: { x: 250, y: 150 } },
          { id: 'gem-3-2', type: 'Security Core', description: 'High customer retention, low churn, reliable contracts', collected: false, position: { x: 450, y: 250 } },
          { id: 'gem-3-3', type: 'Market Magnet', description: 'Strong market position or niche dominance', collected: false, position: { x: 650, y: 350 } }
        ],
        boss: {
          type: 'Cashflow Phantom',
          defeated: false
        },
        timeRemaining: 30,
        status: 'stale',
        pursued: false,
        position: { x: 700, y: 400 },
        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        sourceMarketplace: 'fallback'
      }
    ];
  }
}

export default new DataSourcingService();

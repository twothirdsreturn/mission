// Integration of data sourcing with game initialization
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setupDealRefresh } from '../actions/dealActions';
import DataIntegration from './DataIntegration';

// This component doesn't render anything visible
// It just handles the data integration when the game starts
const DataIntegration = ({ setupDealRefresh }) => {
  useEffect(() => {
    // Set up deal refresh when the game starts
    setupDealRefresh();
    
    // Log that data integration is active
    console.log('Data integration initialized - MSP listings will refresh hourly');
  }, [setupDealRefresh]);
  
  // This component doesn't render anything
  return null;
};

const mapDispatchToProps = {
  setupDealRefresh
};

export default connect(null, mapDispatchToProps)(DataIntegration);

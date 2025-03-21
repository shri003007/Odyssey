'use client';

import { useState } from 'react';
import { Button } from '@sparrowengg/twigs-react';
import LoadingModal from './LoadingModal';

/**
 * Example component showing how to use the LoadingModal
 * 
 * This demonstrates:
 * 1. Triggering the modal on API calls
 * 2. Closing it when the operation is complete
 * 3. Allowing manual closing
 */
const LoadingModalExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 60000));
      // Your actual API call would go here
      // const response = await fetch('/api/your-endpoint');
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, create a faster version
  const handleQuickApiCall = async () => {
    setIsLoading(true);
    
    try {
      // Simulate a shorter API call (15 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6">
      <h2 className="text-xl font-semibold">Loading Modal Demo</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Click buttons below to see the loading modal in action.
      </p>
      
      <div className="flex space-x-4">
        <Button onClick={handleQuickApiCall}>
          Quick API Call (15s)
        </Button>
        
        <Button onClick={handleApiCall} variant="outline">
          Long API Call (60s)
        </Button>
      </div>
      
      <LoadingModal 
        isOpen={isLoading} 
        onClose={() => setIsLoading(false)} 
      />
    </div>
  );
};

export default LoadingModalExample; 
'use client'
import { Box } from '@sparrowengg/twigs-react';
import { IdeasProvider, useIdeasContext } from './context/IdeasContext';
import { Step } from './components';
import { useEffect } from 'react';

export default function IdeasPage() {
  const { generating } = useIdeasContext();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, []);

  console.log(generating, 'generating');
  
  return (
    <IdeasProvider>
      <Box className="container py-2 px-4">
        {/* <Heading css={{ fontSize: '$2xl', fontWeight: '$7', color: '$neutral900' }}>Content Ideas</Heading> */}
        <Step />
      </Box>
    </IdeasProvider>
  );
}
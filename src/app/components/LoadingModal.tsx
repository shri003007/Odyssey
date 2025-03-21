import { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, keyframes, styled } from '@sparrowengg/twigs-react';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeout?: number; // Optional timeout in milliseconds
}

// Animation keyframes
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
});

const float = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-10px)' }
});

// Styled components
const ModalOverlay = styled(Box, {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
});

const ModalContent = styled(Box, {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '40px',
  width: '90%',
  maxWidth: '450px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px'
});

// Commented out as it's not being used
// const CloseButton = styled(Box, {
//   position: 'absolute',
//   top: '16px',
//   right: '16px',
//   cursor: 'pointer',
//   color: '$neutral600',
//   '&:hover': {
//     color: '$neutral900'
//   }
// });

const SpinnerCircle = styled(Box, {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: '4px solid transparent',
  borderTopColor: '$primary500',
  borderBottomColor: '$primary500',
  animation: `${spin} 1.2s linear infinite`
});

const SpinnerInner = styled(Box, {
  position: 'absolute',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: '4px solid transparent',
  borderLeftColor: '$secondary500',
  borderRightColor: '$secondary500',
  animation: `${spin} 0.8s linear infinite reverse`,
  top: '6px',
  left: '6px'
});

const MessageText = styled(Text, {
  animation: `${pulse} 2s ease-in-out infinite`,
  textAlign: 'center',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: 1.5
});

const FloatingDot = styled(Box, {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '$primary500',
  position: 'absolute',
  animation: `${float} 3s ease-in-out infinite`
});

const LoadingModal = ({ isOpen, onClose, timeout }: LoadingModalProps) => {
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  // Track time internally without a state variable
  const timeRef = useRef(0);

  // Messages to display at different time intervals
  const messages = [
    { time: 0, message: 'Loading...' },
    { time: 10, message: 'Hang tight, we\'re fetching the data!' },
    { time: 20, message: 'Still working on it...' },
    { time: 35, message: 'Almost there...' },
    { time: 50, message: 'Just a bit longer...' }
  ];

  useEffect(() => {
    if (!isOpen) {
      timeRef.current = 0;
      setLoadingMessage('Loading...');
      return;
    }

    const timer = setInterval(() => {
      timeRef.current += 1;
      
      // Check if we should update the message
      const messageToShow = [...messages]
        .reverse()
        .find(msg => timeRef.current >= msg.time);
        
      if (messageToShow && messageToShow.message !== loadingMessage) {
        setLoadingMessage(messageToShow.message);
      }
      
      // If there's a timeout specified, close the modal after that time
      if (timeout && timeRef.current >= timeout / 1000) {
        onClose();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, messages, loadingMessage, timeout, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {/* <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton> */}
        
        <Flex direction="column" alignItems="center" gap="$6" css={{ position: 'relative' }}>
          {/* Floating decorative elements */}
          <FloatingDot css={{ 
            top: '-20px', 
            left: '10px',
            animationDelay: '0s',
            opacity: 0.8,
            backgroundColor: '$primary400'
          }} />
          <FloatingDot css={{ 
            top: '40px', 
            right: '-30px',
            animationDelay: '0.7s',
            opacity: 0.6,
            backgroundColor: '$secondary400'
          }} />
          <FloatingDot css={{ 
            bottom: '0px', 
            left: '-20px',
            animationDelay: '1.4s',
            opacity: 0.7,
            backgroundColor: '$accent400'
          }} />
          
          <Box css={{ position: 'relative' }}>
            <SpinnerCircle>
              <SpinnerInner />
            </SpinnerCircle>
          </Box>
          
          <Box>
            <MessageText>{loadingMessage}</MessageText>
            <Text size="sm" css={{ marginTop: '8px', color: '$neutral600', textAlign: 'center' }}>
              This may take up to a minute
            </Text>
          </Box>
        </Flex>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoadingModal; 
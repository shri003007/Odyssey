import { Box, Flex, Stepper, StepperItem } from '@sparrowengg/twigs-react';
import { useIdeasContext } from '../context/IdeasContext';
import ContentIdea from './ContentIdea';
import ReviewAndGenerate from './ReviewAndGenerate';
import ProfileAndProjectSelection from './ProfileAndProjectSelection';
import BlogsPreview from './BlogsPreview';
import LoadingModal from '../../components/LoadingModal';

const Loader = () => {
  return (
    <LoadingModal 
      isOpen={true} 
      onClose={() => {}} 
    />
  )
}

const Step = () => {
  const { activeStep, generating } = useIdeasContext();

  function renderCustomSeparator() {
    return (
      <Box css={{ backgroundColor: '#F1F1F1', width: '100%', height: '4px', borderRadius: '10px' }}>
      </Box>
    );
  }

  return (
    <>
      {generating && <Loader />}
      <Stepper
        activeStep={activeStep}
        components={{
          Container: ({ children }: { children: React.ReactNode }) => (
            <Flex
              gap={6}
              alignItems="center"
              css={{
                backgroundColor: 'transparent',
                padding: '$4',
                width: '80%',
                marginInline: 'auto'
              }}
            >
              {children}
            </Flex>
          ),
          Separator: () => renderCustomSeparator(),
          Step: ({
            children,
            active,
            completed,
            position
          }: {
            children: React.ReactNode,
            active: boolean,
            completed: boolean,
            position: number
          }) => (
            <Flex flexDirection="column" alignItems="center" justifyContent="center" 
              // onClick={() => setActiveStep(position)}
            >
              <Flex alignItems="center" justifyContent="center" css={{
                backgroundColor: active || completed ? '$accent500' : '$secondary50',
                color: active || completed ? 'white' : '$secondary500',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
              }}>
                {position + 1}
              </Flex>
              <Box css={{ width: 'max-content', marginTop: '$4' }}>
                {children}
              </Box>
            </Flex>
          )
        }}
      >
        <StepperItem
          label="Content Ideas"
          allowClick
          css={{
            padding: '$4'
          }}
        >
          <ContentIdea />
        </StepperItem>
        <StepperItem
          label="Review & Generate Blogs"
          css={{
            padding: '$4'
          }}
        >
          <ReviewAndGenerate />
        </StepperItem>
        <StepperItem
          label="Profile & Project Selection"
          allowClick
          css={{
            padding: '$4'
          }}
        >
          <ProfileAndProjectSelection />
        </StepperItem>
        <StepperItem
          label="Save and Schedule"
          allowClick
          css={{
            padding: '$4'
          }}
        >
          <BlogsPreview />
        </StepperItem>
      </Stepper>
    </>
  );
};

export default Step; 
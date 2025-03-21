import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Box, Button, Flex, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@sparrowengg/twigs-react';
import { useIdeasContext } from '../context/IdeasContext';
import BlogPostEditor from './BlogPostEditor';

const ReviewAndGenerate = () => {
  const { generating, prevStep, selectedProject, nextStep, updatedContentPieces, contentPiecesObj, handleContentUpdate } = useIdeasContext();
  

  return (
    <Box>
      <Box css={{ padding: '$12', maxHeight: 'calc(100vh - 250px)', overflow: 'scroll', border: '2px solid #F1F1F1', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
        <Text size="lg">Review and Customise Content</Text>
        <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>Review the generated content, make necessary edits.</Text>

        {selectedProject && (
          <Box css={{ marginTop: '$2', padding: '$4', backgroundColor: '$blue50', borderRadius: '$md' }}>
            <Text size="sm">Selected Project: <strong>{selectedProject.label}</strong></Text>
          </Box>
        )}

        <Tabs css={{ marginTop: '$12' }} defaultValue={`${updatedContentPieces?.[0]?.content_id}`}>
          <TabsList aria-label="content tabs">
            {Object.keys(contentPiecesObj).map((item) => (
              <TabsTrigger key={item} value={item}> {contentPiecesObj[item].content_type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(contentPiecesObj).map((item) => (
            <TabsContent key={item} value={item}>
              <BlogPostEditor 
                content={contentPiecesObj[item]} 
                onContentChange={handleContentUpdate}
              />
            </TabsContent>
          ))}
        </Tabs>

      </Box>

      <Flex css={{ marginTop: '$12' }} justifyContent="flex-end" gap="$4" alignItems="center">
        <Button size="lg" leftIcon={<ArrowLeft />} onClick={() => prevStep()} variant="outline">Back</Button>

        <Button rightIcon={<ArrowRight />} size="lg" onClick={() => nextStep()} disabled={generating} loading={generating}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default ReviewAndGenerate; 
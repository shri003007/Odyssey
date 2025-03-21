import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Box, Button, Flex, Select, Text, toast } from '@sparrowengg/twigs-react';
import { useIdeasContext } from '../context/IdeasContext';
import { useAppSelector } from '@/redux/hooks';
import { Profile, Project, selectProfiles, selectProjects } from '@/redux';
import { contentTypes } from '../constants';
import { Results } from '../types';
import { uniqueId } from 'lodash';
import { useAuth } from "@/context/auth-provider";
import { createProject } from '@/app/lib/projects'

const ProfileAndProjectSelection = () => {
  const { nextStep, setSelectedProfile, prevStep, setSelectedProject, selectedProfile, selectedProject, updatedContentPieces, setGenerating, setFinalContents } = useIdeasContext();
  const projects = useAppSelector(selectProjects);
  const profiles = useAppSelector(selectProfiles).map((profile: Profile) => ({
    name: profile.name,
    description: profile.description,
    value: profile.id
  }));
  const { userId } = useAuth();

  // Handle profile selection
  const handleProfileSelection = (profile: { name: string, value: string, description: string }) => {
    setSelectedProfile(profile);
  };

  const handleProjectSelection = (selectedProject: { label: string, value: string, __isNew__?: boolean }) => {
    setSelectedProject(selectedProject);
  };


  // Updated function to generate final content with the current state
  const handleGenerateFinalContent = async () => {
    setGenerating(true);
    // Prepare payload with updated content pieces and selected profile

    let newProjectId = null;

    if (selectedProject?.__isNew__) {
      try {
        const response = await createProject({
          name: selectedProject.label,
          description: selectedProject.label || "",
          user_id: userId || ""
        })
        newProjectId = response.id;
      } catch (err) {
        console.log(err, 'err');
        toast({
          title: 'Error creating project',
          variant: 'error'
        })
        setGenerating(false);
        return;
      }
    }

    const payload = {
      "user_id": userId,
      "project_id": (selectedProject?.__isNew__ ? newProjectId : selectedProject?.value) || null,
      "profile_id": selectedProfile?.value || null,
      content_items: updatedContentPieces.map(piece => {
        const { content_type, title, ...rest } = piece;
        return {
          ...rest,
          medium: content_type,
          topic: title,
          content_type_id: contentTypes.find(type => type.value === content_type)?.id,
          model:"gpt-4o"
        };
      }),
    };

    // /create-contents
    try {
      const response = await fetch('https://k6lhtivh5jxkfvhrkdu52w4xw40osxad.lambda-url.us-west-2.on.aws/create-contents', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('success', data);
        const newData = data.results.map((item: Results) => ({
          ...item,
          id: uniqueId(),
          medium: item.medium.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));
        setFinalContents(newData);
        nextStep();
        setGenerating(false);
        return;
      }
    } catch (err) {
      console.log(err, 'err');
      toast({
        title: 'Error generating final content',
        variant: 'error'
      })
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box>
      <Box css={{ padding: '$12', border: '2px solid #F1F1F1', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
        <Text size="lg">Select Project and Profile where you want to publish the content</Text>
        <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>Choose the project and content profile to proceed.</Text>
        <Box css={{ marginTop: '$12' }}>
          <Select
            placeholder="Select a project"
            options={projects?.map((item: Project) => ({
              label: item.name,
              value: item.id
            })) || []}
            css={{
              width: '40%'
            }}
            formatCreateLabel={(inputValue: string) => `Create a new project: ${inputValue}`}
            isCreatable={true}
            onChange={handleProjectSelection}
            size="lg"
            label="Select Project"
          />
        </Box>
        <Box css={{ marginTop: '$12' }}>
          <Text size="lg">Select content profile</Text>
          <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>Choose tone and style for your generated content.</Text>
          <Flex css={{ marginTop: '$12' }} gap="$4" wrap="wrap">
            {profiles.map((item: { name: string, value: string, description: string }) => (
              <Button
                css={{
                  width: '200px',
                  height: 'auto',
                  padding: '$8',
                  borderRadius: '10px',
                  textAlign: 'left',
                  backgroundColor: selectedProfile?.name === item.name ? '$secondary50 !important' : undefined
                }}
                key={item.name}
                variant="outline"
                onClick={() => handleProfileSelection(item)}
              >
                <Text size="md">{item.name}</Text>
                <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>{item.description}</Text>
              </Button>
            ))}
          </Flex>
        </Box>
      </Box>

      <Flex css={{ marginTop: '$12' }} gap="$4" justifyContent="flex-end" alignItems="center">
        <Button 
          size="lg" 
          leftIcon={<ArrowLeft />} 
          onClick={() => prevStep()} 
          variant="outline"
        >
          Back
        </Button>
        <Button 
          size="lg" 
          rightIcon={<ArrowRight />} 
          onClick={handleGenerateFinalContent} 
          disabled={!selectedProfile || !selectedProject}
        >
          Generate Final Content
        </Button>
      </Flex>
    </Box>
  );
};

export default ProfileAndProjectSelection;
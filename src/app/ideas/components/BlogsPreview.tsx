"use client"
import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Box, Button, Calendar, Checkbox, Flex, Tabs, TabsContent, TabsList, TabsTrigger, Text, toast, keyframes, styled, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverPortal, Select, FormLabel } from "@sparrowengg/twigs-react";
import { EditorToolbar } from "@/components/editor-toolbar";
import { SparrowMenu } from "@/components/sparrow-menu";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Editor } from "@tiptap/core";
import { DateRange, useIdeasContext } from '../context/IdeasContext';
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";

function removeMarkdownFormatting(content) {
  if (!content) return content;
  
  // Remove opening backticks with optional language identifier
  let cleaned = content.replace(/^```[\w-]*\s*\n?/, '');
  
  // Remove closing backticks
  cleaned = cleaned.replace(/\s*```$/, '');
  
  return cleaned;
}
interface EditorState {
  id: string;
  content: string;
  editorRef: React.MutableRefObject<Editor | null>;
  scheduled: boolean;
  project_id: string;
  topic: string;
  content_id: number;
  publishDate: string | null;
}

// Pre-create editor refs outside the component
// const createEditorRefs = () => results.map(() => ({ current: null }));

// Add styled components for the loader modal
const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const pulse = keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
  '50%': { opacity: 0.5, transform: 'scale(0.95)' }
});

const float = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-10px)' }
});

const ModalOverlay = styled(Box, {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: `${fadeIn} 0.3s ease-out`
});

const LoaderContainer = styled(Box, {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '32px',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  position: 'relative'
});

const SpinnerCircle = styled(Box, {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: '4px solid $primary100',
  borderTopColor: '$primary500',
  margin: '0 auto 24px',
  animation: `${spin} 1.2s linear infinite`
});

const MessageText = styled(Text, {
  animation: `${pulse} 2s ease-in-out infinite`,
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: 1.5,
  marginBottom: '8px'
});

const Dot = styled(Box, {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  position: 'absolute',
  animation: `${float} 3s ease-in-out infinite`
});

// Later in the component, add the LoaderModal component with complete implementation
const LoaderModal = ({ isOpen, isSuccess }: { isOpen: boolean; isSuccess?: boolean }) => {
  const [message, setMessage] = useState("Saving content...");
  
  // Define messages to display at different time intervals
  const messages = [
    { time: 0, message: "Saving content..." },
    { time: 5, message: "Processing your edits..." },
    { time: 10, message: "Almost there..." },
    { time: 20, message: "Just a bit longer..." },
    { time: 30, message: "Finalizing your changes..." }
  ];

  // Update message based on elapsed time
  useEffect(() => {
    if (!isOpen || isSuccess) {
      setMessage(isSuccess ? "Content saved successfully!" : "Saving content...");
      return;
    }

    let elapsedTime = 0;
    const timer = setInterval(() => {
      elapsedTime += 1;
      
      // Find the appropriate message for this time
      const messageToShow = [...messages]
        .reverse()
        .find(msg => elapsedTime >= msg.time);
        
      if (messageToShow && messageToShow.message !== message) {
        setMessage(messageToShow.message);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess, message, messages]);

  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <LoaderContainer>
        <Dot css={{ 
          backgroundColor: '$primary400', 
          top: '15px', 
          left: '15px',
          animationDelay: '0s' 
        }} />
        <Dot css={{ 
          backgroundColor: '$secondary400', 
          top: '25px', 
          right: '20px',
          animationDelay: '0.5s' 
        }} />
        <Dot css={{ 
          backgroundColor: '$accent400', 
          bottom: '20px', 
          left: '25px',
          animationDelay: '1s' 
        }} />
        
        {isSuccess ? (
          <Box css={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '$green500'
          }}>
            <CheckCircle size={60} />
          </Box>
        ) : (
          <SpinnerCircle />
        )}
        
        <MessageText>{message}</MessageText>
        <Text size="sm" css={{ color: '$neutral600' }}>
          {isSuccess ? "Redirecting to calendar..." : "This may take up to a minute"}
        </Text>
      </LoaderContainer>
    </ModalOverlay>
  );
};

const BlogsPreview = () => {
  const { prevStep, finalContents: results } = useIdeasContext();
  // Use resultsFromContext if available, otherwise fallback to sample data
  const contentResults = results && results.length > 0 ? results.map((result) => ({
    ...result,
    content: removeMarkdownFormatting(result.content)
  })) : [];
  
  const [selectedText] = useState("");
  const [menuPosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState(contentResults?.[0]?.id || "");

  // Create individual refs for each editor
  const editorRef1 = useRef<Editor | null>(null);
  const editorRef2 = useRef<Editor | null>(null);
  const editorRef3 = useRef<Editor | null>(null);

  const { userId } = useAuth();
  
  // Pre-define the editor refs array
  const editorRefs = [editorRef1, editorRef2, editorRef3];
  
  // Create an array of editor states for each content piece
  const [editorStates, setEditorStates] = useState<EditorState[]>(() => 
    contentResults.map((result, index) => ({
      id: result.id,
      content: result.content,
      content_id: result.content_id,
      editorRef: editorRefs[index],
      scheduled: true,
      topic: result.topic,
      project_id: result.project_id,
      publishDate: result.publish_at || null
    }))
  );

  console.log(editorStates, 'editorStates');
  

  // Initialize the active tab
  useEffect(() => {
    if (contentResults.length > 0 && !activeTab) {
      setActiveTab(contentResults[0].id);
    }
  }, [activeTab]);

  // Update editor content handler
  const handleUpdateContent = useCallback((id: string, newContent: string) => {
    setEditorStates((prev) =>
      prev.map((state) =>
        state.id === id
          ? {
              ...state,
              content: newContent,
            }
          : state
      )
    );
  }, []);

  // Format text handler
  const handleFormatText = (format: string) => {
    const currentState = editorStates.find((state) => state.id === activeTab);
    if (!currentState) return;

    const editor = currentState.editorRef.current;
    if (!editor) return;

    editor.commands.focus();
    switch (format) {
      case "bold":
        editor.commands.toggleBold();
        break;
      case "italic":
        editor.commands.toggleItalic();
        break;
      case "underline":
        editor.commands.toggleUnderline();
        break;
      case "strike":
        editor.commands.toggleStrike();
        break;
      case "code":
        editor.commands.toggleCode();
        break;
      case "highlight":
        editor.commands.toggleHighlight();
        break;
      case "link":
        const url = window.prompt("Enter the URL");
        if (url) {
          editor.commands.setLink({ href: url });
        }
        break;
      case "image":
        const src = window.prompt("Enter the image URL");
        if (src) {
          editor.commands.setImage({ src });
        }
        break;
      case "bulletList":
        editor.commands.toggleBulletList();
        break;
      case "orderedList":
        editor.commands.toggleOrderedList();
        break;
      case "blockquote":
        editor.commands.toggleBlockquote();
        break;
      case "h1":
        editor.commands.toggleHeading({ level: 1 });
        break;
      case "h2":
        editor.commands.toggleHeading({ level: 2 });
        break;
      case "h3":
        editor.commands.toggleHeading({ level: 3 });
        break;
      case "alignLeft":
        editor.commands.setTextAlign("left");
        break;
      case "alignCenter":
        editor.commands.setTextAlign("center");
        break;
      case "alignRight":
        editor.commands.setTextAlign("right");
        break;
      case "alignJustify":
        editor.commands.setTextAlign("justify");
        break;
      default:
        break;
    }
  };

  const router = useRouter();

  // Save all content
  const handleSaveAllContent = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Get all content pieces
      const editedContents = editorStates;
      
      if (editedContents.length === 0) {
        return;
      }

      // Create an array of promises for parallel execution
      const savePromises = editedContents.map(async (content) => {
        const markdownContent = content.editorRef.current?.storage.markdown.getMarkdown();
        console.log(markdownContent,'markdownContent');

        const contentToSave = {
          name: content.topic,
          content: markdownContent || content.content, // Fallback to existing content if markdown fails
          project_id: content.project_id
        };
        
        // Make API call for this content piece
        const response = await fetch(
          `https://rmenimqqad.execute-api.us-west-2.amazonaws.com/api/content/${content.content_id}/user/${userId}`, 
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contentToSave),
          }
        );
        
        if (!response.ok) {
          // If this specific request failed, throw an error with content ID
          // toast({
          //   title: 'Error saving content',
          //   description: `Failed to save content ${content.id}: ${response.statusText}`,
          //   variant: 'error'
          // });
          
          return { id: content.id, success: false };
        }
        
        return { id: content.id, success: true };
      });
      
      // Execute all API calls in parallel and wait for them to complete
      const apiResults = await Promise.all(savePromises);

      const failedContentIds = apiResults.filter(result => !result.success).map(result => result.id);

      if (failedContentIds.length > 0) {
        toast({
          title: 'Error saving content. Please try again.',
          description: `Failed to save content ${failedContentIds.join(', ')}`,
          variant: 'error'
        });

        return;
      }

      const schedules = editedContents.filter(content => content.scheduled).map(content => content.content_id);
      
      console.log("Save results:", apiResults);
      if (schedules.length > 0) {
        // Get all the content_id and publish date from editorStates and only if scheduled is true
        const publishDates = editedContents.filter(content => content.scheduled).map(content => ({
          content_id: content.content_id,
          publish_at: content.publishDate,
          user_id: userId,
          status: "pending"
        }));

        console.log(publishDates, 'publishDates');
        // Loop through the publishDates and schedule the content and make POST call to /schedules
        // Use promises.all to schedule all the content
        const scheduleResults = await Promise.all(publishDates.map(async (publishDate) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL}/schedule`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(publishDate)
          });

          if (!response.ok) {
            // toast({
            //   title: 'Error scheduling content',
            //   variant: 'error'
            // });

            return { id: publishDate.content_id, success: false };
          }

          return { id: publishDate.content_id, success: true };
        }));  

        const failedScheduleIds = scheduleResults.filter(result => !result.success).map(result => result.id);

        if (failedScheduleIds.length > 0) {
          toast({
            title: 'Error scheduling content',
            variant: 'error'
          });
        }

        console.log(scheduleResults, 'scheduleResults');
      }

      if (schedules.length > 0) {
        toast({
          title: 'Content scheduled and saved successfully',
          variant: 'success'
        });
      } else {
        toast({
          title: 'Content saved successfully',
          variant: 'success'
        });
      }

      // Set success state and wait before redirecting
      setSaveSuccess(true);
      
      router.push('/calendar');

    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: 'Error saving content',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'error'
      });
      setSaveSuccess(false);
    } finally {
      // Keep isSaving true if we're showing success state
      if (!saveSuccess) {
        setIsSaving(false);
      }
    }
  };

  const handleScheduleContent = (id: string, checked: boolean) => {
    setEditorStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, scheduled: checked }
          : state
      )
    );
  };

  const setPublishDate = (id: string, value: DateRange | null) => {
    setEditorStates(prev => 
      prev.map(state => 
        state.id === id ? { ...state, publishDate: value } : state
      )
    );
  }

  return (
    <Box>
      <Box
        css={{
          padding: "$12",
          maxHeight: "calc(100vh - 250px)",
          overflow: "scroll",
          border: "2px solid #F1F1F1",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text size="lg">Final Content Review</Text>
        <Text
          size="sm"
          css={{ color: "$secondary500", marginTop: "$4", marginBottom: "$8" }}
        >
          Review and edit your generated content before saving or downloading.
        </Text>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList css={{ gap: '$6', border: '1px solid #F2F2F2', borderRadius: '10px', padding: '0', overflow: 'hidden' }} aria-label="Generated content tabs">
            {contentResults.map((result, idx) => (
              <TabsTrigger css={{ borderLeft: idx !== 0 ? '1px solid #F2F2F2' : 'none' }}  key={result.id} value={result.id}>
                <Flex flexDirection="column" alignItems="flex-start" gap="$2">
                  <Text size="lg" css={{ marginBottom: '$2' }}>{result.medium}</Text>
                  {/* {editorStates.find(state => state.id === result.id)?.isEdited && (
                    <Box css={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '$accent500' }} />
                  )} */}

                  <Checkbox size="sm" onChange={(e: boolean) => handleScheduleContent(result.id, e)} checked={editorStates.find(state => state.id === result.id)?.scheduled}>
                    <Text size="sm">Schedule: </Text>
                  </Checkbox>

                  <Flex flexDirection="row" gap="$4">
                    {/* <Text size="sm" css={{ color: '$secondary500' }}>{result.publish_at.split('T')[0]}</Text> */}
                    <CalendarPicker publishDate={editorStates.find(state => state.id === result.id)?.publishDate} setPublishDate={(value) => setPublishDate(result.id, value)} />

                    <TimePicker publishDate={editorStates.find(state => state.id === result.id)?.publishDate} setPublishDate={(value) => setPublishDate(result.id, value)} />
                  </Flex>
                </Flex>
              </TabsTrigger>
            ))}
          </TabsList>
          {contentResults.map((result, index) => {
            const editorState = editorStates.find(state => state.id === result.id);
      
            return (
              <TabsContent
                css={{ padding: 0 }}
                key={result.id}
                value={result.id}
              >
                <Box>
                  <EditorToolbar
                    onFormatText={handleFormatText}
                    editor={editorState?.editorRef.current || null}
                  />

                  <Box
                    css={{ ".tiptap-editor": { padding: 0 } }}
                    className="flex-1 overflow-y-auto relative min-h-[400px] border rounded-md"
                    ref={contentRef}
                  >
                    <TiptapEditor
                      content={editorState?.content || ""}
                      onUpdate={({ editor }) => {
                        if (editorState) {
                          handleUpdateContent(result.id, editor.getHTML());
                        }
                      }}
                      editorRef={editorRefs[index]}
                      contentId={result.id}
                    />
                    <SparrowMenu
                      isOpen={isMenuOpen && activeTab === result.id}
                      onClose={() => setIsMenuOpen(false)}
                      selectedText={selectedText}
                      onUpdateContent={(newContent) =>
                        handleUpdateContent(result.id, newContent)
                      }
                      fullContent={editorState?.content || ""}
                      position={menuPosition}
                    />
                  </Box>
                </Box>
              </TabsContent>
            );
          })}
        </Tabs>
      </Box>

      <Flex
        css={{ marginTop: "$12" }}
        justifyContent="flex-end"
        gap="$4"
        alignItems="center"
      >
        <Button
          size="lg"
          leftIcon={<ArrowLeft />}
          onClick={prevStep}
          variant="outline"
        >
          Back
        </Button>

        <Button 
          size="lg" 
          onClick={handleSaveAllContent} 
          disabled={isSaving} 
          loading={isSaving && !saveSuccess}
        >
          {isSaving && saveSuccess ? 'Saved!' : 'Save All Content'}
        </Button>
      </Flex>

      <LoaderModal isOpen={isSaving} isSuccess={saveSuccess} />
    </Box>
  );
};

export default BlogsPreview;

const CalendarPicker = ({ publishDate, setPublishDate }: { publishDate: string | null, setPublishDate: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  // Error here
  console.log(publishDate, 'publishDate');  
  const value = parseDate(publishDate?.toString().split('T')[0] || new Date().toISOString().split('T')[0]);
  console.log(value, ' val');

  const onDateChange = (date: DateValue | null) => {
    if (date) {
      const dateString = date.toString().split('T')[0];
      const timeString = publishDate?.toString().split('T')[1];
      setPublishDate(dateString + 'T' + timeString);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Box>
          <FormLabel>Date: </FormLabel>
          <Box css={{ minWidth: 'max-content', width: 'max-content', border: '1px solid #F1F1F1', padding: '$4', borderRadius: '10px' }}>
            <Text size="sm" css={{ color: '$neutral900', fontWeight: 500 }}>
              {value.toString()}
            </Text>
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent css={{ width: 'max-content', padding: 0, borderRadius: '20px' }}>
        <Calendar
          onChange={onDateChange}
          value={value}
          minValue={parseDate("2023-07-20")}
        />
          {/* <PopoverClose></PopoverClose> */}
          <PopoverArrow />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

const TimePicker = ({ publishDate, setPublishDate }: { publishDate: string | null, setPublishDate: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  
  // Parse initial time from publishDate if available
  const initialDate = publishDate ? new Date(publishDate) : new Date();
  const initialHours = initialDate.getHours();
  const hours12 = initialHours % 12 || 12; // Convert 0 to 12
  
  // Time state object
  const [timeState, setTimeState] = useState({
    hours: hours12,
    minutes: initialDate.getMinutes(),
    meridiem: initialHours >= 12 ? 'PM' : 'AM'
  });
  
  // Generate options for hours and minutes
  const hourOptions = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1)
  }));
  
  const minuteOptions = [0, 15, 30, 45].map(min => ({
    label: min.toString().padStart(2, '0'),
    value: String(min)
  }));
  
  const meridiemOptions = [
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' }
  ];
  
  // Handle time changes
  const handleTimeChange = (field: 'hours' | 'minutes' | 'meridiem', value: string) => {
    setTimeState(prev => ({
      ...prev,
      [field]: field === 'hours' || field === 'minutes' ? Number(value) : value
    }));
  };
  
  // Apply time selection
  const applyTimeSelection = () => {
    // Convert 12-hour format to 24-hour for Date object
    let hours24 = timeState.hours;
    if (timeState.meridiem === 'PM' && timeState.hours < 12) {
      hours24 = timeState.hours + 12;
    } else if (timeState.meridiem === 'AM' && timeState.hours === 12) {
      hours24 = 0;
    }
    
    // Create a new Date object with the selected time
    const newDate = new Date(initialDate);
    newDate.setHours(hours24);
    newDate.setMinutes(timeState.minutes);
    newDate.setSeconds(0);
    
    // Format the timestring - will be used in your payload later
    const timeString = newDate.toISOString();
    console.log('Time selection applied:', timeString);
    
    // Update the publishDate
    if (publishDate) {
      const dateObj = new Date(publishDate);
      dateObj.setHours(hours24);
      dateObj.setMinutes(timeState.minutes);
      dateObj.setSeconds(0);
      // Published date is a Time stamp
      // Split the time seperately and then join with the date
      const timeString = dateObj.toISOString().split('T')[1];
      const dateString = publishDate?.split('T')[0];
      setPublishDate(dateString + 'T' + timeString);
    }
    
    setOpen(false);
  };
  
  // Format time for display
  const getFormattedTime = () => {
    return `${timeState.hours}:${timeState.minutes.toString().padStart(2, '0')} ${timeState.meridiem}`;
  };
  
  return (
    <Box>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Box>
            <FormLabel>Time: </FormLabel>
            <Box css={{
              minWidth: 'max-content',
              width: 'max-content',
              border: '1px solid #F1F1F1',
              padding: '$4',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#E0E0E0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }
            }}>
              <Text size="sm" css={{ color: '$neutral900', fontWeight: 500 }}>
                {getFormattedTime()}
              </Text>
            </Box>
          </Box>
        </PopoverTrigger>

        <PopoverContent align="start" css={{ 
          width: '300px', 
          padding: '$4', 
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #F1F1F1'
        }}>
          <Flex flexDirection="column" gap="$4">
            <Text size="sm" weight="medium" css={{ marginBottom: '$1' }}>Select Time</Text>
            
            <Flex gap="$4" alignItems="flex-start">
              {/* Hours dropdown */}
              <Box css={{ flex: 1 }}>
                <Text size="xs" css={{ marginBottom: '$2', color: '$neutral600' }}>Hour</Text>
                <Select
                  size="md"
                  options={hourOptions}
                  value={{ label: String(timeState.hours), value: String(timeState.hours) }}
                  onChange={(value: { label: string, value: string }) => handleTimeChange('hours', value.value)}
                  css={{ width: '100%' }}
                />
              </Box>
              
              {/* Minutes dropdown */}
              <Box css={{ flex: 1 }}>
                <Text size="xs" css={{ marginBottom: '$2', color: '$neutral600' }}>Minute</Text>
                <Select
                  size="md"
                  options={minuteOptions}
                  value={{ label: String(timeState.minutes), value: String(timeState.minutes) }}
                  onChange={(value: { label: string, value: string }) => handleTimeChange('minutes', value.value)}
                  css={{ width: '100%' }}
                />
              </Box>
              
              {/* AM/PM dropdown */}
              <Box css={{ flex: 1 }}>
                <Text size="xs" css={{ marginBottom: '$2', color: '$neutral600' }}>AM/PM</Text>
                <Select
                  size="md"
                  options={meridiemOptions}
                  value={{ label: timeState.meridiem, value: timeState.meridiem }}
                  onChange={(value: { label: string, value: string }) => handleTimeChange('meridiem', value.value)}
                  css={{ width: '100%' }}
                />
              </Box>
            </Flex>
            
            <Flex justifyContent="flex-end" css={{ marginTop: '$2' }}>
              <Button 
                size="sm" 
                onClick={applyTimeSelection}
                css={{ fontWeight: 500 }}
              >
                Apply
              </Button>
            </Flex>
          </Flex>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

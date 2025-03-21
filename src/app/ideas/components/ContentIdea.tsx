import { Box, Button, CalendarRange, Flex, FormHelperText, FormLabel, Input, Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger, Text, Textarea } from '@sparrowengg/twigs-react';
import { DateRange, useIdeasContext } from '../context/IdeasContext';
import { contentTypes } from '../constants';
import { parseDate } from "@internationalized/date";
import { useState } from 'react';

const ContentIdea = () => {
  const { contentIdeaConfig, setContentIdeaConfig, generateContentIdeas, generating, error, setError, publishDate, setPublishDate } = useIdeasContext();

  const onContentTypesChange = (item: string) => {
    setContentIdeaConfig({ 
      ...contentIdeaConfig, 
      contentTypes: contentIdeaConfig.contentTypes.includes(item) 
        ? contentIdeaConfig.contentTypes.filter((type) => type !== item) 
        : [...contentIdeaConfig.contentTypes, item] 
    });
  };

  const onNumOfContentPiecesChange = (type: 'increment' | 'decrement') => {
    if (contentIdeaConfig.numOfContentPieces <= 1 && type === 'decrement') {
      return;
    }

    if (contentIdeaConfig.numOfContentPieces >= 5 && type === 'increment') {
      return;
    }

    setContentIdeaConfig({ 
      ...contentIdeaConfig, 
      numOfContentPieces: contentIdeaConfig.numOfContentPieces + (type === 'increment' ? 1 : -1) 
    });
  };

  const onTargetAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentIdeaConfig({ ...contentIdeaConfig, targetAudience: e.target.value });
  };

  return (
    <Box>
      <Box css={{ padding: '$12', maxHeight: 'calc(100vh - 250px)', overflow: 'scroll', border: '2px solid #F1F1F1', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
        <Text size="md"> What content would you like to create? </Text>
        <Text css={{ marginTop: '$3', color: '$secondary500' }} size="sm">Tell us about your business and we&apos;ll generate a list of content ideas for you.</Text>
        <Box css={{ margin: '$12 0' }}>
          <Textarea
            errorBorder={error && !contentIdeaConfig.contentIdea.trim().length}
            label="What's ur content idea?"
            rows="8"
            maxLength={500}
            requiredIndicator
            showCount
            resize="none"
            placeholder="I want to create a blog post about the benefits of using our product."
            value={contentIdeaConfig.contentIdea}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setContentIdeaConfig({ ...contentIdeaConfig, contentIdea: e.target.value })
              if (e.target.value.length) {
                setError(false);
              }
            }}
          />
          <FormHelperText css={{ marginTop: '$2' }}>
            Be specific about your topic, target audience, and what you want to achieve.
          </FormHelperText>
        </Box>

        <Flex css={{ margin: '$12 0' }}>
          <Box>
            <FormLabel requiredIndicator> Select the number of content pieces you want to create. </FormLabel>
            <Flex alignItems="center" justifyContent="center" css={{ width: 'max-content', marginTop: '$4' }}>
              <Button onClick={() => onNumOfContentPiecesChange('decrement')} color="default" css={{ backgroundColor: 'transparent', color: '$neutral900', border: '1.5px solid #F1F1F1', padding: '0', margin: '0', borderRadius: '4px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</Button>
              <Input readOnly value={contentIdeaConfig.numOfContentPieces} css={{ '&:hover, &:active, &:focus': { border: '1.5px solid #F1F1F1', boxShadow: 'none' }, textAlign: 'center', border: '1.5px solid #F1F1F1', borderLeft: 'none', borderRight: 'none', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0px' }} />
              <Button onClick={() => onNumOfContentPiecesChange('increment')} color="default" css={{ backgroundColor: 'transparent', color: '$neutral900', border: '1.5px solid #F1F1F1', padding: '0', margin: '0', borderRadius: '4px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</Button>
            </Flex>
            <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>Choose the number of content pieces you want to create for each selected type. (max 5)</Text>
          </Box>

          <CalendarPicker publishDate={publishDate} setPublishDate={setPublishDate} />
        </Flex>

        <FormLabel css={{ fontSize: '$md', fontWeight: '$7', color: '$neutral900' }} requiredIndicator> Select Content Types </FormLabel>
        <Flex css={{ marginTop: '$4' }} gap="$4" wrap="wrap">
          {contentTypes.map((item) => (
            <Button
              onClick={() => onContentTypesChange(item.value)}
              css={{
                flexBasis: '24%',
                border: '1.5px solid #F1F1F1',
                borderRadius: '10px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: contentIdeaConfig.contentTypes.includes(item.value) ? '$secondary50 !important' : 'transparent',
                '&:focus': {
                  backgroundColor: 'transparent'
                }
              }}
              key={item.value}
              color="default"
              variant="outline"
            >
              {item.type_name}
            </Button>
          ))}
        </Flex>

        <Box css={{ marginTop: '$12', width: '40%' }}>
          <Text size="sm" css={{ color: '$secondary500', marginBottom: '$4' }}>Target audience (Optional)</Text>
          <Flex alignItems="center" gap="$4">
            <Input placeholder="e.g. 25-35 year old female" value={contentIdeaConfig.targetAudience} onChange={onTargetAudienceChange} />
          </Flex>
          <Text size="sm" css={{ color: '$secondary500', marginTop: '$4' }}>Specifying your target audience helps us tailor the content to their needs and preferences.</Text>
        </Box>
      </Box>

      <Button css={{ marginTop: '$12', marginLeft: 'auto' }} disabled={generating} loading={generating} size="lg" onClick={generateContentIdeas}>Generate Content Ideas</Button>
    </Box>
  );
};

export default ContentIdea;

const CalendarPicker = ({ publishDate, setPublishDate }: { publishDate: DateRange | null, setPublishDate: (value: DateRange | null) => void }) => {
  const [open, setOpen] = useState(false);
  const value = {
    start: parseDate(publishDate?.start.toString() || new Date().toISOString()),
    end: parseDate(publishDate?.end.toString() || new Date(new Date().setDate(new Date().getDate() + 5)).toISOString())
  }

  return (
    <Box>
      <FormLabel requiredIndicator> When do you want to publish the content? </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Box css={{ minWidth: '200px', marginTop: '$4', width: 'max-content', padding: '$4', border: '1.5px solid #F1F1F1', borderRadius: '10px' }}>
            <Text size="sm" css={{ color: '$neutral900' }}>
              {value.start.toString() + ' - ' + value.end.toString()}
            </Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent css={{ width: 'max-content', padding: 0, borderRadius: '20px' }}>
          <CalendarRange
            onChange={setPublishDate}
            value={value}
            minValue={parseDate(new Date().toISOString().split('T')[0])}
            footerAction={() => {
              setOpen(false);
            }}
          />
          {/* <PopoverClose></PopoverClose> */}
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </Box>
  );
};
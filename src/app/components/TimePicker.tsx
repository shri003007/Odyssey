import { useState } from 'react';
import { Box, Button, Flex, FormLabel, Popover, PopoverTrigger, PopoverContent, PopoverArrow, Text } from "@sparrowengg/twigs-react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

/**
 * A time picker component that allows selecting hours and minutes
 * Returns ISO string with the selected time
 */
export const TimePicker = ({ value, onChange, label = "Time" }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  
  // Parse time from ISO string or use current time
  const defaultTime = value || new Date().toISOString();
  const [hours, setHours] = useState(new Date(defaultTime).getHours());
  const [minutes, setMinutes] = useState(new Date(defaultTime).getMinutes());
  
  // Common time presets for quick selection
  const timePresets = [
    { label: "9:00 AM", hours: 9, minutes: 0 },
    { label: "12:00 PM", hours: 12, minutes: 0 },
    { label: "3:00 PM", hours: 15, minutes: 0 },
    { label: "6:00 PM", hours: 18, minutes: 0 },
    { label: "9:00 PM", hours: 21, minutes: 0 }
  ];
  
  // Format time for display
  const formatTimeDisplay = (h: number, m: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hours12 = h % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };
  
  // Apply selected time and close popover
  const applyTime = () => {
    // Create a new date object from the original timestamp but with updated hours/minutes
    const date = new Date(defaultTime);
    date.setHours(hours);
    date.setMinutes(minutes);
    onChange(date.toISOString());
    setOpen(false);
  };
  
  return (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Box css={{ 
            minWidth: '100px', 
            marginTop: label ? '$2' : 0,
            padding: '$2 $3', 
            border: '1px solid #E0E0E0', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            <Text size="sm">{formatTimeDisplay(hours, minutes)}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent css={{ width: '240px', padding: '$3', borderRadius: '8px' }}>
          <Flex direction="column" gap="3">
            <Text size="sm" weight="medium">Select Time</Text>
            
            {/* Time presets */}
            <Flex direction="column" gap="2">
              {timePresets.map((preset) => (
                <Box 
                  key={preset.label}
                  css={{ 
                    padding: '$2',
                    borderRadius: '4px',
                    backgroundColor: hours === preset.hours && minutes === preset.minutes ? '$primary100' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '$primary50' }
                  }}
                  onClick={() => {
                    setHours(preset.hours);
                    setMinutes(preset.minutes);
                  }}
                >
                  <Text size="sm">{preset.label}</Text>
                </Box>
              ))}
            </Flex>
            
            {/* Custom time selection */}
            <Flex gap="2" alignItems="center">
              <Box css={{ flex: 1 }}>
                <Text size="xs" css={{ marginBottom: '$1' }}>Hour</Text>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #E0E0E0'
                  }}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                    </option>
                  ))}
                </select>
              </Box>
              
              <Box css={{ flex: 1 }}>
                <Text size="xs" css={{ marginBottom: '$1' }}>Minute</Text>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #E0E0E0'
                  }}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                >
                  {[0, 15, 30, 45].map((min) => (
                    <option key={min} value={min}>
                      {min.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </Box>
            </Flex>
            
            <Flex justifyContent="flex-end" css={{ marginTop: '$2' }}>
              <Button 
                size="sm"
                onClick={applyTime}
              >
                Apply
              </Button>
            </Flex>
          </Flex>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </Box>
  );
}; 
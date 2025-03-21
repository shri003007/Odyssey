import { Stepper, StepperItem } from "@sparrowengg/twigs-react";

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const activeStep = currentStep - 1;
  
  return (
    <div>
      <Stepper activeStep={activeStep}>
        <StepperItem label="Profile Info" />
        <StepperItem label="Content Types" />
      </Stepper>
    </div>
  )
}


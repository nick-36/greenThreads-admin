import React, { ReactElement, useState } from "react";
import { useFormContext } from "react-hook-form";

type NextFunction = () => void;

interface StepInfo {
  step: ReactElement;
  nextFunction?: NextFunction | null;
  fields?: string[];
  name: string;
  status?: "pending" | "current" | "completed"; // New status property
}

const useMultiStep = ({
  steps,
  form,
  submitHandlder,
  defaultStep = 0,
}: {
  steps: StepInfo[];
  form: any;
  submitHandlder: (data?: any) => void;
  defaultStep: number;
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(defaultStep);

  const next = async () => {
    const fields = steps[currentStepIndex]?.fields;
    const isValid = await form.trigger(fields);
    if (!isValid) return;
    const nextFunction = steps[currentStepIndex]?.nextFunction;
    if (nextFunction) {
      nextFunction();
    }
    if (currentStepIndex <= steps.length - 1) {
      if (currentStepIndex === steps.length - 1) {
        submitHandlder();
        return;
      }
      setCurrentStepIndex((prev) => (prev += 1));
    }
  };

  const previous = () => {
    if (currentStepIndex <= 0) return;
    setCurrentStepIndex((prev) => (prev -= 1));
  };

  const goTo = (index: number) => {
    if (index >= 0 && index < steps.length - 1) {
      setCurrentStepIndex(index);
    }
  };

  // const customNext = async () => {
  //   const fields = steps[currentStepIndex]?.fields;
  //   const isValid = await form.trigger(fields);
  //   if (!isValid) return;
  //   const nextFunction = steps[currentStepIndex]?.nextFunction;
  //   if (nextFunction) {
  //     nextFunction();
  //   }
  //   next(); // Execute default next functionality
  // };

  const updatedSteps = steps.map((step, index) => {
    if (index < currentStepIndex) {
      return { ...step, status: "completed" };
    } else if (index === currentStepIndex) {
      return { ...step, status: "current" };
    } else {
      return { ...step, status: "pending" };
    }
  });
  return {
    currentStepIndex,
    next,
    previous,
    goTo,
    step: updatedSteps[currentStepIndex]?.step,
    steps: updatedSteps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    // customNext,
  };
};

export default useMultiStep;

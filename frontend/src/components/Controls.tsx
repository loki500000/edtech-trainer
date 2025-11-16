import React from 'react';

interface ControlsProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  onExecute,
  isExecuting
}) => {
  const handleFirst = () => onStepChange(0);
  const handlePrev = () => onStepChange(Math.max(0, currentStep - 1));
  const handleNext = () => onStepChange(Math.min(totalSteps - 1, currentStep + 1));
  const handleLast = () => onStepChange(totalSteps - 1);

  return (
    <div className="controls">
      <button
        onClick={onExecute}
        disabled={isExecuting}
        className="execute-btn"
      >
        {isExecuting ? 'Executing...' : 'Visualize Execution'}
      </button>

      {totalSteps > 0 && (
        <div className="step-controls">
          <button onClick={handleFirst} disabled={currentStep === 0}>
            ⏮️ First
          </button>
          <button onClick={handlePrev} disabled={currentStep === 0}>
            ◀️ Prev
          </button>
          <span className="step-counter">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <button onClick={handleNext} disabled={currentStep === totalSteps - 1}>
            Next ▶️
          </button>
          <button onClick={handleLast} disabled={currentStep === totalSteps - 1}>
            Last ⏭️
          </button>
        </div>
      )}
    </div>
  );
};

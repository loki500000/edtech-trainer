import React from 'react';
import { ExecutionStep, StackFrame, Variable, HeapObject } from '../types';

interface VisualizationPanelProps {
  step: ExecutionStep | null;
}

const VariableDisplay: React.FC<{ variable: Variable }> = ({ variable }) => {
  return (
    <div className="variable">
      <span className="var-name">{variable.name}</span>
      <span className="var-type">{variable.type}</span>
      <span className="var-value">
        {variable.ref !== undefined ? `ref#${variable.ref}` : variable.value}
      </span>
    </div>
  );
};

const StackFrameDisplay: React.FC<{ frame: StackFrame }> = ({ frame }) => {
  return (
    <div className={`stack-frame ${frame.isHighlighted ? 'active' : ''}`}>
      <div className="frame-header">
        <span className="func-name">{frame.funcName}</span>
        <span className="line-num">line {frame.lineNumber}</span>
      </div>
      <div className="frame-locals">
        {frame.locals.length > 0 ? (
          frame.locals.map((variable, idx) => (
            <VariableDisplay key={idx} variable={variable} />
          ))
        ) : (
          <div className="no-vars">No local variables</div>
        )}
      </div>
    </div>
  );
};

const HeapObjectDisplay: React.FC<{ obj: HeapObject }> = ({ obj }) => {
  const renderValue = () => {
    if (typeof obj.value === 'string') {
      return obj.value;
    } else if (Array.isArray(obj.value)) {
      return `[${obj.value.length} items]`;
    }
    return JSON.stringify(obj.value);
  };

  return (
    <div className="heap-object" id={`heap-${obj.id}`}>
      <div className="heap-header">
        <span className="heap-id">#{obj.id}</span>
        <span className="heap-type">{obj.type}</span>
      </div>
      <div className="heap-value">{renderValue()}</div>
      {obj.label && <div className="heap-label">{obj.label}</div>}
    </div>
  );
};

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ step }) => {
  if (!step) {
    return (
      <div className="visualization-panel empty">
        <div className="empty-message">
          <h3>Welcome to Code Visualizer</h3>
          <p>Write your Python code in the editor on the left</p>
          <p>Click "Visualize Execution" to see how it runs step-by-step</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visualization-panel">
      <div className="visualization-section">
        <h3>Call Stack</h3>
        <div className="stack-frames">
          {step.stack.length > 0 ? (
            step.stack.map((frame, idx) => (
              <StackFrameDisplay key={idx} frame={frame} />
            ))
          ) : (
            <div className="empty-state">No stack frames</div>
          )}
        </div>
      </div>

      {step.heap.length > 0 && (
        <div className="visualization-section">
          <h3>Heap Objects</h3>
          <div className="heap-objects">
            {step.heap.map((obj) => (
              <HeapObjectDisplay key={obj.id} obj={obj} />
            ))}
          </div>
        </div>
      )}

      {step.stdout && (
        <div className="visualization-section">
          <h3>Output</h3>
          <pre className="stdout">{step.stdout}</pre>
        </div>
      )}
    </div>
  );
};

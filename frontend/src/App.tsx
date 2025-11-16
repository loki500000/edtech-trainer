import { useState } from 'react';
import axios from 'axios';
import { CodeEditor } from './components/CodeEditor';
import { VisualizationPanel } from './components/VisualizationPanel';
import { Controls } from './components/Controls';
import { ExecutionTrace, ExecutionStep } from './types';
import './App.css';

const DEFAULT_CODE = `# Welcome to Code Visualizer!
# Write your Python code here and click "Visualize Execution"

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print(f"Factorial of 5 is {result}")
`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [trace, setTrace] = useState<ExecutionTrace | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCode = async () => {
    setIsExecuting(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/execute`, { code });

      if (response.data.success) {
        setTrace({
          code: response.data.code,
          steps: response.data.steps
        });
        setCurrentStep(0);
      } else {
        setError(response.data.error || 'Code execution failed');
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to connect to the server. Make sure the backend is running.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const currentExecutionStep: ExecutionStep | null =
    trace && trace.steps.length > 0 ? trace.steps[currentStep] : null;

  const highlightedLine = currentExecutionStep?.lineNumber;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Python Code Visualizer</h1>
        <p>Understand your code execution step-by-step</p>
      </header>

      <Controls
        currentStep={currentStep}
        totalSteps={trace?.steps.length || 0}
        onStepChange={setCurrentStep}
        onExecute={executeCode}
        isExecuting={isExecuting}
      />

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="main-content">
        <div className="editor-panel">
          <h2>Code Editor</h2>
          <CodeEditor
            code={code}
            onChange={setCode}
            highlightedLine={highlightedLine}
            readOnly={isExecuting}
          />
        </div>

        <div className="visualization-container">
          <h2>Visualization</h2>
          <VisualizationPanel step={currentExecutionStep} />
        </div>
      </div>
    </div>
  );
}

export default App;

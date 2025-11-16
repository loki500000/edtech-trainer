// Type definitions for the Python Tutor Visualizer

export interface Variable {
  name: string;
  value: string;
  type: string;
  ref?: number; // Reference ID for heap objects
}

export interface StackFrame {
  funcName: string;
  lineNumber: number;
  locals: Variable[];
  isHighlighted: boolean;
}

export interface HeapObject {
  id: number;
  type: string;
  value: string | HeapObject[];
  label?: string;
}

export interface ExecutionStep {
  lineNumber: number;
  stack: StackFrame[];
  heap: HeapObject[];
  stdout: string;
  event: 'step_line' | 'call' | 'return' | 'exception';
}

export interface ExecutionTrace {
  code: string;
  steps: ExecutionStep[];
}

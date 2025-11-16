"""
Python Code Execution Tracer
This module traces Python code execution and generates visualization data.
"""

import sys
import json
import traceback
from types import FrameType
from typing import Any, Dict, List, Optional


class ExecutionTracer:
    """Traces Python code execution and captures state at each step."""

    def __init__(self):
        self.steps: List[Dict[str, Any]] = []
        self.heap: Dict[int, Any] = {}
        self.heap_counter = 0
        self.stdout_lines: List[str] = []
        self.original_stdout = sys.stdout

    def trace_function(self, frame: FrameType, event: str, arg: Any) -> 'ExecutionTracer':
        """Trace function called by sys.settrace."""

        # Skip internal frames and library code
        if self._should_skip_frame(frame):
            return self.trace_function

        # Capture the current state
        if event in ['line', 'call', 'return']:
            step = self._capture_step(frame, event, arg)
            self.steps.append(step)

        return self.trace_function

    def _should_skip_frame(self, frame: FrameType) -> bool:
        """Determine if we should skip this frame."""
        filename = frame.f_code.co_filename

        # Don't skip <string> (exec'd code) - that's what we want to trace!
        if filename == '<string>':
            return False

        # Skip internal Python files and this tracer
        if filename.startswith('<') or 'tracer.py' in filename:
            return True

        # Skip standard library files
        if 'lib/python' in filename or 'site-packages' in filename:
            return True

        return False

    def _capture_step(self, frame: FrameType, event: str, arg: Any) -> Dict[str, Any]:
        """Capture the current execution state."""

        # Get the current line number
        line_number = frame.f_lineno

        # Build the stack frames
        stack = self._build_stack(frame)

        # Capture heap objects (for now, simplified)
        heap = self._capture_heap(frame)

        # Get stdout so far
        stdout = ''.join(self.stdout_lines)

        return {
            'lineNumber': line_number,
            'event': event,
            'stack': stack,
            'heap': heap,
            'stdout': stdout
        }

    def _build_stack(self, current_frame: FrameType) -> List[Dict[str, Any]]:
        """Build the call stack representation."""
        stack = []
        frame = current_frame

        while frame is not None:
            if not self._should_skip_frame(frame):
                func_name = frame.f_code.co_name
                if func_name == '<module>':
                    func_name = 'main'

                # Get local variables
                locals_list = []
                for var_name, var_value in frame.f_locals.items():
                    if not var_name.startswith('__'):
                        locals_list.append(self._serialize_variable(var_name, var_value))

                stack_frame = {
                    'funcName': func_name,
                    'lineNumber': frame.f_lineno,
                    'isHighlighted': frame == current_frame,
                    'locals': locals_list
                }
                stack.append(stack_frame)

            frame = frame.f_back

        # Reverse so main is at the bottom
        return list(reversed(stack))

    def _serialize_variable(self, name: str, value: Any) -> Dict[str, Any]:
        """Serialize a variable for visualization."""
        value_type = type(value).__name__

        # Handle different types
        if isinstance(value, (int, float, bool, type(None))):
            return {
                'name': name,
                'type': value_type,
                'value': str(value)
            }
        elif isinstance(value, str):
            # Limit string length for display
            display_value = value if len(value) < 50 else value[:47] + '...'
            return {
                'name': name,
                'type': value_type,
                'value': f'"{display_value}"'
            }
        elif isinstance(value, (list, tuple, dict, set)):
            # For collections, store reference to heap
            heap_id = self._add_to_heap(value)
            return {
                'name': name,
                'type': value_type,
                'value': f'ref#{heap_id}',
                'ref': heap_id
            }
        else:
            # For other objects, show string representation
            return {
                'name': name,
                'type': value_type,
                'value': str(value)[:50]
            }

    def _add_to_heap(self, obj: Any) -> int:
        """Add an object to the heap and return its ID."""
        obj_id = id(obj)

        if obj_id not in self.heap:
            self.heap[obj_id] = {
                'id': self.heap_counter,
                'value': obj
            }
            heap_id = self.heap_counter
            self.heap_counter += 1
            return heap_id

        return self.heap[obj_id]['id']

    def _capture_heap(self, frame: FrameType) -> List[Dict[str, Any]]:
        """Capture heap objects for visualization."""
        heap_objects = []

        for obj_id, heap_item in self.heap.items():
            obj = heap_item['value']
            heap_id = heap_item['id']

            heap_obj = {
                'id': heap_id,
                'type': type(obj).__name__,
                'value': self._serialize_heap_value(obj)
            }
            heap_objects.append(heap_obj)

        return heap_objects

    def _serialize_heap_value(self, obj: Any) -> str:
        """Serialize heap object value."""
        if isinstance(obj, list):
            return '[' + ', '.join(str(item) for item in obj[:10]) + ']'
        elif isinstance(obj, dict):
            items = list(obj.items())[:5]
            return '{' + ', '.join(f'{k}: {v}' for k, v in items) + '}'
        elif isinstance(obj, set):
            items = list(obj)[:5]
            return '{' + ', '.join(str(item) for item in items) + '}'
        elif isinstance(obj, tuple):
            return '(' + ', '.join(str(item) for item in obj[:10]) + ')'
        else:
            return str(obj)[:100]


class StdoutCapture:
    """Capture stdout during code execution."""

    def __init__(self, lines_list: List[str]):
        self.lines = lines_list

    def write(self, text: str):
        self.lines.append(text)

    def flush(self):
        pass


def trace_execution(code: str, max_steps: int = 1000) -> Dict[str, Any]:
    """
    Execute Python code and trace its execution.

    Args:
        code: Python source code to execute
        max_steps: Maximum number of execution steps to capture

    Returns:
        Dictionary containing the execution trace
    """
    tracer = ExecutionTracer()

    # Capture stdout
    sys.stdout = StdoutCapture(tracer.stdout_lines)

    try:
        # Set up the tracer
        sys.settrace(tracer.trace_function)

        # Execute the code
        exec_globals = {'__name__': '__main__'}
        exec(code, exec_globals)

        # Clean up
        sys.settrace(None)
        sys.stdout = tracer.original_stdout

        return {
            'success': True,
            'code': code,
            'steps': tracer.steps[:max_steps]
        }

    except Exception as e:
        # Clean up on error
        sys.settrace(None)
        sys.stdout = tracer.original_stdout

        # Get the traceback
        tb = traceback.format_exc()

        return {
            'success': False,
            'error': str(e),
            'traceback': tb,
            'steps': tracer.steps[:max_steps]
        }


if __name__ == '__main__':
    # Test the tracer
    test_code = """
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print(f"Factorial: {result}")
"""

    result = trace_execution(test_code)
    print(json.dumps(result, indent=2))

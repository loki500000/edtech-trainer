"""
Flask API Server for Code Visualizer
Provides endpoints for executing Python code and generating traces.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import signal
import sys
from tracer import trace_execution

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Security configurations
MAX_CODE_LENGTH = 10000  # Maximum characters in code
MAX_EXECUTION_TIME = 5  # Maximum seconds for execution
MAX_STEPS = 1000  # Maximum execution steps


class TimeoutError(Exception):
    """Raised when code execution times out."""
    pass


def timeout_handler(signum, frame):
    """Handle timeout signal."""
    raise TimeoutError("Code execution timed out")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'message': 'Code Visualizer API is running'})


@app.route('/api/execute', methods=['POST'])
def execute_code():
    """
    Execute Python code and return execution trace.

    Request body:
        {
            "code": "Python source code string"
        }

    Response:
        {
            "success": true/false,
            "code": "original code",
            "steps": [...],
            "error": "error message if failed"
        }
    """
    try:
        # Get code from request
        data = request.get_json()

        if not data or 'code' not in data:
            return jsonify({
                'success': False,
                'error': 'No code provided'
            }), 400

        code = data['code']

        # Validate code length
        if len(code) > MAX_CODE_LENGTH:
            return jsonify({
                'success': False,
                'error': f'Code exceeds maximum length of {MAX_CODE_LENGTH} characters'
            }), 400

        # Validate code is not empty
        if not code.strip():
            return jsonify({
                'success': False,
                'error': 'Code cannot be empty'
            }), 400

        # Security check: prevent certain dangerous imports
        dangerous_imports = [
            'subprocess', 'os.system', 'eval', '__import__',
            'open', 'file', 'input', 'raw_input'
        ]

        for dangerous in dangerous_imports:
            if dangerous in code:
                return jsonify({
                    'success': False,
                    'error': f'Restricted operation: {dangerous} is not allowed'
                }), 403

        # Set execution timeout (Unix only)
        if sys.platform != 'win32':
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(MAX_EXECUTION_TIME)

        try:
            # Execute and trace the code
            result = trace_execution(code, max_steps=MAX_STEPS)

            # Cancel timeout
            if sys.platform != 'win32':
                signal.alarm(0)

            return jsonify(result)

        except TimeoutError:
            return jsonify({
                'success': False,
                'error': f'Code execution exceeded {MAX_EXECUTION_TIME} seconds'
            }), 408

        except Exception as e:
            # Cancel timeout on error
            if sys.platform != 'win32':
                signal.alarm(0)

            return jsonify({
                'success': False,
                'error': f'Execution error: {str(e)}'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Get example code snippets."""
    examples = [
        {
            'name': 'Factorial',
            'description': 'Recursive factorial calculation',
            'code': '''def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print(f"Factorial of 5 is {result}")'''
        },
        {
            'name': 'Fibonacci',
            'description': 'Fibonacci sequence generator',
            'code': '''def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(6):
    print(f"fib({i}) = {fibonacci(i)}")'''
        },
        {
            'name': 'List Operations',
            'description': 'Working with lists',
            'code': '''numbers = [1, 2, 3, 4, 5]
squares = []

for num in numbers:
    square = num * num
    squares.append(square)

print("Numbers:", numbers)
print("Squares:", squares)'''
        },
        {
            'name': 'Sum Function',
            'description': 'Sum of a list',
            'code': '''def sum_list(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total

numbers = [10, 20, 30, 40]
result = sum_list(numbers)
print(f"Sum: {result}")'''
        }
    ]

    return jsonify({'examples': examples})


if __name__ == '__main__':
    print("Starting Code Visualizer API Server...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

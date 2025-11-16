"""Test the tracer module"""

from tracer import trace_execution
import json

# Simple test
test_code = """
x = 5
y = 10
result = x + y
print(result)
"""

print("Testing tracer...")
result = trace_execution(test_code)
print(f"Success: {result['success']}")
print(f"Number of steps: {len(result['steps'])}")

if result['steps']:
    print("\nFirst step:")
    print(json.dumps(result['steps'][0], indent=2))
    print(f"\nLast step:")
    print(json.dumps(result['steps'][-1], indent=2))
else:
    print("No steps captured!")
    print(json.dumps(result, indent=2))

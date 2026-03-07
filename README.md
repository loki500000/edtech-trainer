# EdTech Trainer — Python Code Visualizer

A web-based educational tool that visualizes Python code execution step-by-step, similar to [Python Tutor](https://pythontutor.com). Helps students and developers understand how Python code executes by showing the call stack, variables, heap objects, and program output at each step.

This repository also includes a **Figma to React Native Generator** plugin (`figma-react-native-generator/`) for converting Figma designs into React Native code.

![Python Code Visualizer](https://img.shields.io/badge/Python-3.x-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-000000.svg)

## Features

- **Step-by-Step Execution Visualization**: See your code execute line by line
- **Call Stack Display**: Visualize function calls and returns
- **Variable Tracking**: Monitor local variables and their values in real-time
- **Heap Object Visualization**: See lists, dictionaries, and other objects in memory
- **Code Editor**: Built-in Monaco Editor (VS Code's editor) with syntax highlighting
- **Output Console**: View print statements and program output
- **Navigation Controls**: Step forward, backward, or jump to any point in execution

## Technology Stack

### Frontend
- **React 18** with **TypeScript** for type-safe UI development
- **Vite** for fast development and building
- **Monaco Editor** for code editing (same editor as VS Code)
- **Axios** for API communication

### Backend
- **Python 3.x** for code execution and tracing
- **Flask 3.0** for the REST API
- **sys.settrace()** for capturing execution state

## Project Structure

```
edtech-trainer/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.tsx      # Monaco Editor wrapper
│   │   │   ├── Controls.tsx        # Step navigation controls
│   │   │   └── VisualizationPanel.tsx  # Visualization display
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── App.tsx                 # Main application
│   │   └── App.css                 # Styling
│   └── package.json
│
├── backend/           # Python Flask backend
│   ├── app.py         # Flask API server
│   ├── tracer.py      # Execution tracer
│   └── requirements.txt
│
└── figma-react-native-generator/  # Figma plugin (bonus tool)
    ├── manifest.json              # Figma plugin manifest
    ├── package.json
    ├── tsconfig.json
    └── webpack.config.js
```

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Python** 3.8 or higher
- **pip** (Python package manager)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edtech-trainer
```

### 2. Set Up the Backend

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Set Up the Frontend

```bash
cd ../frontend

# Install Node.js dependencies
npm install
```

## Running the Application

You need to run both the backend and frontend servers.

### Terminal 1: Start the Backend Server

```bash
cd backend

# Activate virtual environment if not already active
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start the Flask server
python app.py
```

The backend API will start at `http://localhost:5000`

### Terminal 2: Start the Frontend Development Server

```bash
cd frontend

# Start the Vite dev server
npm run dev
```

The frontend will start at `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

1. **Write Code**: Enter your Python code in the editor on the left panel
2. **Visualize**: Click the "Visualize Execution" button
3. **Step Through**: Use the navigation controls to step through your code:
   - **First**: Jump to the first step
   - **Prev**: Go to the previous step
   - **Next**: Go to the next step
   - **Last**: Jump to the last step
4. **Observe**: Watch the visualization panel on the right to see:
   - **Call Stack**: Active function calls with local variables
   - **Heap Objects**: Lists, dictionaries, and other objects
   - **Output**: Print statements and program output

## Example Code

Try this factorial example:

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print(f"Factorial of 5 is {result}")
```

## API Endpoints

### `POST /api/execute`

Execute Python code and return execution trace.

**Request:**
```json
{
  "code": "print('Hello, World!')"
}
```

**Response:**
```json
{
  "success": true,
  "code": "print('Hello, World!')",
  "steps": [
    {
      "lineNumber": 1,
      "event": "line",
      "stack": [...],
      "heap": [...],
      "stdout": "Hello, World!\n"
    }
  ]
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Code Visualizer API is running"
}
```

### `GET /api/examples`

Get example code snippets.

**Response:**
```json
{
  "examples": [
    {
      "name": "Factorial",
      "description": "Recursive factorial calculation",
      "code": "..."
    }
  ]
}
```

## Security Features

The backend includes several security measures:

- **Code Length Limit**: Maximum 10,000 characters
- **Execution Timeout**: 5 seconds maximum execution time
- **Step Limit**: Maximum 1,000 execution steps
- **Restricted Operations**: Blocks dangerous operations like:
  - File I/O (`open`, `file`)
  - System commands (`subprocess`, `os.system`)
  - User input (`input`, `raw_input`)
  - Dynamic code execution (`eval`, `exec`)

## Development

### Frontend Development

```bash
cd frontend

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Run with auto-reload
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows

python app.py
```

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

### Backend

The backend is production-ready. For deployment, consider using:
- **Gunicorn** or **uWSGI** as WSGI server
- **Nginx** as reverse proxy
- **Docker** for containerization

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Contributing

This is an educational project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes.

## Acknowledgments

- Inspired by [Python Tutor](https://pythontutor.com) by Philip Guo
- Built with [Monaco Editor](https://microsoft.github.io/monaco-editor/) by Microsoft
- Uses [React](https://react.dev/) and [Flask](https://flask.palletsprojects.com/)

## Roadmap

Future enhancements:
- [ ] Support for more programming languages (JavaScript, Java, C++)
- [ ] Visual representation of object references (pointers/arrows)
- [ ] Code sharing via URLs
- [ ] Syntax error highlighting before execution
- [ ] Breakpoint support
- [ ] Step backward through execution
- [ ] Variable modification during execution
- [ ] Dark/light theme toggle
- [ ] Export visualization as images or animations

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

## Figma to React Native Generator (Bonus Tool)

Located in `figma-react-native-generator/`, this is a Figma plugin that converts selected Figma layers into React Native component code.

### Setup

```bash
cd figma-react-native-generator
npm install
npm run build
```

Then in Figma: **Plugins → Development → Import plugin from manifest** and select `manifest.json`.

### Usage

1. Open a Figma file and select the layers you want to convert
2. Run the plugin from the Plugins menu
3. Copy the generated React Native code

---

## Authors

Built with Claude Code as an educational tool for learning programming concepts through visualization.

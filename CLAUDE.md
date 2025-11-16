# CLAUDE.md - AI Assistant Guide for EdTech Trainer

## Project Overview

**Project Name:** EdTech Trainer
**Repository:** edtech-trainer
**Purpose:** Educational technology training platform (to be defined)
**Status:** New project - codebase initialization phase

This document serves as a comprehensive guide for AI assistants (like Claude) working on this codebase. It provides context about the project structure, development workflows, coding conventions, and best practices.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Development Workflow](#development-workflow)
4. [Coding Conventions](#coding-conventions)
5. [Testing Guidelines](#testing-guidelines)
6. [Common Tasks](#common-tasks)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Troubleshooting](#troubleshooting)

---

## Project Structure

### Current State
This is a new repository. The structure will be updated as the project develops.

### Expected Directory Structure
```
edtech-trainer/
├── src/                    # Source code
├── tests/                  # Test files
├── docs/                   # Documentation
├── config/                 # Configuration files
├── scripts/                # Build and utility scripts
├── .github/                # GitHub workflows and templates
└── CLAUDE.md              # This file
```

**Note:** Update this section as directories are created.

---

## Technology Stack

### Status: To Be Determined

When the tech stack is chosen, document:
- **Primary Language:** (e.g., Python, TypeScript, Java)
- **Framework:** (e.g., React, Django, Spring Boot)
- **Database:** (e.g., PostgreSQL, MongoDB)
- **Build Tools:** (e.g., Webpack, Gradle, Maven)
- **Testing Framework:** (e.g., Jest, PyTest, JUnit)
- **Package Manager:** (e.g., npm, pip, cargo)

### Key Dependencies
Document major dependencies here as they are added.

---

## Development Workflow

### Git Workflow

#### Branching Strategy
- **Main Branch:** `main` (or `master`)
- **Feature Branches:** `claude/feature-description-session-id`
- **Branch Naming Convention:** Always prefix with `claude/` for AI assistant work
- **Session ID Suffix:** Required for push operations to succeed

#### Commit Guidelines
1. **Write Clear Commit Messages:**
   - Use imperative mood: "Add feature" not "Added feature"
   - First line: brief summary (50 chars or less)
   - Blank line, then detailed description if needed

2. **Commit Message Format:**
   ```
   <type>: <subject>

   <body>

   <footer>
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **Example:**
   ```
   feat: Add user authentication module

   - Implement JWT-based authentication
   - Add login and registration endpoints
   - Include password hashing with bcrypt

   Closes #123
   ```

#### Push Protocol
```bash
# Always use the -u flag for first push
git push -u origin <branch-name>

# Branch MUST start with 'claude/' and include session ID
# Retry on network errors: 4 attempts with exponential backoff (2s, 4s, 8s, 16s)
```

### Pull Request Process
1. Ensure all tests pass
2. Update documentation as needed
3. Request review if applicable
4. Squash commits if requested

---

## Coding Conventions

### General Principles
1. **Write Clean, Readable Code**
   - Use meaningful variable and function names
   - Keep functions small and focused (single responsibility)
   - Comment complex logic, not obvious code

2. **Follow Language-Specific Style Guides**
   - Python: PEP 8
   - JavaScript/TypeScript: Airbnb or Standard
   - Java: Google Java Style Guide
   - (Update based on chosen language)

### Security Best Practices

**CRITICAL:** Always guard against common vulnerabilities:

1. **Input Validation**
   - Validate and sanitize all user inputs
   - Use parameterized queries for database operations

2. **Common Vulnerabilities to Avoid (OWASP Top 10)**
   - SQL Injection
   - Cross-Site Scripting (XSS)
   - Cross-Site Request Forgery (CSRF)
   - Command Injection
   - Path Traversal
   - Insecure Deserialization
   - Broken Authentication
   - Sensitive Data Exposure

3. **Immediate Fix Policy**
   - If you identify a security vulnerability in code you've written, fix it immediately
   - Never commit code with known security issues

### Code Organization
- **DRY Principle:** Don't Repeat Yourself
- **Separation of Concerns:** Keep logic, presentation, and data separate
- **Consistent Formatting:** Use linters and formatters

---

## Testing Guidelines

### Test Coverage
- Aim for minimum 80% code coverage
- Critical paths should have 100% coverage
- Test edge cases and error conditions

### Test Organization
```
tests/
├── unit/           # Unit tests for individual functions/classes
├── integration/    # Integration tests for module interactions
├── e2e/           # End-to-end tests for complete workflows
└── fixtures/      # Test data and mock objects
```

### Testing Best Practices
1. **Naming Convention:** Test names should describe what they test
   - `test_user_login_with_valid_credentials()`
   - `test_invalid_email_returns_400_error()`

2. **AAA Pattern:** Arrange, Act, Assert
   ```python
   def test_example():
       # Arrange: Set up test data
       user = User("test@example.com")

       # Act: Execute the code being tested
       result = user.validate_email()

       # Assert: Verify the result
       assert result == True
   ```

3. **Isolation:** Tests should be independent and not rely on execution order
4. **Mock External Dependencies:** Use mocking for APIs, databases, file systems

---

## Common Tasks

### Setting Up Development Environment
```bash
# Clone the repository
git clone <repository-url>
cd edtech-trainer

# Install dependencies (update based on tech stack)
# npm install
# pip install -r requirements.txt
# cargo build

# Run tests
# npm test
# pytest
# cargo test
```

### Running the Application
```bash
# Development mode (update based on tech stack)
# npm run dev
# python manage.py runserver
# cargo run
```

### Building for Production
```bash
# Production build (update based on tech stack)
# npm run build
# python setup.py build
# cargo build --release
```

---

## AI Assistant Guidelines

### When Working on This Codebase

#### 1. Understand Context First
- Read existing code before making changes
- Use `Grep` and `Glob` tools to find relevant files
- Use `Read` tool to examine file contents
- Use `Task` tool with `Explore` subagent for complex codebase exploration

#### 2. Plan Before Coding
- Use `TodoWrite` tool for multi-step tasks
- Break complex tasks into smaller, manageable steps
- Mark tasks as in_progress when starting
- Mark tasks as completed immediately after finishing

#### 3. Code Quality Checklist
- [ ] Code follows established conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated if needed
- [ ] Code is readable and well-commented
- [ ] Error handling is appropriate
- [ ] Edge cases are considered

#### 4. Testing Requirements
- Run existing tests before making changes
- Add tests for new functionality
- Verify all tests pass before committing
- Fix any failing tests immediately

#### 5. Communication
- Be concise and clear
- Provide file paths with line numbers: `path/to/file.ts:123`
- Explain reasoning for architectural decisions
- Ask for clarification when requirements are ambiguous

#### 6. Tool Usage Best Practices
- **Parallel Tool Calls:** Use when operations are independent
- **Sequential Tool Calls:** Use when operations depend on each other
- **Prefer Specialized Tools:**
  - `Read` over `cat`
  - `Edit` over `sed`
  - `Write` over `echo` redirection
  - `Grep` over `grep` command
  - `Glob` over `find` command

#### 7. File Operations
- **ALWAYS prefer editing existing files** over creating new ones
- Only create new files when absolutely necessary
- Never create unnecessary documentation files
- Read files before writing/editing them

#### 8. Git Operations
- Commit changes with clear, descriptive messages
- Follow the commit message format
- Push to correct branch with `-u` flag
- Implement retry logic for network errors

---

## Project-Specific Conventions

### Naming Conventions
(To be defined based on chosen tech stack)

### File Organization
(To be defined as project structure emerges)

### API Design
(To be defined if project includes APIs)

### Database Schema
(To be defined if project uses a database)

---

## Troubleshooting

### Common Issues and Solutions

#### Build Failures
1. Check that all dependencies are installed
2. Verify environment variables are set
3. Clear cache/build directories
4. Check for version incompatibilities

#### Test Failures
1. Run tests individually to isolate issues
2. Check for state pollution between tests
3. Verify test data and fixtures are correct
4. Update snapshots if UI tests fail due to intentional changes

#### Git Push Failures
1. Verify branch name starts with `claude/` and includes session ID
2. Check network connectivity
3. Implement retry logic with exponential backoff
4. Verify authentication credentials

---

## Educational Technology Context

### EdTech Best Practices

As an educational technology platform, keep these principles in mind:

1. **Accessibility**
   - Follow WCAG 2.1 AA standards
   - Support keyboard navigation
   - Provide alt text for images
   - Ensure color contrast meets standards

2. **Privacy and Data Protection**
   - FERPA compliance (if US-based)
   - GDPR compliance (if EU users)
   - COPPA compliance (if under-13 users)
   - Minimize data collection
   - Secure storage of student data

3. **Usability**
   - Design for diverse learners
   - Clear, concise instructions
   - Progressive disclosure of complexity
   - Immediate feedback on actions

4. **Performance**
   - Fast load times (especially on slower connections)
   - Offline capabilities where appropriate
   - Responsive design for various devices
   - Optimized media delivery

---

## Maintenance and Updates

### Keeping CLAUDE.md Current

This document should be updated when:
- Technology stack is chosen or changes
- New conventions are established
- Project structure evolves
- New common tasks are identified
- Troubleshooting solutions are discovered

**Last Updated:** 2025-11-16
**Version:** 1.0.0 (Initial creation)

---

## Quick Reference

### Essential Commands
```bash
# Create feature branch
git checkout -b claude/feature-name-session-id

# Stage all changes
git add .

# Commit with message
git commit -m "type: description"

# Push to remote
git push -u origin claude/feature-name-session-id

# Run tests (update based on tech stack)
# npm test | pytest | cargo test

# Run linter (update based on tech stack)
# npm run lint | flake8 | cargo clippy
```

### Key Files to Check
(Update as project develops)
- `README.md` - Project overview and setup
- Configuration files - Project settings
- Test files - Understanding expected behavior
- Documentation - Architecture and design decisions

---

## Resources

### Documentation Links
(Add links as project develops)
- Project Wiki: (TBD)
- API Documentation: (TBD)
- Design System: (TBD)
- Deployment Guide: (TBD)

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [FERPA Guidelines](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)

---

## Notes for AI Assistants

### Philosophy
- **Accuracy over speed:** Take time to understand before acting
- **Security first:** Never compromise on security practices
- **User intent:** Seek clarification when requirements are unclear
- **Incremental improvement:** Make changes in small, testable increments
- **Leave it better:** Improve code quality with each change

### What to Avoid
- Creating unnecessary files (especially .md files)
- Using emojis unless explicitly requested
- Over-engineering solutions
- Breaking existing functionality
- Committing code with known issues
- Skipping tests to save time

### What to Embrace
- Clear, concise communication
- Thorough testing
- Security-conscious coding
- Well-documented code
- User-focused design
- Asking clarifying questions

---

**Remember:** This document is a living guide. Update it as the project evolves and new patterns emerge.

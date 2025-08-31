# Contributing to Chat Room

## 🤝 Welcome

Thank you for considering contributing to Chat Room! This document provides guidelines for contributing to this project.

## 📋 Code of Conduct

This project follows a standard code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- MongoDB (local or Atlas)
- Git

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Chat-Room.git
   cd Chat-Room
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment files (see [SETUP.md](docs/SETUP.md))
5. Start development:
   ```bash
   pnpm dev
   ```

## 📝 Contribution Guidelines

### Branching Strategy
- `main` - Production ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes

### Commit Messages
Follow conventional commit format:
```
type(scope): description

feat(auth): add OAuth login functionality
fix(socket): resolve connection timeout issue
docs(readme): update installation instructions
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Build/config changes

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

### PR Requirements
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if applicable)
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Description explains what and why

## 🧪 Testing

### Running Tests
```bash
# All tests
pnpm test

# Specific package
pnpm --filter @chat-room/server test
pnpm --filter @chat-room/web test

# With coverage
pnpm test:coverage
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Include component tests for React components
- Mock external dependencies appropriately

## 📚 Code Style

### TypeScript
- Use strict TypeScript configuration
- Define explicit types for function parameters and returns
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for prop types
- Keep components focused and reusable

### Backend
- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Use middleware for cross-cutting concerns

### General
- Use ESLint and Prettier configurations
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused

## 🐛 Reporting Bugs

### Bug Reports
Use the issue template and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots (if applicable)

### Security Issues
For security vulnerabilities, please email instead of creating public issues.

## 💡 Feature Requests

### Proposing Features
- Check existing issues first
- Describe the problem you're solving
- Provide detailed use cases
- Consider implementation complexity
- Be open to feedback and discussion

## 📖 Documentation

### Documentation Standards
- Write clear, concise documentation
- Include code examples
- Update README when needed
- Document API endpoints
- Maintain architecture documentation

### Areas for Documentation
- API endpoints and schemas
- Component usage examples
- Configuration options
- Deployment procedures
- Troubleshooting guides

## 🏗️ Architecture Decisions

### Making Changes
For significant architectural changes:
1. Open an issue for discussion
2. Provide detailed proposal
3. Consider backward compatibility
4. Get maintainer approval
5. Update documentation

### Technology Choices
- Prefer established, well-maintained libraries
- Consider bundle size impact
- Ensure TypeScript support
- Maintain compatibility with existing stack

## 🔄 Release Process

### Versioning
- Follow semantic versioning (SemVer)
- Update CHANGELOG.md
- Tag releases appropriately
- Create release notes

### Deployment
- Automated deployment via CI/CD
- Staging environment testing
- Production deployment approval
- Rollback procedures documented

## 🆘 Getting Help

### Resources
- [Documentation](docs/)
- [GitHub Issues](https://github.com/muhammad-12345/Chat-Room/issues)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)

### Contact
- Create GitHub issues for bugs/features
- Use discussions for questions
- Check existing documentation first

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors graph

Thank you for contributing to Chat Room! 🎉

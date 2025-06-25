# Onboarding Flow Plugin

A comprehensive onboarding flow plugin for Backstage that guides users through a multi-step process to onboard new projects and components.

## Features

- **Multi-step Onboarding Wizard**: Guided process with 5 steps
- **Business Application Selection**: Choose from available business applications
- **System Configuration**: Select or create systems for the project
- **Component Creation**: Create new components with type and language selection
- **Review & Submit**: Final review of all collected information
- **API Integration**: Fetches data from external APIs
- **Responsive Design**: Works on desktop and mobile devices

## Onboarding Flow Steps

1. **Select Business Application**: Choose from a list of available business applications
2. **Business Application Details**: Review BA information and configure system creation
3. **System Selection**: Select a system from available options
4. **Component Creation**: Create a new component with specifications
5. **Review & Submit**: Review all information and submit the onboarding request

## API Integration

The plugin integrates with two external APIs:

- **Business Applications API**: `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/ba.json`
- **Systems API**: `https://raw.githubusercontent.com/rmadiraju/harness-onboarding-flow/refs/heads/main/system.json`

See `API_SAMPLES.md` for the expected JSON structures.

## Installation

1. Install the plugin dependencies:
   ```bash
   yarn install
   ```

2. The plugin is automatically integrated into the main Backstage app.

## Usage

1. Navigate to the Onboarding Flow page in your Backstage instance
2. Follow the step-by-step wizard to complete the onboarding process
3. Each step validates input and guides you to the next step
4. Review all information before final submission

## Development

### Running the Plugin

```bash
# Start the development server
yarn start

# Build the plugin
yarn build

# Run tests
yarn test

# Lint the code
yarn lint
```

### Project Structure

```
src/
├── api/
│   └── onboardingApi.ts          # API integration functions
├── components/
│   └── OnboardingFlow/
│       ├── OnboardingFlow.tsx    # Main wizard component
│       ├── BusinessApplicationList.tsx
│       ├── BusinessApplicationDetails.tsx
│       ├── SystemSelection.tsx
│       ├── ComponentCreation.tsx
│       ├── ReviewAndSubmit.tsx
│       └── index.ts
├── types.ts                      # TypeScript type definitions
├── plugin.ts                     # Plugin configuration
├── routes.ts                     # Route definitions
└── index.ts                      # Main entry point
```

## Configuration

### API Endpoints

Update the API endpoints in `src/api/onboardingApi.ts`:

```typescript
const BA_API_URL = 'your-ba-api-endpoint';
const SYSTEM_API_URL = 'your-system-api-endpoint';
```

### Component Types

Available component types:
- `microservice`: Backend microservice
- `stream`: Data streaming component
- `ui`: User interface component

### Languages

Available programming languages:
- `java`: Java
- `go`: Go
- `js`: JavaScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache-2.0

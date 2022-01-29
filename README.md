# STA Website Helpers

A template for beginning NodeJS Typescript projects with minimal setup.
This template sets up the following:

- Typescript
- Jest: testing
- Husky: sets up Git hooks to not allow commit unless local checks pass
- ESLint: linting
- Prettier: formats code
- Github Actions CI
- Github Actions for deploying to NPM on a tag
- Dependabot to create PRs when the dependencies run
- Mergify to automatically merge in Dependabot PRs or approved PRs that pass CI
- Convenience commands for performing common operations, such as `npm run validate`
- Build in several different formats so this can be imported as a CommonJS module or ES6 module with types

## Getting started

To get started, clone this repository and run the following:

```bash
npm ci  # install dependencies
npm run prepare  # setup git hooks
```

From there, you can run the tests to confirm that things are working:

```bash
npm test
```

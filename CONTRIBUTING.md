# Contributing

First of all, thank you very much for taking the time to contribute to our open source project. We hope that this guide will clearly explain the contribution process and answer any questions you may have, so please take a few minutes to read it before submitting an issue or pull request.

## Code of Conduct

We has adopted [the Contributor Covenant](CODE_OF_CONDUCT.md) as our Code of Conduct, and we expect project participants to adhere to it. Please read the full text so that you can understand what actions will and will not be tolerated.

## Open Development

All work on VGrammar happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

VGrammar follows [semantic versioning](https://semver.org/).

1. MAJOR version when you make incompatible API changes
2. MINOR version when you add functionality in a backward compatible manner
3. PATCH version when you make backward compatible bug fixes

Every significant change is documented in the changelog file.

## Release Schedule

We will release a new version every two weeks.

## Branch Organization

<b> Branch naming conventions:</b>

- fix/xxx: bugfix branch
- feat/xxx: feature branch
- refactor/xxx: refactoring branch
- release/xxx: release branch
- chore/xxx: configuration modification
- docs/xxx: documentation update
- perf/xxx: performance optimization
- test/xxx: test case update
- ci/xxx: CI process configuration update
- style/xxx: code style related.

Submit all changes directly to the main branch. We don’t use separate branches for development or for upcoming releases. We do our best to keep main in good shape, with all tests passing.

Code that lands in main must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of main at any time.

## Bugs

We are using [GitHub Issues](https://github.com/VisActor/VGrammar/issues) for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

We have already prepared issue templates for bug reports and feature requests. If you want to fire an issue, just enter the [New issue](https://github.com/VisActor/VGrammar/issues/new/choose) page and select either of them to get started.

## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend filing an issue, or just enter the [New issue](https://github.com/VisActor/VGrammar/issue) page and select either of them to get started.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](todo) that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

### Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request**, please make sure the following is done:

1. Fork the [VGrammar](https://github.com/VisActor/VGrammar/) and create your branch from `main`.
2. (If rush has been install, just go to step 3) global install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`.
3. Run `rush update --full` in the repository root.
4. If you’ve fixed a bug or added code that should be tested, add tests!
5. Ensure the test suite passes (`rush test`). Tip: `rush test -- --watch TestName` is helpful in development.
6. Make sure your code lints (`rush lint`). Tip: Lint runs automatically when you git commit (Use Git Hooks).
7. Run `rush compile` for typecheck.

## Development Workflow

After cloning VGrammar, run `rush update --full` to fetch its dependencies. Then, you can run several commands:

1. `rush run -p @internal/dev-demos -s start` runs VGrammar test page locally.
2. `rush eslint` checks the code style.
3. `rush build`
4. `rush test` runs the complete test suite.
5. `rush run -p <project_name> -s <script>` run the specified script for the specified project, eg. `rush run -p @VisActor/VGrammar -s start`
6. `rush prettier --dir <project_relative_path> --ext <file_type>` prettier the specified script for the specified project, eg. `rush prettier --dir packages/VGrammar --ext ts`

## License

By contributing to VGrammar, you agree that your contributions will be licensed under its MIT license.

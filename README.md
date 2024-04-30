# TMP Versions

This project is a TypeScript action that can be used in GitHub Actions workflows.

## Purpose

Calculates the next versions for prod and beta releases

## Key Features

- Written in TypeScript for type safety and improved development experience
- Includes compilation support, tests, a validation workflow, publishing, and versioning guidance
- Can be easily customized and extended to suit specific use cases
- Integrates seamlessly with GitHub Actions workflows

## Installation

To use this action in your own workflows, you can reference it using the `uses` syntax in your workflow YAML file. For example:

```yaml
      - name: Calculate new versions
        id: new-versions
        uses: themoneyplatform/version-action@v1
        with:
          release-level: ${{ steps.analyse-commits.outputs.release-level }}
          latest-production-version: ${{ steps.get-latest-semver-tag.latest-prod-tag }}
          latest-beta-version: ${{ steps.get-latest-semver-tag.latest-beta-tag }}
```

## Usage

To run the action locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/themoneyplatform/version-action.git
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Run the action:
   ```bash
   node dist/index.js
   ```

## Testing

To run the tests for this action, use the following command:

```bash
npm test
```

This will execute the test suites defined in the `__tests__` directory.

## Building and Packaging

To build and package the action for distribution, use the following command:

```bash
npm run package
```

This will compile the TypeScript code and package the action into a single distributable file.

## Troubleshooting

If you encounter any issues while using this action, please refer to the following troubleshooting tips:

- Make sure you have the latest version of the action installed
- Ensure that your workflow YAML file is properly formatted and contains the correct syntax
- Double-check that you have provided the necessary input parameters to the action
- If the issue persists, please open an issue on the GitHub repository with detailed information about the problem you're facing

For more detailed information and advanced usage examples, please refer to the GitHub repository's documentation.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: test-action
    uses: actions/typescript-action@v1 # Commit with the `v1` tag
    with:
      milliseconds: 1000

  - name: Print Output
    id: output
    run: echo "${{ steps.test-action.outputs.time }}"
```

## Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.

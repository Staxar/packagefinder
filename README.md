# VS Code Extension: NPM & Yarn Package Search and Install

Welcome to the **Package Finder** VS Code extension! This tool enhances your development workflow by allowing you to search for, install npm and Yarn packages directly within Visual Studio Code. Whether you're using npm or Yarn, this extension streamlines the process of finding and adding packages to your projects.

## Features

- **Search for Packages:** Quickly search for npm or Yarn packages without leaving VS Code.
- **Install Packages:** Install packages directly from the search results.
- **View Package Details:** Get detailed information about packages, including version history.
  - **TODO ** **Manage Dependencies:** Easily add/remove/update packages to your `package.json` or `yarn.lock`.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for `Package Finder`.
4. Click **Install**.

Alternatively, you can install it from the command line:

```bash
code --install-extension <extension-id>
```

Replace `<extension-id>` with the ID of the extension, which you can find on the extension's page in the VS Code marketplace.

## Usage

### Search for Packages

1. Open the Command Palette by pressing `Ctrl+Shift+i` (or `Cmd+Shift+i` on macOS).
2. Type `Package Finder` and select it.
3. Enter the name or keyword for the package you want to search for.
4. Browse the search results in the provided list.

### Install Packages

1. From the search results, select the package you want to install.
2. Hit enter and **Install** the package.

### View Package Details

1. Version of every package is next to name.

### Managing Dependencies

- **Install New Packages:** Use the search feature to find and install new packages.

## Configuration

You can configure the extension through the VS Code settings. Go to `File` > `Preferences` > `Settings` and search for `Package Finder` to adjust the extension's settings.

## Troubleshooting

- **Search Results Not Appearing:** Ensure you have a stable internet connection and try restarting VS Code.
- **Installation Issues:** Verify that npm or Yarn is correctly installed and configured on your system.

For further assistance, please refer to the [FAQ](#faq) or open an issue on the [GitHub repository](#repository).

## FAQ

**Q: Can I use this extension with both npm and Yarn?**

A: Yes, you can search for and install packages for both npm and Yarn.

**Q: How do I uninstall the extension?**

A: Go to the Extensions view, find the `Package Finder` extension, and click the **Uninstall** button.

**Q: Does this extension support private npm registries?**

A: This extension supports searching and installing from public npm registries. For private registries, additional configuration may be required.

## Repository

Find the source code, report issues, or contribute to the project on [GitHub](https://github.com/Staxar/packagefinder).

## License

This extension is licensed under the [MIT License](LICENSE).

---

Thank you for using the **Package Finder** VS Code extension! We hope it makes your development process smoother and more efficient. If you have any questions or feedback, feel free to reach out through the GitHub repository.

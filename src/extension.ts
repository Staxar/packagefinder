import * as vscode from "vscode";
import axios from "axios";

type NpmPackage = {
  name: string;
  version: string;
  description: string;
  links: string[];
};

/**
 * Fetch npm packages based on a search query.
 * @param query The search query string.
 * @returns A list of npm package results or null in case of an error.
 */
async function fetchNpmPackages(query: string): Promise<NpmPackage[] | null> {
  const apiUrl = `https://api.npms.io/v2/search/suggestions?q=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.map((pkg: any) => ({
      name: pkg.package.name,
      version: pkg.package.version,
      description: pkg.package.description,
      links: pkg.package.links,
    }));
  } catch (error) {
    vscode.window.showErrorMessage("Error while searching for npm packages");
    console.error("Error fetching npm packages:", error);
    return null;
  }
}

/**
 * Installs an npm package using the specified package manager.
 * @param packageName The name of the package to install.
 * @param packageManager The package manager ("npm" or "yarn").
 */
function installNpmPackage(packageName: string, packageManager: string) {
  const installCommand = packageManager === "npm" ? "npm install" : "yarn add";
  const terminal =
    vscode.window.activeTerminal ||
    vscode.window.createTerminal(`Install ${packageName}`);

  terminal.show();
  terminal.sendText(`${installCommand} ${packageName}`);
}

/**
 * Prompts the user to select a package manager (npm or yarn).
 * @returns The selected package manager or undefined if none is chosen.
 */
async function promptPackageManager(): Promise<string | undefined> {
  const options: ("npm" | "yarn")[] = ["npm", "yarn"];

  const result = await vscode.window.showQuickPick(options, {
    placeHolder: "Select package manager",
    title: "Choose a package manager for installation",
  });

  return result;
}

async function handleSelectPackageManager(context: vscode.ExtensionContext) {
  let packageManager = await promptPackageManager();
  if (!packageManager) {
    return;
  }
  await context.workspaceState.update(
    "packageFinderPackageManager",
    packageManager
  );

  return packageManager;
}

/**
 * Handles the package search and installation workflow.
 */
async function handlePackageSearchAndInstall(context: vscode.ExtensionContext) {
  let selectedPackageManager: string = context.workspaceState.get(
    "packageFinderPackageManager",
    ""
  );

  if (!selectedPackageManager) {
    const result = await handleSelectPackageManager(context);

    if (!result) {
      return;
    }
    selectedPackageManager = result;
  }

  const searchTerm = await vscode.window.showInputBox({
    prompt: "Enter npm package name to search",
    placeHolder: "e.g., express",
  });

  if (!searchTerm) {
    return;
  }

  const packages = await fetchNpmPackages(searchTerm);

  if (!packages || packages.length === 0) {
    vscode.window.showErrorMessage("No results found for your search.");
    return;
  }

  const selectedPackage = await vscode.window.showQuickPick(
    packages.map((pkg) => ({
      label: pkg.name,
      description: pkg.description,
      detail: `Version: ${pkg.version}`,
    })),
    { placeHolder: "Select a package to install" }
  );

  if (!selectedPackage) {
    return;
  }

  vscode.window.showInformationMessage(
    `Installing package: ${selectedPackage.label} using ${selectedPackageManager}...`
  );
  installNpmPackage(selectedPackage.label, selectedPackageManager);
}

function clearWorkSpaceData(context: vscode.ExtensionContext) {
  context.workspaceState.update("packageFinderPackageManager", "");
}

/**
 * Activates the extension.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("packagefinder.finder", () =>
    handlePackageSearchAndInstall(context)
  );

  const selectPackageManagerCommand = vscode.commands.registerCommand(
    "packagefinder.selectPackageManager",
    () => handleSelectPackageManager(context)
  );

  const clearPackageManagerWorkSpaceCommand = vscode.commands.registerCommand(
    "packagefinder.clearWorkSpaceData",
    () => clearWorkSpaceData(context)
  );

  context.subscriptions.push(
    command,
    selectPackageManagerCommand,
    clearPackageManagerWorkSpaceCommand
  );
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}

import * as vscode from "vscode";
import axios from "axios";

type npmResultsType = {
  name: string;
  version: string;
};

async function searchPackage(
  query: string
): Promise<Array<npmResultsType> | null> {
  const npmUrl = `https://api.npms.io/v2/search?q=${encodeURIComponent(query)}`;

  try {
    const npmResponse = await axios.get(npmUrl);
    const npmResults = npmResponse.data.results.map((pkg: any) => ({
      name: pkg.package.name,
      version: pkg.package.version,
    }));

    return npmResults;
  } catch (error) {
    vscode.window.showErrorMessage("Error while searching for npm packages");
    console.error(error);
    return null;
  }
}

function installPackage(packageName: string, installer: "npm" | "yarn") {
  const installCommand = installer === "npm" ? "npm install" : "yarn add";

  const terminal =
    vscode.window.activeTerminal ||
    vscode.window.createTerminal(`Install ${packageName}`);
  terminal.show();
  terminal.sendText(`${installCommand} ${packageName}`);
}

async function pickPackageManager(): Promise<"npm" | "yarn" | undefined> {
  const packageManagers: ("npm" | "yarn")[] = ["npm", "yarn"];

  const selection = await vscode.window.showQuickPick(packageManagers, {
    placeHolder: "Select package manager",
    title: "What do you want to use to install the package?",
  });

  if (selection === "npm" || selection === "yarn") {
    return selection;
  }
  return undefined;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "packagefinder.finder",
    async () => {
      const searchTerm = await vscode.window.showInputBox({
        prompt: "Enter npm package name to search",
      });

      if (!searchTerm) {
        vscode.window.showErrorMessage("Search term cannot be empty!");
        return;
      }

      const results = await searchPackage(searchTerm);

      if (results && results.length > 0) {
        const selectedPackage = await vscode.window.showQuickPick(
          results.map((item) => ({
            label: item.name,
            description: `Version: ${item.version}`,
          })),
          {
            placeHolder: "Pick one package",
          }
        );

        if (selectedPackage) {
          try {
            const selectedManager = await pickPackageManager();

            if (selectedManager) {
              vscode.window.showInformationMessage(
                `Installing package: ${selectedPackage.label} using ${selectedManager}...`
              );
              installPackage(selectedPackage.label, selectedManager);
            } else {
              vscode.window.showInformationMessage(
                `The installation of package: ${selectedPackage.label} was canceled.`
              );
            }
          } catch (error) {
            vscode.window.showErrorMessage(`An error occurred: ${error}`);
          }
        }
      } else {
        vscode.window.showErrorMessage("No results found for your search.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

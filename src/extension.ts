// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";
import { exec } from "child_process";
import { stderr, stdout } from "process";

async function searchPackage(query: string) {
  const npmUrl = `https://api.npms.io/v2/search?q=${encodeURIComponent(query)}`;

  try {
    // Wyszukiwanie w npm
    const npmResponse = await axios.get(npmUrl);
    console.log(npmResponse);
    const npmResults = npmResponse.data.results.map(
      (pkg: any) => pkg.package.name
    );
    console.log(npmResults);
    return {
      npm: npmResults,
    };
  } catch (error) {
    vscode.window.showErrorMessage(
      "Wystąpił błąd podczas wyszukiwania pakietów."
    );
    console.error(error);
    return null;
  }
}
function installPackage(packageName: string) {
  const terminal = vscode.window.createTerminal(`Install ${packageName}`);

  terminal.show();
  terminal.sendText(`npm install ${packageName}`);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "packagefinder" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "packagefinder.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const searchTerm = await vscode.window.showInputBox({
        prompt: "Enter npm package name to search",
      });

      if (!searchTerm) {
        vscode.window.showErrorMessage("Search term cannot be empty!");
        return;
      }
      const results = await searchPackage(searchTerm);
      if (results) {
        const npmResults = results.npm.join(", ");
        const selectedPackage = await vscode.window.showQuickPick(
          results.npm.concat(results.npm),
          {
            placeHolder: "Pick one package",
          }
        );

        if (selectedPackage) {
          const installConfirmation =
            await vscode.window.showInformationMessage(
              `Do you want to install package: ${selectedPackage}`,
              { modal: true },
              "Yes",
              "No"
            );

          if (installConfirmation) {
            installPackage(selectedPackage);
          } else {
            vscode.window.showInformationMessage("Reject install package");
          }
        }
        vscode.window.showInformationMessage(`NPM: ${npmResults}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

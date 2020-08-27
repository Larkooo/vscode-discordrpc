// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const DiscordRPC = require('discord-rpc');
const clientId = '748367590870614016';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const rpc = new DiscordRPC.Client({ transport: 'ipc' });
	const startTimestamp = new Date();

	const fileNameNotSplit = vscode.window.activeTextEditor.document.fileName;
	const fileNameSplitted = fileNameNotSplit.split("\\");
	const fileName = fileNameSplitted.slice(-1)[0];
	const extensionSplit = fileName.split(".")
	const extension = extensionSplit.slice(-1)[0]
	//const lineAt = vscode.window.activeTextEditor.document.lineCount;

	function isInsider(){
		if (vscode.env.appName == "Visual Studio Code - Insiders") {
			return true;
		} else {
			return false;
		}
	}

	async function setActivity() {
		rpc.setActivity({
			details: "Editing " + fileName,
			state: extension,
			startTimestamp,
			largeImageKey: isInsider() ? 'vsci':'vs-trans',
			largeImageText: 'yes',
			smallImageKey: isInsider() ? 'vsci':'vs-trans',
			smallImageText: isInsider() ? 'Insiders build':'Stable build',
			instance: false,
		  });
	}
	
	rpc.on('ready', () => {
		setActivity();
		// activity can only be set every 15 seconds
	});
	rpc.login({ clientId }).catch(console.error);


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "discord-rich-presence" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('discord-rich-presence.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage(`${vscode.env.appName}`);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

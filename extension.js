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

	
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

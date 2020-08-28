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
	var startTimestamp = new Date();

	//const lineAt = vscode.window.activeTextEditor.document.lineCount;

	function isInsider(){
		if (vscode.env.appName == "Visual Studio Code - Insiders") {
			return true;
		} else {
			return false;
		}
	}

	var idling = false;

	try {
		var fileNameNotSplit = vscode.window.activeTextEditor.document.fileName;
		var fileNameSplitted = fileNameNotSplit.split("\\");
		var fileName = fileNameSplitted.slice(-1)[0];
	
		var extensionSplit = fileName.split(".")
		var extension = extensionSplit.slice(-1)[0]
	} catch(err) {
		idling = true
		console.log(err)
	}

	async function setActivity() {

		var workspace = vscode.workspace.name

		rpc.setActivity({
			details: idling ? "Idling":"Editing " + fileName,
			state: workspace != null ? "Working in " + vscode.workspace.name:vscode.workspace.name,
			startTimestamp,
			largeImageKey: 'vsci',
			largeImageText: fileName,
			smallImageKey: isInsider() ? 'vsci':'vs-trans',
			smallImageText: isInsider() ? 'Insiders build':'Stable build',
			instance: false,
		  });
	}

	vscode.window.onDidChangeActiveTextEditor(event => {
		try {
			fileNameNotSplit = event.document.fileName;
			fileNameSplitted = fileNameNotSplit.split("\\");
			fileName = fileNameSplitted.slice(-1)[0];
	
			extensionSplit = fileName.split(".")
			extension = extensionSplit.slice(-1)[0]
			idling = false;
		} catch(err) {
			idling = true;
			console.log(err)
		}
		

		startTimestamp = new Date();
	}); 

	rpc.on('ready', () => {
		setActivity();
		// activity can only be set every 15 seconds
		setInterval(() => {
			setActivity();
		  }, 15000);
	});
	rpc.login({ clientId }).catch(console.error);
	console.log('rpc on');

	
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

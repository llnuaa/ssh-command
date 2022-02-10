'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import { SshServerTreeDataProvider } from './tree/sshServerTreeDataProvider';
import { QuickCommandTreeDataProvider } from './tree/quickCommandTreeDataProvider';
import { SshServerNode } from './tree/sshServerNode';
import { QuickCommandNode } from './tree/quickCommandNode';

/**
     * 等待指定的时间
     * @param ms
     */
 export const sleep = (ms) => {
	return new Promise(resolve =>
		setTimeout(
			resolve, ms));
};

export function activate(context: vscode.ExtensionContext) {
	let path: string;
	const pathConfigs: string = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
	const paths: string[] = pathConfigs.split(";");
	for (const p of paths) {
		if (fs.existsSync(p)) {
			path = p;
			break;
		}
	}

	const sshServerTreeDataProvider = new SshServerTreeDataProvider(context, path);
	const quickCommandTreeDataProvider = new QuickCommandTreeDataProvider(context, path);
	vscode.window.createTreeView('sshServerTree', { treeDataProvider: sshServerTreeDataProvider, showCollapseAll: true });
	vscode.window.createTreeView('quickCommandTree', { treeDataProvider: quickCommandTreeDataProvider, showCollapseAll: true });
	vscode.commands.registerCommand('sshServerTree.refresh', () => sshServerTreeDataProvider.refresh());
	vscode.commands.registerCommand('quickCommandTree.refresh', () => quickCommandTreeDataProvider.refresh());
	vscode.commands.registerCommand('sshServerTree.edit', async () => {
		vscode.window.showTextDocument(vscode.Uri.file(path));
	});
	vscode.commands.registerCommand('quickCommandTree.edit', async () => {
		vscode.window.showTextDocument(vscode.Uri.file(path));
	});
	vscode.commands.registerCommand('sshServerTree.openSshServer', async (node: SshServerNode) => {
		const newTerm = vscode.window.createTerminal(node.host);
		newTerm.show();
		const arg = "ssh -o \"StrictHostKeyChecking no\" " + node.user + "@" + node.ip;
		newTerm.sendText(arg);
		if (node.pwd != "") {
			const sleep_time = vscode.workspace.getConfiguration('SSH-Command.config').get('sleep');
			await sleep(sleep_time);
			newTerm.sendText(node.pwd);
		}
	});
	vscode.commands.registerCommand('quickCommandTree.inputQuickCommand', async (node: QuickCommandNode) => {
		const activeTerm = vscode.window.activeTerminal;
		if (activeTerm == undefined) {
			vscode.window.showInformationMessage('No active Terminal!');
		}

		activeTerm.sendText(node.value, node.flag);
	});
}

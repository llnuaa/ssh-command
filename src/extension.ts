'use strict';

import * as vscode from 'vscode';
import { SshServerTreeDataProvider } from './tree/sshServerTreeDataProvider';
import { SshServerNode } from './tree/sshServerNode';

export function activate(context: vscode.ExtensionContext) {
	const sshServerTreeDataProvider = new SshServerTreeDataProvider(context);
	vscode.window.createTreeView('sshServerTree', { treeDataProvider: sshServerTreeDataProvider, showCollapseAll: true });
	vscode.commands.registerCommand('sshServerTree.refresh', () => sshServerTreeDataProvider.refresh());
	vscode.commands.registerCommand('sshServerTree.edit', async () => {
		let path : string;
		path = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
		vscode.window.showTextDocument(vscode.Uri.file(path));
	});
	vscode.commands.registerCommand('sshServerTree.openSshServer', async (node: SshServerNode) => {
		let path : string;
		path = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
		vscode.window.showTextDocument(vscode.Uri.file(path));
	});
}

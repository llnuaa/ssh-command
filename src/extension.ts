'use strict';

import * as vscode from 'vscode';
import { JsonOutlineProvider } from './json/jsonOutline';

export function activate(context: vscode.ExtensionContext) {
	const jsonOutlineProvider = new JsonOutlineProvider(context);
	vscode.window.createTreeView('jsonOutline', { treeDataProvider: jsonOutlineProvider, showCollapseAll: true });
	vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	vscode.commands.registerCommand('jsonOutline.edit', async () => {
		let path : string;
		path = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
		vscode.window.showTextDocument(vscode.Uri.file(path));
	});
}

import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as path from 'path';
import * as fs from 'fs'
import { QuickCommandNode } from './quickCommandNode';

export class QuickCommandTreeDataProvider implements vscode.TreeDataProvider<QuickCommandNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<QuickCommandNode | undefined | null> = new vscode.EventEmitter<QuickCommandNode | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

	private path: string;
	private commandsNodes: QuickCommandNode[];

	constructor(private context: vscode.ExtensionContext) {
		this.path = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
		this.parseTree();
	}

	refresh(offset?: number): void {
		this.parseTree();
		this._onDidChangeTreeData.fire(undefined);
	}

	private parseTree(): void {
		let file = vscode.Uri.file(this.path);
		let text = fs.readFileSync(this.path, "utf-8");
		let tree = json.parse(text);
		let commands = tree['commands'];
		const res: QuickCommandNode[] = [];
		for (const command of commands) {
			let node = new QuickCommandNode(Object.assign({}, {
				key: command['key'],
				value: command['value'],
				flag: command['flag'],
			}));
			res.push(node);
		}
		this.commandsNodes = res;
	}

	getChildren(element?: QuickCommandNode | undefined): vscode.ProviderResult<QuickCommandNode[]> {
		return this.commandsNodes;
	}

	getTreeItem(element: QuickCommandNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return {
            label: element.key,
            tooltip: element.value,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: null,
            command: element.command,
        };
	}

}

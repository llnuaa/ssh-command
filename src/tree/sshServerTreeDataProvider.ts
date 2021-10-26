import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as path from 'path';
import * as fs from 'fs'
import { SshServerNode } from './sshServerNode';

export class SshServerTreeDataProvider implements vscode.TreeDataProvider<SshServerNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<SshServerNode | undefined | null> = new vscode.EventEmitter<SshServerNode | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

	private path: string;
	private serverNodes: SshServerNode[];

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
		let servers = tree['servers'];
		const res: SshServerNode[] = [];
		for (const server of servers) {
			let node = new SshServerNode(Object.assign({}, {
				host: server['host'],
				ip: server['ip'],
				user: server['user'],
				pwd: server['pwd'],
			}));
			res.push(node);
		}
		this.serverNodes = res;
	}

	getChildren(element?: SshServerNode | undefined): vscode.ProviderResult<SshServerNode[]> {
		return this.serverNodes;
	}

	getTreeItem(element: SshServerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return {
            label: element.host,
            tooltip: element.ip,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: null,
            command: element.command,
        };
	}

}

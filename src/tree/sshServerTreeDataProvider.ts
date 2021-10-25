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
		let server1 = servers[0];
		let host = server1['host'];
		let commands = tree['commands'];
	}

	getChildren(element?: SshServerNode | undefined): vscode.ProviderResult<SshServerNode[]> {
		return this.serverNodes;
	}

	getTreeItem(element: SshServerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return {
            label: element.host,
            tooltip: element.host,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: null,
            command: element.command,
        };
	}

	private getIcon(node: json.Node): any {
		const nodeType = node.type;
		if (nodeType === 'boolean') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'boolean.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'boolean.svg'))
			};
		}
		if (nodeType === 'string') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'string.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'string.svg'))
			};
		}
		if (nodeType === 'number') {
			return {
				light: this.context.asAbsolutePath(path.join('resources', 'light', 'number.svg')),
				dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'number.svg'))
			};
		}
		return null;
	}

	private getLabel(node: json.Node): string {
		if (node.parent.type === 'array') {
			const prefix = node.parent.children.indexOf(node).toString();
			if (node.type === 'object') {
				return prefix + ': { '+ this.getNodeChildrenCount(node) +' }';
			}
			if (node.type === 'array') {
				return prefix + ': [ '+ this.getNodeChildrenCount(node) +' ]';
			}
			return prefix + ':' + node.value.toString();
		}
		else {
			const property = node.parent.children[0].value.toString();
			if (node.type === 'array' || node.type === 'object') {
				if (node.type === 'object') {
					return '{ '+ this.getNodeChildrenCount(node) +' } ' + property;
				}
				if (node.type === 'array') {
					return '[ '+ this.getNodeChildrenCount(node) +' ] ' + property;
				}
			}
			const value = "123";//this.editor.document.getText(new vscode.Range(this.editor.document.positionAt(node.offset), this.editor.document.positionAt(node.offset + node.length)));
			return `${property}: ${value}`;
		}
	}

	private getNodeChildrenCount(node: json.Node): string {
		let count = '';
		if (node && node.children) {
			count = node.children.length + '';
		}
		return count;
	}
}
import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as fs from 'fs';
import { SshServerNode } from './sshServerNode';

export class SshServerTreeDataProvider implements vscode.TreeDataProvider<SshServerNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<SshServerNode | undefined | null> = new vscode.EventEmitter<SshServerNode | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

	private path: string;
	private serverNodes: SshServerNode[];

	constructor(private context: vscode.ExtensionContext, path: string) {
		this.path = path;
		this.parseTree();
	}

	refresh(offset?: number): void {
		this.parseTree();
		this._onDidChangeTreeData.fire(undefined);
	}

	private parseTree(): void {
		let text = fs.readFileSync(this.path, "utf-8");
		let tree = json.parse(text);
		let servers = tree['servers'];
		const res: SshServerNode[] = [];
		for (const server of servers) {
			const children: SshServerNode[] = [];
			for (const child of server['server']) {
				let childNode = new SshServerNode(Object.assign({}, {
					host: child['host'],
					ip: child['ip'],
					user: child['user'],
					pwd: child['pwd'],
				}), undefined);
				children.push(childNode);
			}
			let node = new SshServerNode(Object.assign({}, {
				host: server['group'],
				ip: server['group'],
				user: server['group'],
				pwd: server['group'],
			}), children);
			res.push(node);
		}
		this.serverNodes = res;
	}

	getChildren(element?: SshServerNode | undefined): vscode.ProviderResult<SshServerNode[]> {
		if (element === undefined) {
            return this.serverNodes;
        }
        return element.children;
	}

	getTreeItem(element: SshServerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

}

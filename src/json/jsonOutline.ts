import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as path from 'path';
import * as fs from 'fs'

export class JsonOutlineProvider implements vscode.TreeDataProvider<number> {

	private _onDidChangeTreeData: vscode.EventEmitter<number | null> = new vscode.EventEmitter<number | null>();
	readonly onDidChangeTreeData: vscode.Event<number | null> = this._onDidChangeTreeData.event;

	private tree: json.Node;
	private path: string;
	private text: string;

	constructor(private context: vscode.ExtensionContext) {
		this.path = vscode.workspace.getConfiguration('SSH-Command.config').get('path');
		this.parseTree();
	}

	refresh(offset?: number): void {
		this.parseTree();
		this._onDidChangeTreeData.fire(undefined);
	}

	private parseTree(): void {
		this.tree = null;
		let file = vscode.Uri.file(this.path);
		this.text = fs.readFileSync(this.path, "utf-8");
		this.tree = json.parse(this.text);
		let servers = this.tree['servers'];
		let length = servers.length;
		let server1 = servers[0];
		let host = server1['host'];
		let commands = this.tree['commands'];
	}

	getChildren(offset?: number): Thenable<number[]> {
		if (offset) {
			const path = json.getLocation(this.text, offset).path;
			const node = json.findNodeAtLocation(this.tree, path);
			return Promise.resolve(this.getChildrenOffsets(node));
		} else {
			return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
		}
	}

	private getChildrenOffsets(node: json.Node): number[] {
		const offsets: number[] = [];
		if (node && node.children) {
			for (const child of node.children) {
				const childPath = json.getLocation(this.text, child.offset).path;
				const childNode = json.findNodeAtLocation(this.tree, childPath);
				if (childNode) {
					offsets.push(childNode.offset);
				}
			}
		}
		return offsets;
	}

	getTreeItem(offset: number): vscode.TreeItem {
		const path = json.getLocation(this.text, offset).path;
		const valueNode = json.findNodeAtLocation(this.tree, path);
		if (valueNode) {
			const hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
			const treeItem: vscode.TreeItem = new vscode.TreeItem(this.getLabel(valueNode), hasChildren ? valueNode.type === 'object' ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
			treeItem.command = {
				command: 'extension.openJsonSelection',
				title: '',
				arguments: []
			};
			treeItem.iconPath = this.getIcon(valueNode);
			treeItem.contextValue = valueNode.type;
			return treeItem;
		}
		return null;
	}

	select(range: vscode.Range) {
		// this.editor.selection = new vscode.Selection(range.start, range.end);
		// // 编辑窗跳转到指定范围
        // this.editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
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
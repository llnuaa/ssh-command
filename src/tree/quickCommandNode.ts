// Copyright (c) longbl. All rights reserved.
// Licensed under the MIT license.

import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { QuickCommand } from "./shared";

export class QuickCommandNode extends TreeItem {
    public children: QuickCommandNode[] | undefined;

    constructor(private data: QuickCommand, children?: QuickCommandNode[] | undefined) {
        super(data.key, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
        if (children === undefined) {
            this.command = {
                title: "Input Quick Command",
                command: "quickCommandTree.inputQuickCommand",
                arguments: [this],
            };
        }
        this.children = children;
        this.tooltip = data.value;
    }

    public get key(): string {
        return this.data.key;
    }
    public get value(): string {
        return this.data.value;
    }

    public get flag(): boolean {
        return this.data.flag;
    }

}

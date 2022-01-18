// Copyright (c) longbl. All rights reserved.
// Licensed under the MIT license.

import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { SshServer } from "./shared";

export class SshServerNode extends TreeItem {
    public children: SshServerNode[] | undefined;

    constructor(private data: SshServer, children?: SshServerNode[] | undefined) {
        super(data.host, children === undefined ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed);
        if (children === undefined) {
            this.command = {
                title: "Open SSH Server",
                command: "sshServerTree.openSshServer",
                arguments: [this],
            };
        }
        this.children = children;
        this.tooltip = data.ip;
    }

    public get host(): string {
        return this.data.host;
    }
    public get ip(): string {
        return this.data.ip;
    }

    public get user(): string {
        return this.data.user;
    }

    public get pwd(): string {
        return this.data.pwd;
    }

}

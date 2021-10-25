// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import { Command, Uri } from "vscode";
import { SshServer } from "./shared";

export class SshServerNode {

    constructor(private data: SshServer) { }

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

    // public get dir(): string {
    //     return this.data.dir;
    // }

    // public get isSshServer(): boolean {
    //     return this.isSshServerNode;
    // }

    public get command(): Command {
        return {
            title: "Open SSH Server",
            command: "sshServerTree.openSshServer",
            arguments: [this],
        };
    }

}

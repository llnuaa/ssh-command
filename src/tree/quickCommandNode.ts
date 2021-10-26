// Copyright (c) longbl. All rights reserved.
// Licensed under the MIT license.

import { Command, Uri } from "vscode";
import { QuickCommand } from "./shared";

export class QuickCommandNode {

    constructor(private data: QuickCommand) { }

    public get key(): string {
        return this.data.key;
    }
    public get value(): string {
        return this.data.value;
    }

    public get flag(): boolean {
        return this.data.flag;
    }

    public get command(): Command {
        return {
            title: "Input Quick Command",
            command: "quickCommandTree.inputQuickCommand",
            arguments: [this],
        };
    }

}

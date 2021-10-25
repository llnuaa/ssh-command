import * as vscode from "vscode";

export interface SshServer {
    host: string;
    ip: string;
    user: string;
    pwd: string;
}

export interface SshServerArray {
	dir: string;
	servers: SshServer[];
}
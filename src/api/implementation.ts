import { PathLike } from "original-fs";
import * as fs from "fs";
import { IpcMainEvent } from "electron";

export function handleReadFile(event: IpcMainEvent, path: PathLike): string {
    return fs.readFileSync(path, { encoding: 'utf-8' });
}
import { PathLike } from "original-fs";
import * as fs from "fs";
import { IpcMainEvent } from "electron";
import { LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";

export function handleReadFile(event: IpcMainEvent, path: PathLike): string {
    return fs.readFileSync(path, { encoding: 'utf-8' });
}

export function handleGetDatabase(event: IpcMainEvent): LocalTubeDatabase {
    return DatabaseManager.getDatabase();
}
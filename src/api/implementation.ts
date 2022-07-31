import { PathLike } from "original-fs";
import * as fs from "fs";
import { IpcMainEvent } from "electron";
import { LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";
import { ShowDeserializer } from "../backend/ShowDeserializer";

export function handleGetThumbnailBase64(event: IpcMainEvent, path: PathLike): Promise<string> {
    return ShowDeserializer.getVideoThumbnailBase64(path);
}

export function handleGetDatabase(event: IpcMainEvent): LocalTubeDatabase {
    return DatabaseManager.getDatabase();
}
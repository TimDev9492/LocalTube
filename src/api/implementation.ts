import { PathLike } from "original-fs";
import { IpcMainEvent } from "electron";
import { LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";
import { ShowDeserializer } from "../backend/ShowDeserializer";

export function handleGetThumbnailBuffer(event: IpcMainEvent, path: PathLike): Promise<Buffer> {
    return ShowDeserializer.getVideoThumbnailBuffer(path);
}

export function handleGetDatabase(event: IpcMainEvent): LocalTubeDatabase {
    return DatabaseManager.getDatabase();
}
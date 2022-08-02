import { PathLike } from "original-fs";
import { IpcMainEvent } from "electron";
import { LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";
import { ShowDeserializer } from "../backend/ShowDeserializer";
import { VideoPlayer } from "../backend/VideoPlayer";

export function handleGetThumbnailBuffer(event: IpcMainEvent, path: PathLike): Promise<Buffer> {
    return ShowDeserializer.getVideoThumbnailBuffer(path);
}

export function handleGetDatabase(event: IpcMainEvent): LocalTubeDatabase {
    return DatabaseManager.getDatabase();
}

export function handleUpdateVideoTimePos(event: IpcMainEvent, videoPath: PathLike, timePos: number): void {
    DatabaseManager.updateVideoTimePos(videoPath, timePos);
}

export function handleOpenMpv(event: IpcMainEvent, path: PathLike, startTime: number): void {
    VideoPlayer.openMpv(path, startTime);
}

export function handleSignalMpvTimePosChange(event: IpcMainEvent): void {
    VideoPlayer.addWebContentsListener(event.sender);
}
import { PathLike } from "original-fs";
import { BrowserWindow, dialog, IpcMainEvent, OpenDialogOptions } from "electron";
import { LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";
import { ShowDeserializer } from "../backend/ShowDeserializer";
import { VideoPlayer } from "../backend/VideoPlayer";
import { stat } from 'fs';
import { startTransition } from "react";

export function handleGetThumbnailBuffer(event: IpcMainEvent, path: PathLike): Promise<Buffer> {
    return ShowDeserializer.getVideoThumbnailBuffer(path);
}

export function handleOpenDialog(event: IpcMainEvent, dialogOptions: OpenDialogOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const win: BrowserWindow = BrowserWindow.fromWebContents(event.sender);
        dialog.showOpenDialog(win, dialogOptions).then(
            ({ filePaths }) => resolve((filePaths && filePaths.length) ? filePaths[0] : null),
            (error) => reject(error),
        );
    });
}

export function handleCheckDirPath(event: IpcMainEvent, path: PathLike): Promise<boolean> {
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            resolve(!err && stats && stats.isDirectory());
        });
    });
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
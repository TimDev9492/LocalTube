import { PathLike } from "original-fs";
import { BrowserWindow, dialog, IpcMainEvent, OpenDialogOptions } from "electron";
import { FileConfig, LocalTubeDatabase } from "../backend/structure";
import { DatabaseManager } from "../backend/DatabaseManager";
import { ShowDeserializer } from "../backend/ShowDeserializer";
import { VideoPlayer } from "../backend/VideoPlayer";
import * as fs from 'fs';

export function handleGetThumbnailBuffer(event: IpcMainEvent, path: PathLike, directPath: boolean): Promise<Buffer> {
    if (directPath) {
        return new Promise<Buffer>((resolve, reject) => fs.readFile(path, (err, data) => {
            err && reject(err);
            data && resolve(data);
        }));
    }
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
        fs.stat(path, (err, stats) => {
            if (!err && stats && stats.isDirectory()) {
                fs.access(path, fs.constants.R_OK, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                })
            } else {
                resolve(false);
            }
        });
    });
}

export function handleGetRandomFileFromDir(event: IpcMainEvent, dirPath: PathLike, fileConfig: FileConfig): Promise<PathLike> {
    return new Promise<PathLike>((resolve, reject) => {
        ShowDeserializer.getVideoFiles(dirPath, fileConfig).then(
            (videoFiles) => {
                const randomChoice = videoFiles.length ? videoFiles[Math.floor(Math.random() * videoFiles.length)] : null;
                resolve(randomChoice !== null ? randomChoice.relativePath : null);
            },
            (error) => reject(error)
        );
    });
}

export function handleGetDatabase(event: IpcMainEvent): LocalTubeDatabase {
    return DatabaseManager.getDatabase();
}

export function handleAddShow(event: IpcMainEvent, dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        ShowDeserializer.deserializeShow(dirPath, fileConfig, isConventionalShow, showTitle).then(
            // add show to database
            (deserializedShow) => {
                DatabaseManager.addShowToDatabase(deserializedShow);
                resolve(deserializedShow.metadata.title);
            },
            (error) => reject(error)
        );
    });
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

/**
 * DEBUG
 */

export function handleDebugGetDeserializedShow(event: IpcMainEvent, dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string) {
    return ShowDeserializer.deserializeShow(dirPath, fileConfig, isConventionalShow, showTitle);
}
import { contextBridge, ipcMain, IpcRenderer, ipcRenderer, OpenDialogOptions } from "electron";
import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";
import { handleCheckDirPath, handleOpenDialog, handleUpdateVideoTimePos, handleSignalMpvTimePosChange, handleOpenMpv, handleGetThumbnailBuffer, handleGetDatabase } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";

export const buildAPI: Function = (): void => {
    contextBridge.exposeInMainWorld('localtubeAPI', {
        getThumbnailBuffer: (path: PathLike): Promise<Buffer> => ipcRenderer.invoke('fs:getThumbnailBuffer', path),
        openDialog: (dialogOptions: OpenDialogOptions): Promise<string> => ipcRenderer.invoke('fs:openDialog', dialogOptions),
        checkDirPath: (path: PathLike): Promise<boolean> => ipcRenderer.invoke('fs:checkDirPath', path),
        getDatabase: (): Promise<LocalTubeDatabase> => ipcRenderer.invoke('db:getDatabase'),
        updateVideoTimePos: (videoPath: PathLike, timePos: number): void => ipcRenderer.send('db:updateVideoTimePos', videoPath, timePos),
        openMpv: (path: PathLike, startTime: number): void => ipcRenderer.send('os:openMpv', path, startTime),
        signalMpvTimePosChange: (): void => ipcRenderer.send('mpv:listen-timepos'),
        onMpvTimePosChange: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void): IpcRenderer => ipcRenderer.on('mpv:update-timepos', callback),
        onMpvExit: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void): IpcRenderer => ipcRenderer.on('mpv:exit', callback),
    } as LocalTubeAPI);
}

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:getThumbnailBuffer', handleGetThumbnailBuffer);
    ipcMain.handle('fs:openDialog', handleOpenDialog);
    ipcMain.handle('fs:checkDirPath', handleCheckDirPath);
    ipcMain.handle('db:getDatabase', handleGetDatabase);
    ipcMain.on('db:updateVideoTimePos', handleUpdateVideoTimePos);
    ipcMain.on('os:openMpv', handleOpenMpv);
    ipcMain.on('mpv:listen-timepos', handleSignalMpvTimePosChange);
}

import { contextBridge, ipcMain, IpcRenderer, ipcRenderer, OpenDialogOptions } from "electron";
import { PathLike } from "original-fs";
import { FileConfig, LocalShow, LocalTubeDatabase } from "../backend/structure";
import { handleCheckShowName, handleAddShow, handleDebugGetDeserializedShow, handleGetRandomFileFromDir, handleCheckDirPath, handleOpenDialog, handleUpdateVideoTimePos, handleSignalMpvTimePosChange, handleOpenMpv, handleGetThumbnailBuffer, handleGetDatabase } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";

export const buildAPI: Function = (): void => {
    contextBridge.exposeInMainWorld('localtubeAPI', {
        getThumbnailBuffer: (path: PathLike, directPath: boolean): Promise<Buffer> => ipcRenderer.invoke('fs:getThumbnailBuffer', path, directPath),
        openDialog: (dialogOptions: OpenDialogOptions): Promise<string> => ipcRenderer.invoke('fs:openDialog', dialogOptions),
        checkDirPath: (path: PathLike): Promise<boolean> => ipcRenderer.invoke('fs:checkDirPath', path),
        getRandomFileFromDir: (dirPath: PathLike, fileConfig: FileConfig) => ipcRenderer.invoke('fs:getRandomFileFromDir', dirPath, fileConfig),
        checkShowName: (showName: string): Promise<boolean> => ipcRenderer.invoke('db:checkShowName', showName),
        getDatabase: (): Promise<LocalTubeDatabase> => ipcRenderer.invoke('db:getDatabase'),
        addShow: (dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string): Promise<string> => ipcRenderer.invoke('db:addShow', dirPath, fileConfig, isConventionalShow, showTitle),
        updateVideoTimePos: (videoPath: PathLike, timePos: number): void => ipcRenderer.send('db:updateVideoTimePos', videoPath, timePos),
        openMpv: (path: PathLike, startTime: number): void => ipcRenderer.send('os:openMpv', path, startTime),
        signalMpvTimePosChange: (): void => ipcRenderer.send('mpv:listen-timepos'),
        onMpvTimePosChange: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void): IpcRenderer => ipcRenderer.on('mpv:update-timepos', callback),
        onMpvExit: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void): IpcRenderer => ipcRenderer.on('mpv:exit', callback),

        // debug
        getDeserializedShow: (dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string): Promise<LocalShow> => ipcRenderer.invoke('debug:getDeserializedShow', dirPath, fileConfig, isConventionalShow, showTitle),
    } as LocalTubeAPI);
}

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:getThumbnailBuffer', handleGetThumbnailBuffer);
    ipcMain.handle('fs:openDialog', handleOpenDialog);
    ipcMain.handle('fs:checkDirPath', handleCheckDirPath);
    ipcMain.handle('fs:getRandomFileFromDir', handleGetRandomFileFromDir);
    ipcMain.handle('db:checkShowName', handleCheckShowName);
    ipcMain.handle('db:getDatabase', handleGetDatabase);
    ipcMain.handle('db:addShow', handleAddShow);
    ipcMain.on('db:updateVideoTimePos', handleUpdateVideoTimePos);
    ipcMain.on('os:openMpv', handleOpenMpv);
    ipcMain.on('mpv:listen-timepos', handleSignalMpvTimePosChange);

    // debug
    ipcMain.handle('debug:getDeserializedShow', handleDebugGetDeserializedShow);
}

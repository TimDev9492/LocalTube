import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";
import { handleGetThumbnailBuffer, handleGetDatabase } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";

export const buildAPI: Function = (): void => {
    contextBridge.exposeInMainWorld('localtubeAPI', {
        getThumbnailBuffer: (path: PathLike): Promise<Buffer> => ipcRenderer.invoke('fs:getThumbnailBuffer', path),
        getDatabase: (): Promise<LocalTubeDatabase> => ipcRenderer.invoke('db:getDatabase'),
    } as LocalTubeAPI);
}

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:getThumbnailBuffer', handleGetThumbnailBuffer);
    ipcMain.handle('db:getDatabase', handleGetDatabase);
}

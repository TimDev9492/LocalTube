import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";
import { handleGetThumbnailBase64, handleGetDatabase } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";

export const buildAPI: Function = (): void => {
    contextBridge.exposeInMainWorld('localtubeAPI', {
        getThumbnailBase64: (path: PathLike): Promise<string> => ipcRenderer.invoke('fs:getThumbnailBase64', path),
        getDatabase: (): Promise<LocalTubeDatabase> => ipcRenderer.invoke('db:getDatabase'),
    } as LocalTubeAPI);
}

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:getThumbnailBase64', handleGetThumbnailBase64);
    ipcMain.handle('db:getDatabase', handleGetDatabase);
}

import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";
import { handleGetDatabase, handleReadFile } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";

contextBridge.exposeInMainWorld('localtubeAPI', {
    readFile: (path: PathLike): Promise<string> => ipcRenderer.invoke('fs:readFile', path),
    getDatabase: (): Promise<LocalTubeDatabase> => ipcRenderer.invoke('db:getDatabase'),
} as LocalTubeAPI);

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:readFile', handleReadFile);
    ipcMain.handle('db:getDatabase', handleGetDatabase);
}

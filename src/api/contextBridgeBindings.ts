import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { PathLike } from "original-fs";
import { handleReadFile } from "./implementation";
import { LocalTubeAPI } from "./LocalTubeAPI";


contextBridge.exposeInMainWorld('localtubeAPI', {
    readFile: (path: PathLike): Promise<string> => ipcRenderer.invoke('fs:readFile', path),
} as LocalTubeAPI);

export const initializeBindings: Function = (): void => {
    ipcMain.handle('fs:readFile', handleReadFile);
}

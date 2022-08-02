import { IpcRenderer } from "electron";
import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";

declare global {
    interface Window {
        localtubeAPI: LocalTubeAPI;
    }
}

export interface LocalTubeAPI {
    getThumbnailBuffer: (path: PathLike) => Promise<Buffer>;
    getDatabase: () => Promise<LocalTubeDatabase>;
    updateVideoTimePos: (videoPath: PathLike, timePos: number) => void;
    openMpv: (path: PathLike, startTime: number) => void;
    signalMpvTimePosChange: () => void;
    onMpvTimePosChange: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => IpcRenderer;
    onMpvExit: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => IpcRenderer;
}
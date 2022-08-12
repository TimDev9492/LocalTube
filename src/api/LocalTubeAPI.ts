import { IpcRenderer, OpenDialogOptions } from "electron";
import { PathLike } from "original-fs";
import { FileConfig, LocalShow, LocalTubeDatabase } from "../backend/structure";

declare global {
    interface Window {
        localtubeAPI: LocalTubeAPI;
        ffmpegPaths: any;
    }
}

export interface LocalTubeAPI {
    getThumbnailBuffer: (path: PathLike, directPath: boolean) => Promise<Buffer>;
    openDialog: (dialogOptions: OpenDialogOptions) => Promise<string>;
    checkDirPath: (path: PathLike) => Promise<boolean>;
    getRandomFileFromDir: (dirPath: PathLike, fileConfig: FileConfig) => Promise<PathLike>;
    checkShowName: (showName: string) => Promise<boolean>;
    getDatabase: () => Promise<LocalTubeDatabase>;
    addShow: (dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string) => Promise<string>;
    deleteShow: (showName: string) => Promise<LocalShow>;
    updateVideoTimePos: (videoPath: PathLike, timePos: number) => void;
    openMpv: (path: PathLike, startTime: number) => void;
    signalMpvTimePosChange: () => void;
    onMpvTimePosChange: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => IpcRenderer;
    onMpvExit: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => IpcRenderer;

    // debug
    getDeserializedShow: (dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string) => Promise<LocalShow>;
}
import { PathLike } from "original-fs";

declare global {
    interface Window {
        localtubeAPI: LocalTubeAPI;
    }
}

export interface LocalTubeAPI {
    readFile: (path: PathLike) => Promise<string>;
}
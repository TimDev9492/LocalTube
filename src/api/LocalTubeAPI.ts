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
}
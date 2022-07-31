import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "../backend/structure";

declare global {
    interface Window {
        localtubeAPI: LocalTubeAPI;
    }
}

export interface LocalTubeAPI {
    getThumbnailBase64: (path: PathLike) => Promise<string>;
    getDatabase: () => Promise<LocalTubeDatabase>;
}
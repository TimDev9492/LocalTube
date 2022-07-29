import { PathLike } from "original-fs";

export interface MainConfig {
    shows: LocalShow[];
    thumbnailDir: PathLike;
}

export interface LocalShow {
    dir: PathLike;
    fileConfig: FileConfig;
    isConventionalShow: boolean;
    content: LocalShowContent | LocalVideo[];
}

export interface LocalShowContent {
    metadata: LocalShowMetadata;
    [season: number]: LocalSeason;
}

export interface LocalSeason {
    [episode: number]: LocalVideo;
}

export interface LocalVideo {
    path: PathLike;
    metadata: LocalVideoMetadata;
}

export interface LocalShowMetadata {
    title: string;
    seasonTotal: number;
    episodeTotal: number;
    totalDuration: number;
    thumbnailPath: PathLike;
}

export interface FileConfig {
    fileExtensions: string[];
    ignoreSubDirs: boolean;
    regExtract: RegExtractConfig;
}

export interface LocalVideoMetadata {
    thumbnailPath: PathLike;
    timePos: number;
    duration: number;
}

export interface RegExtractConfig {
    regex: RegExp;
    matchingGroups: MatchingGroupConfig;
}

export interface MatchingGroupConfig {
    season: number;
    episode: number;
    title: number;
}
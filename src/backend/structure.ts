import { PathLike } from "original-fs";

export interface MainConfig {
    shows: LocalShow[];
}

export interface LocalShow {
    dir: PathLike;
    fileConfig: FileConfig;
    isConventionalShow: boolean;
    content: LocalShowContent | LocalVideo[];
    metadata: LocalShowMetadata;
}

export interface LocalShowContent {
    [season: string]: LocalSeason;
}

export interface LocalSeason {
    [episode: string]: LocalVideo;
}

export interface LocalVideo {
    path: PathLike;
    title: string;
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
    titleReplace?: TitleReplaceConfig;
}

export interface TitleReplaceConfig {
    searchValue: RegExp;
    replaceValue: string;
}

export interface MatchingGroupConfig {
    season: number;
    episode: number;
    title: number;
}
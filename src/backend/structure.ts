import { PathLike } from "original-fs";

interface MainConfig {
    shows: LocalShow[];
    thumbnailDir: PathLike;
}

interface LocalShow {
    dir: PathLike;
    fileConfig: FileConfig;
    isConventionalShow: boolean;
    content: LocalShowContent | LocalVideo[];
}

interface LocalShowContent {
    metadata: LocalShowMetadata;
    [season: number]: LocalSeason;
}

interface LocalSeason {
    [episode: number]: LocalVideo;
}

interface LocalVideo {
    path: PathLike;
    metadata: LocalVideoMetadata;
}

interface LocalShowMetadata {
    title: string;
    seasonTotal: number;
    episodeTotal: number;
    totalDuration: number;
    thumbnailPath: PathLike;
}

interface FileConfig {
    fileExtensions: string[];
    ignoreSubDirs: boolean;
    regExtract: RegExtractConfig;
}

interface LocalVideoMetadata {
    thumbnailPath: PathLike;
    timePos: number;
    duration: number;
}

interface RegExtractConfig {
    regex: RegExp;
    matchingGroups: MatchingGroupConfig;
}

interface MatchingGroupConfig {
    season: number;
    episode: number;
    title: number;
}
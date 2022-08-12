import { PathLike } from "original-fs";
import { FileConfig, LocalSeason, LocalShow, LocalShowContent, LocalShowMetadata, LocalVideo, LocalVideoMetadata } from "./structure";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import { app } from "electron";
import * as child_process from "child_process";
import * as ffmpeg from "fluent-ffmpeg";
import * as commandExists from "command-exists";
import { compareAsNumbers } from "../frontend/utils";

/**
 * A class for serializing objects that are useable by the API
 */
export class ShowDeserializer {

    private constructor() { }

    /**
     * Read a video thumbnail from jpeg as buffer
     * @param absPath {PathLike} The absolute path of the video file
     * @returns A video thumbnail encoded as buffer
     */
    public static getVideoThumbnailBuffer(absPath: PathLike): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            ShowDeserializer.createVideoThubmnailJPEG(absPath).then(
                (thumbnailPath) => fs.readFile(thumbnailPath, (err, data) => {
                    err && reject(err);
                    data && resolve(data);
                }));
        });
    }

    /**
     * Create a video thumbnail
     * @param absPath {PathLike} The absolute path of the video file
     * @returns {PathLike} The path of the generated jpeg thumbnail
     */
    private static createVideoThubmnailJPEG(absPath: PathLike, videoDuration?: number): Promise<PathLike> {
        return new Promise((resolve, reject) => {
            // generate image filename
            let filename = path.basename(absPath.toString()) + '.jpg';

            // create the cache directory for localtube if it doesn't exist
            let cacheDir = path.join(app.getPath('cache'), app.getName());
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

            // build absolute thumbnail path
            let thumbnailPath = path.join(cacheDir, filename);

            // return thumbnail if it is cached
            if (fs.existsSync(thumbnailPath)) {
                resolve(thumbnailPath);
                return;
            }

            // otherwise create a thumbnail

            // check if `ffmpegthumbnailer` is installed on the system
            commandExists.default('ffmpegthumbnailer').then((command) => {
                // store `ffmpegthumbnailer` output in case something goes wrong
                let stderr: string[] = [];
                let stdout: string[] = [];

                // create a thumbnail using `ffmpegthumbnailer` (fast)
                let child = child_process.spawn('ffmpegthumbnailer', ['-i', `"${absPath.toString().replace(/"/g, '\"')}"`, '-c', 'jpg', '-s', '640', '-o', `"${thumbnailPath.replace(/"/g, '\"')}"`], { shell: true });

                child.on('error', (error) => {
                    reject(error);
                });

                child.stderr.on('data', (data) => stderr.push(new Date() + ':' + data));
                child.stdout.on('data', (data) => stdout.push(new Date() + ':' + data));

                child.on('close', (code) => {
                    if (code === 0) resolve(thumbnailPath);
                    else {
                        reject('ffmpegthumbnailer did not run correctly. See console for logs...');

                        console.log('===================[STDOUT]===================');
                        stdout.forEach(line => console.log(line));

                        console.log('===================[STDERR]===================');
                        stderr.forEach(line => console.log(line));

                        console.log('\nINPUT FILE:');
                        console.log(absPath.toString());
                    }
                });
            }).catch(() => {
                // create a thumbnail using bundled ffmpeg (slow)
                let command = ffmpeg.default(absPath.toString()).screenshot({
                    timestamps: [videoDuration ? videoDuration * .1 : 0.0],
                    size: '640x360',
                    folder: cacheDir,
                    filename: filename,
                    fastSeek: true,
                });

                // set a timeout proportional to video duration,
                // at least 10.000ms or 30.000ms if no duration is given
                // let timeout = setTimeout(() => reject('timed out'), Math.min(videoDuration || 30000, 10000));

                command.on('error', () => {
                    reject(`Ffmpeg failed to create thumbnail for ${thumbnailPath}`);
                })

                command.on('end', () => {
                    // clearTimeout(timeout);
                    resolve(thumbnailPath)
                });
            });
        });
    }

    /**
     * Return a deserialized LocalShow object from the file system with a given configuration
     * @param dirPath {PathLike} Path to the root directory of the show
     * @param fileConfig {FileConfig} File configuration for this show
     * @param isConventionalShow {boolean} Whether this show is made up of multiple seasons containing episodes
     * @returns {LocalShow} A deserialized LocalShow object as it is used in the API
     */
    public static async deserializeShow(dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean, showTitle: string): Promise<LocalShow> {
        // instantiate LocalShow object
        let localShow: LocalShow = {
            dir: dirPath,
            fileConfig: fileConfig,
            isConventionalShow: isConventionalShow,
            content: null,
            metadata: null,
        }

        // get list of files
        let videoFiles: VideoFile[] = await ShowDeserializer.getVideoFiles(dirPath, fileConfig);

        if (isConventionalShow) {
            // show is made up of seasons and episodes that are extractable through the file path
            let content: LocalShowContent = {};

            // fallback if episodes can't get detected with regex
            let episodeFallback = 1;

            // loop through each videoFile
            for (const videoFile of videoFiles) {
                // get episode info from regExtract
                let regexMatches = videoFile.relativePath.toString().match(fileConfig.regExtract.regex);

                let season: string;
                let episode: string;
                let title: string;

                if (!regexMatches || !regexMatches.length) {
                    season = '01';
                    episode = (episodeFallback++).toString();
                    title = path.basename(videoFile.relativePath.toString());
                } else {
                    // set season
                    if (fileConfig.regExtract.matchingGroups.season < regexMatches.length)
                        season = regexMatches[fileConfig.regExtract.matchingGroups.season];
                    else
                        season = '01';

                    // set episode
                    if (fileConfig.regExtract.matchingGroups.episode < regexMatches.length)
                        episode = regexMatches[fileConfig.regExtract.matchingGroups.episode];
                    else {
                        while (content[season] && Object.keys(content[season]).map(seasonNo => parseInt(seasonNo) === episodeFallback).includes(true)) episodeFallback++;
                        episode = (episodeFallback).toString();
                    }

                    // set title
                    if (fileConfig.regExtract.matchingGroups.title < regexMatches.length)
                        title = regexMatches[fileConfig.regExtract.matchingGroups.title];
                    else
                        title = path.basename(videoFile.relativePath.toString());
                }

                if (fileConfig.regExtract.titleReplace) title = title.replace(fileConfig.regExtract.titleReplace.searchValue, fileConfig.regExtract.titleReplace.replaceValue);

                if (!content[season]) content[season] = {} as LocalSeason;

                let absPath = path.join(dirPath.toString(), videoFile.relativePath.toString());
                content[season][episode] = {
                    path: absPath,
                    title: title,
                    metadata: await ShowDeserializer.getVideoMetadata(absPath),
                } as LocalVideo;
            }

            let firstSeason: string = Object.keys(content).sort()[0];
            let firstEpisode: string = Object.keys(content[firstSeason]).sort()[0];

            // create metadata for show
            let metadata: LocalShowMetadata = {
                title: showTitle,
                seasonTotal: Object.keys(content).length,
                episodeTotal: Object.keys(content).reduce((prevEpisodeTotal: number, currentSeasonNo: string) => prevEpisodeTotal + Object.keys(content[currentSeasonNo]).length, 0),
                totalDuration: Object.keys(content).reduce((prevTotalDuration: number, currentSeasonNo: string) => prevTotalDuration + Object.keys(content[currentSeasonNo]).reduce((prevEpisodeDuration: number, currentEpisodeNo: string) => prevEpisodeDuration + content[currentSeasonNo][currentEpisodeNo].metadata.duration, 0), 0),
                thumbnailPath: content[firstSeason][firstEpisode].metadata.thumbnailPath,
            };

            localShow.content = content;
            localShow.metadata = metadata;
        } else {
            // show is made up of a bunch of video files without specific context
            let content: LocalVideo[] = [];

            // loop through each videoFile
            for (const videoFile of videoFiles) {
                // get title from regExtract
                let regexMatches = videoFile.relativePath.toString().match(fileConfig.regExtract.regex);
                let title: string;

                // if there is no regex matches, get title from filename
                if (fileConfig.regExtract.matchingGroups.title !== null && fileConfig.regExtract.matchingGroups.title < regexMatches.length) {
                    title = regexMatches[fileConfig.regExtract.matchingGroups.title];
                } else {
                    title = path.basename(videoFile.relativePath.toString());
                }

                if (fileConfig.regExtract.titleReplace) title = title.replace(fileConfig.regExtract.titleReplace.searchValue, fileConfig.regExtract.titleReplace.replaceValue);

                let absPath = path.join(dirPath.toString(), videoFile.relativePath.toString());
                content.push({
                    path: absPath,
                    title: title,
                    metadata: await ShowDeserializer.getVideoMetadata(absPath),
                } as LocalVideo);
            }

            // create metadata for show
            let metadata: LocalShowMetadata = {
                title: showTitle,
                seasonTotal: 0,
                episodeTotal: content.length,
                totalDuration: content.reduce((prevTotalDuration: number, currentVideo: LocalVideo) => prevTotalDuration + currentVideo.metadata.duration, 0),
                thumbnailPath: content[0].metadata.thumbnailPath,
            };

            localShow.content = content;
            localShow.metadata = metadata;
        }

        return localShow;
    }

    /**
     * Return metadata of a video file
     * @param absPath {PathLike} The absolute path of the video file
     * @returns A LocalVideoMetada object
     */
    private static async getVideoMetadata(absPath: PathLike): Promise<LocalVideoMetadata> {
        // get video duration via ffprobe
        let duration = await new Promise<number>((resolve, reject) => {
            ffmpeg.ffprobe(absPath.toString(), (error: any, metadata: any) => {
                if (metadata)
                    resolve(metadata.format.duration);
                else if (error)
                    console.error(error);
            });
        });
        return {
            thumbnailPath: await ShowDeserializer.createVideoThubmnailJPEG(absPath, duration),
            timePos: 0,
            duration: duration,
        } as LocalVideoMetadata;
    }

    /**
     * Return a list of video files that can be processed further
     * @param dirPath {PathLike} Path of the root directory
     * @param fileConfig {FileConfig} The file configuration
     */
    public static async getVideoFiles(dirPath: PathLike, fileConfig: FileConfig): Promise<VideoFile[]> {
        let videoFiles: VideoFile[] = [];

        // create a queue for directories that need to get traversed
        let dirQueue: PathLike[] = ['.'];

        // while there are directories in the queue...
        while (dirQueue.length) {
            let nextQueue: PathLike[] = [];

            // ...loop through each directory in the queue...
            for (const relDirPath of dirQueue) {
                // ...construct path of next directory
                const nextDirPath: string = path.join(dirPath.toString(), relDirPath.toString());

                // ...skip if directory is not readable...
                try {
                    await fsPromises.access(nextDirPath, fs.constants.R_OK);
                } catch (error) {
                    console.error(error);
                    continue;
                }

                // ...get the contents as specified by the FileConfig...
                let dirContents = (await fsPromises.readdir(nextDirPath, { withFileTypes: true })).filter(dirent =>
                    (!fileConfig.ignoreSubDirs && dirent.isDirectory()) ||
                    (!fileConfig.fileExtensions.length || fileConfig.fileExtensions.includes(ShowDeserializer.getFileExtension(dirent.name))));

                // ...push video files to videoFiles array and put directories into next queue...
                for (const dirent of dirContents) {
                    if (dirent.isFile()) {
                        // check if file is a video file
                        let isVideoFile = await new Promise<boolean>((resolve, reject) => {
                            ffmpeg.ffprobe(path.join(dirPath.toString(), relDirPath.toString(), dirent.name).toString(), (error: any, metadata: any) => {
                                if (error) {
                                    resolve(false);
                                    return;
                                }
                                if (metadata) {
                                    resolve(metadata.format.duration && metadata.format.duration !== 'N/A');
                                }
                                resolve(false);
                            });
                        });
                        if (isVideoFile)
                            videoFiles.push({ relativePath: path.join(relDirPath.toString(), dirent.name) } as VideoFile);
                    } else if (dirent.isDirectory()) {
                        // ...skip if directory is not readable...
                        try {
                            await fsPromises.access(nextDirPath, fs.constants.R_OK);

                            // ...otherwise push to next queue...
                            nextQueue.push(path.join(relDirPath.toString(), dirent.name));
                        } catch (error) {
                            console.error(error);
                            continue;
                        }
                    }
                }
            }

            // ...and refill the queue with new directories
            dirQueue = nextQueue;
        }

        return videoFiles;
    }

    /**
     * Return the file extension of a filename
     * @param filename {string} The filename with extension
     * @returns {string} The file extension
     */
    private static getFileExtension(filename: string): string {
        return filename.split('.').pop().toLowerCase();
    }
}

interface VideoFile {
    relativePath: PathLike;
}
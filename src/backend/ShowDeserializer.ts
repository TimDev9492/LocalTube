import { PathLike } from "original-fs";
import { FileConfig, LocalSeason, LocalShow, LocalShowContent, LocalShowMetadata, LocalVideo, LocalVideoMetadata } from "./structure";
import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import * as child_process from "child_process";
import * as ffmpeg from "fluent-ffmpeg";
import * as commandExists from "command-exists";

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
        return new Promise((resolve, reject) =>
            this.createVideoThubmnailJPEG(absPath).then(
                (thumbnailPath) => fs.readFile(thumbnailPath, (err, data) => {
                    err && reject(err);
                    data && resolve(data);
                })),
        );
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
            if (fs.existsSync(thumbnailPath)) resolve(thumbnailPath);

            // otherwise create a thumbnail

            // check if `ffmpegthumbnailer` is installed on the system
            commandExists.default('ffmpegthumbnailer').then((command) => {
                // create a thumbnail using `ffmpegthumbnailer` (fast)
                let child = child_process.spawn('ffmpegthumbnailer', ['-i', `"${absPath.toString().replace(/"/g, '\"')}"`, '-c', 'jpg', '-s', '640', '-o', `"${thumbnailPath.replace(/"/g, '\"')}"`], { shell: true });

                child.on('error', (error) => {
                    reject(error);
                });

                child.on('close', (code) => {
                    if (code === 0) resolve(thumbnailPath);
                    else reject('ffmpegthumbnailer did not run correctly');
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
                // at least 1000ms or 3000ms if no duration is given
                let timeout = setTimeout(() => reject('timed out'), Math.min(videoDuration || 3000, 1000));

                command.on('end', () => {
                    clearTimeout(timeout);
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
        let videoFiles: VideoFile[] = this.getVideoFiles(dirPath, fileConfig);

        if (isConventionalShow) {
            // show is made up of seasons and episodes that are extractable through the file path
            let content: LocalShowContent = {};

            // loop through each videoFile
            for (const videoFile of videoFiles) {
                // get episode info from regExtract
                let regexMatches = videoFile.relativePath.toString().match(fileConfig.regExtract.regex);
                let season: string = regexMatches[fileConfig.regExtract.matchingGroups.season];
                let episode: string = regexMatches[fileConfig.regExtract.matchingGroups.episode];
                let title: string = regexMatches[fileConfig.regExtract.matchingGroups.title];
                if (fileConfig.regExtract.titleReplace) title = title.replace(fileConfig.regExtract.titleReplace.searchValue, fileConfig.regExtract.titleReplace.replaceValue);

                if (!content[season]) content[season] = {} as LocalSeason;

                let absPath = path.join(dirPath.toString(), videoFile.relativePath.toString());
                content[season][episode] = {
                    path: absPath,
                    title: title,
                    metadata: await this.getVideoMetadata(absPath),
                } as LocalVideo;
            }

            // create metadata for show
            let metadata: LocalShowMetadata = {
                title: showTitle,
                seasonTotal: Object.keys(content).length,
                episodeTotal: Object.keys(content).reduce((prevEpisodeTotal: number, currentSeasonNo: string) => prevEpisodeTotal + Object.keys(content[currentSeasonNo]).length, 0),
                totalDuration: Object.keys(content).reduce((prevTotalDuration: number, currentSeasonNo: string) => prevTotalDuration + Object.keys(content[currentSeasonNo]).reduce((prevEpisodeDuration: number, currentEpisodeNo: string) => prevEpisodeDuration + content[currentSeasonNo][currentEpisodeNo].metadata.duration, 0), 0),
                // thumbnailPath: ((content['1'])['1'])?.metadata.thumbnailPath,
                thumbnailPath: '',
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
            thumbnailPath: await this.createVideoThubmnailJPEG(absPath, duration),
            timePos: 0,
            duration: duration,
        } as LocalVideoMetadata;
    }

    /**
     * Return a list of video files that can be processed further
     * @param dirPath {PathLike} Path of the root directory
     * @param fileConfig {FileConfig} The file configuration
     */
    private static getVideoFiles(dirPath: PathLike, fileConfig: FileConfig): VideoFile[] {
        let videoFiles: VideoFile[] = [];

        // create a queue for directories that need to get traversed
        let dirQueue: PathLike[] = ['.'];

        // while there are directories in the queue...
        while (dirQueue.length) {
            let nextQueue: PathLike[] = [];

            // ...loop through each directory in the queue...
            dirQueue.forEach(relDirPath => {

                // ...get the contents as specified by the FileConfig...
                let dirContents = fs.readdirSync(path.join(dirPath.toString(), relDirPath.toString()), { withFileTypes: true }).filter(dirent =>
                    (!fileConfig.ignoreSubDirs && dirent.isDirectory()) ||
                    (!fileConfig.fileExtensions.length || fileConfig.fileExtensions.includes(this.getFileExtension(dirent.name))));

                // ...push video files to videoFiles array and put directories into next queue...
                dirContents.forEach(dirent => dirent.isFile() ?
                    videoFiles.push({ relativePath: path.join(relDirPath.toString(), dirent.name) } as VideoFile) :
                    nextQueue.push(path.join(relDirPath.toString(), dirent.name)));

            });

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
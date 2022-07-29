import { PathLike } from "original-fs";
import { FileConfig, LocalSeason, LocalShow, LocalShowContent, LocalVideo, LocalVideoMetadata } from "./structure";
import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import * as child_process from "child_process";

/**
 * A class for serializing objects that are useable by the API
 */
export class ShowSerializer {

    constructor() {

    }

    /**
     * Creates and returns a video thumbnail in base64
     * @param absPath {PathLike} The absolute path of the video file
     * @returns A video thumbnail encoded in base64
     */
    public getVideoThumbnailBase64(absPath: PathLike): Promise<string> {
        return new Promise((resolve, reject) => {
            // generate image filename
            let filename = path.basename(absPath.toString()) + '.jpg';

            // create the cache directory for localtube if it doesn't exist
            let cacheDir = path.join(app.getPath('cache'), app.getName());
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

            // build absolute thumbnail path
            let thumbnailPath = path.join(cacheDir, filename);

            // return thumbnail if it is cached
            if (fs.existsSync(thumbnailPath)) resolve(fs.readFileSync(thumbnailPath).toString('base64'));

            // otherwise create a thumbnail using `ffmpegthumbnailer`
            let child = child_process.spawn('ffmpegthumbnailer', ['-i', `"${absPath.toString().replace(/"/g, '\"')}"`, '-c', 'jpg', '-s', '640', '-o', `"${thumbnailPath.replace(/"/g, '\"')}"`], { shell: true });

            child.on('error', (error) => {
                reject(error);
            });

            child.on('close', (code) => {
                if (code === 0) resolve(fs.readFileSync(thumbnailPath).toString('base64'));
                else reject('ffmpegthumbnailer did not run correctly');
            });
        });
    }

    /**
     * Returns a serialized LocalShow object from the file system with a given configuration
     * @param dirPath {PathLike} Path to the root directory of the show
     * @param fileConfig {FileConfig} File configuration for this show
     * @param isConventionalShow {boolean} Whether this show is made up of multiple seasons containing episodes
     * @returns {LocalShow} A serialized LocalShow object as it is used in the API
     */
    public serializeShow(dirPath: PathLike, fileConfig: FileConfig, isConventionalShow: boolean): LocalShow {
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
            videoFiles.forEach(videoFile => {
                // get episode info from regExtract
                let regexMatches = videoFile.relativePath.toString().match(fileConfig.regExtract.regex);
                let season: string = regexMatches[fileConfig.regExtract.matchingGroups.season];
                let episode: string = regexMatches[fileConfig.regExtract.matchingGroups.episode];
                let title: string = regexMatches[fileConfig.regExtract.matchingGroups.title];

                if (!content[season]) content[season] = {} as LocalSeason;

                let absPath = path.join(dirPath.toString(), videoFile.relativePath.toString());
                content[season][episode] = {
                    path: absPath,
                    title: title,
                    metadata: this.getVideoMetadata(absPath),
                } as LocalVideo;
            });
        }

        return localShow;
    }

    /**
     * Returns metadata of a video file
     * @param absPath {PathLike} The absolute path of the video file
     * @returns A LocalVideoMetada object
     */
    private getVideoMetadata(absPath: PathLike): LocalVideoMetadata {


        let videoMetadata: LocalVideoMetadata = {
            thumbnailPath: "",
            timePos: 0,
            duration: null,
        };

        return videoMetadata;
    }

    /**
     * Returns a list of video files that can be processed further
     * @param dirPath {PathLike} Path of the root directory
     * @param fileConfig {FileConfig} The file configuration
     */
    private getVideoFiles(dirPath: PathLike, fileConfig: FileConfig): VideoFile[] {
        let videoFiles: VideoFile[] = [];

        // create a queue for directories that need to get traversed
        let dirQueue: PathLike[] = [dirPath];

        // while there are directories in the queue...
        while (dirQueue.length) {
            let nextQueue: PathLike[] = [];

            // ...loop through each directory in the queue...
            dirQueue.forEach(dirPath => {

                // ...get the contents as specified by the FileConfig...
                let dirContents = fs.readdirSync(dirPath, { withFileTypes: true }).filter(dirent =>
                    (!fileConfig.ignoreSubDirs && dirent.isDirectory()) ||
                    (!fileConfig.fileExtensions.length || fileConfig.fileExtensions.includes(this.getFileExtension(dirent.name))));

                // ...push video files to videoFiles array and put directories into next queue...
                dirContents.forEach(dirent => dirent.isFile() ?
                    videoFiles.push({ relativePath: path.join(dirPath.toString(), dirent.name) } as VideoFile) :
                    nextQueue.push(path.join(dirPath.toString(), dirent.name)));

            });

            // ...and refill the queue with new directories
            dirQueue = nextQueue;
        }

        return videoFiles;
    }

    /**
     * Returns the file extension given a filename
     * @param filename {string} The filename with extension
     * @returns {string} The file extension
     */
    private getFileExtension(filename: string): string {
        return filename.split('.').pop().toLowerCase();
    }
}

interface VideoFile {
    relativePath: PathLike;
}
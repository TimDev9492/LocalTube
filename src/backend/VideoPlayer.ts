import { PathLike } from 'original-fs';
import { WebContents } from 'electron';
import luaScript from '../../assets/localtube-timepos.lua';
import * as child_process from 'child_process';
import { DatabaseManager } from './DatabaseManager';
import * as pathMod from 'path';

/**
 * A class that manages launching and communicating with the video player
 */
export class VideoPlayer {

    private static webListeners: WebContents[];

    private constructor() { }

    /**
     * Initialize variables
     */
    public static setupMpv() {
        VideoPlayer.webListeners = [];
    }

    /**
     * Register a WebContents object to listen changes in timepos of mpv
     * @param webContents {WebContents} The WebContents object to send event changes to
     */
    public static addWebContentsListener(webContents: WebContents) {
        VideoPlayer.webListeners.push(webContents);
    }

    /**
     * Open MPV and play the specified video file
     * @param path {PathLike} The absolute path of the video file
     * @returns A boolean that tells if the player started successfully
     */
    public static openMpv(path: PathLike, startTime: number): void {
        const execName = process.platform === 'win32' ? 'mpv.exe' : 'mpv';

        let luaPath = pathMod.join(__dirname, luaScript);
        let args = [path.toString(), `--script=${luaPath}`, `--start=${startTime}`];
        let child = child_process.spawn(execName, args);

        // You can also use a variable to save the output for when the script closes later
        child.on('error', (error) => {
            // print errors to the console
            console.error(error);
        });

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => {
            // stdout
            console.log('stdout', data);

            // extract timepos update information from stdout
            if (data.startsWith('[localtube_timepos] ')) {
                let timeposStr = data.replace('[localtube_timepos] ', '');
                let timepos = parseFloat(timeposStr);
                if (timepos === null || Number.isNaN(timepos)) return;
                VideoPlayer.webListeners.forEach(webContents => webContents.send('mpv:update-timepos', timepos, path));
                DatabaseManager.updateVideoTimePos(path, timepos);
            }
        });

        child.stderr.on('data', (data) => {
            // stderr
            console.log('stderr', data.toString());
        })

        child.on('close', (code) => {
            // notify WebListeners that mpv exited
            VideoPlayer.webListeners.forEach(webContents => webContents.send('mpv:exit'));

            // save the database to disk
            DatabaseManager.saveDatabase();
        });
    }

}
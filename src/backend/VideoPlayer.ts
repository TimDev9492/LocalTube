import { PathLike } from "original-fs";
import { webContents, WebContents } from "electron";
import luaScript from '../../assets/localtube-timepos.lua';
import * as child_process from 'child_process';

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
    public static openMpv(path: PathLike): void {
        let child = child_process.spawn('mpv', [path.toString(), `--script=${luaScript}`]);

        // You can also use a variable to save the output for when the script closes later
        child.on('error', (error) => {
            console.error(error);
        });

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => {
            // stdout
            if (data.startsWith('[localtube_timepos] ')) {
                let timepos = parseFloat(data.replace('[localtube_timepos] ', ''));
                timepos && VideoPlayer.webListeners.forEach(webContents => webContents.send('mpv:update-timepos', timepos, path));
            }
            // console.log(data);
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (data) => {
            // sterr
        });

        child.on('close', (code) => {
            // Here you can get the exit code of the script  
            console.log('MPV finished with exit code ' + code);
            VideoPlayer.webListeners.forEach(webContents => webContents.send('mpv:exit'));
        });
    }

}
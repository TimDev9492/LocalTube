import { PathLike } from "original-fs";
import { LocalShow, LocalShowContent, LocalTubeDatabase, LocalVideo } from "./structure"
import * as fs from "fs";
import * as path from "path";

/**
 * A class for managing the LocalTube database
 */
export class DatabaseManager {

    private static databasePath: PathLike;
    private static database: LocalTubeDatabase;
    private static videoLookup: { [videoPath: string]: SeasonEpisodeInfo | LocalVideoIndex };

    /**
     * Private inaccessible constructor to prevent instantiating objects of this class
     */
    private constructor() { }

    /**
     * Set the path to the database file to operate on
     * @param path {PathLike} Absolute file path of the database
     */
    public static setDatabasePath(path: PathLike) {
        DatabaseManager.databasePath = path;
        DatabaseManager.videoLookup = {};
    }

    /**
     * Create a new database file if absent, otherwise
     * load the contents of the database file into memory
     */
    public static loadDatabase() {
        // check if path is set
        if (!DatabaseManager.databasePath) throw new Error('Database path not set. Set the path using `DatabaseManager.setDatabasePath(path: PathLike)`');

        // check if database file exists
        if (!fs.existsSync(DatabaseManager.databasePath)) {
            // file does not exist

            // create database directory
            fs.mkdirSync(path.dirname(DatabaseManager.databasePath.toString()), { recursive: true });

            // instantiate empty database object
            DatabaseManager.database = { shows: [] } as LocalTubeDatabase;
        } else {
            // file does exist

            // read file into JSON object
            DatabaseManager.database = JSON.parse(fs.readFileSync(DatabaseManager.databasePath).toString());

            // parse regex strings to regular expressions
            DatabaseManager.database.shows.forEach(show => {
                if (show.fileConfig && show.fileConfig.regExtract && show.fileConfig.regExtract.regex) {
                    let parts = show.fileConfig.regExtract.regex.toString().split(/(?<!\\)\//);
                    if (parts.length > 2)
                        show.fileConfig.regExtract.regex = new RegExp(parts[1], parts[2]);
                }
                if (show.fileConfig && show.fileConfig.regExtract && show.fileConfig.regExtract.titleReplace && show.fileConfig.regExtract.titleReplace.searchValue) {
                    let parts = show.fileConfig.regExtract.titleReplace.searchValue.toString().split(/(?<!\\)\//);
                    if (parts.length > 2)
                        show.fileConfig.regExtract.titleReplace.searchValue = new RegExp(parts[1], parts[2]);
                }
            });
        }
    }

    /**
     * Write the current database object to disk
     */
    public static saveDatabase() {
        // check if path is set
        if (!DatabaseManager.databasePath) throw new Error('Database path not set. Set the path using `DatabaseManager.setDatabasePath(path: PathLike)`');

        // write serialized JSON object to disk
        fs.writeFileSync(DatabaseManager.databasePath, JSON.stringify(DatabaseManager.database, (key, value) => value instanceof RegExp ? value.toString() : value));
    }

    /**
     * Get the database object
     * @returns {LocalTubeDatabase} The loaded database object
     */
    public static getDatabase(): LocalTubeDatabase {
        return DatabaseManager.database;
    }

    /**
     * Store a new timepos for a video file in the database
     * @param videoPath {PathLike} The absolute path of the video file
     * @param timePos The new timepos
     */
    public static updateVideoTimePos(videoPath: PathLike, timePos: number) {
        let ri: SeasonEpisodeInfo | LocalVideoIndex = null;
        if (Object.keys(DatabaseManager.videoLookup).includes(videoPath.toString())) {
            ri = DatabaseManager.videoLookup[videoPath.toString()];
        } else {
            ri = DatabaseManager.getLocalVideoRI(videoPath);
        }
        if (ri === null) return;
        if ('index' in ri) {
            // resource identifier is of type LocalVideoIndex
            (DatabaseManager.database.shows[ri.showIndex].content as LocalVideo[])[ri.index].metadata.timePos = timePos;
        } else {
            // resource identifier is of type SeasonEpisodeInfo
            (DatabaseManager.database.shows[ri.showIndex].content as LocalShowContent)[ri.season][ri.episode].metadata.timePos = timePos;
        }
    }

    /**
     * Retrieve a LocalVideo resource identifier from the database with the specified file path
     * @param videoPath {PathLike} The absolute path of the video file
     * @returns {SeasonEpisodeInfo | LocalVideoIndex} A LocalVideo Resource Identifier
     */
    private static getLocalVideoRI(videoPath: PathLike): SeasonEpisodeInfo | LocalVideoIndex {
        for (let i = 0; i < DatabaseManager.database.shows.length; i++) {
            let show = DatabaseManager.database.shows[i];
            if (show.isConventionalShow) {
                for (const seasonNo of Object.keys(show.content as LocalShowContent)) {
                    for (const episodeNo of Object.keys((show.content as LocalShowContent)[seasonNo])) {
                        if ((show.content as LocalShowContent)[seasonNo][episodeNo].path === videoPath) {
                            return { showIndex: i, season: seasonNo, episode: episodeNo } as SeasonEpisodeInfo;
                        }
                    }
                }
            } else {
                for (let j = 0; j < show.content.length; j++) {
                    if ((show.content as LocalVideo[])[j].path === videoPath) return { showIndex: i, index: j } as LocalVideoIndex;
                }
            }
        }
        return null;
    }

}

interface SeasonEpisodeInfo {
    showIndex: number;
    season: string;
    episode: string;
}

interface LocalVideoIndex {
    showIndex: number;
    index: number;
}
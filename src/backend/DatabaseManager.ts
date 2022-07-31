import { PathLike } from "original-fs";
import { LocalTubeDatabase } from "./structure"
import * as fs from "fs";
import * as path from "path";

/**
 * A class for managing the LocalTube database
 */
export class DatabaseManager {

    private static databasePath: PathLike;
    private static database: LocalTubeDatabase;

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
        }
    }

    /**
     * Write the current database object to disk
     */
    public static saveDatabase() {
        // check if path is set
        if (!DatabaseManager.databasePath) throw new Error('Database path not set. Set the path using `DatabaseManager.setDatabasePath(path: PathLike)`');
        
        // write serialized JSON object to disk
        fs.writeFileSync(DatabaseManager.databasePath, JSON.stringify(DatabaseManager.database));
    }

    /**
     * Get the database object
     * @returns {LocalTubeDatabase} The loaded database object
     */
    public static getDatabase(): LocalTubeDatabase {
        return DatabaseManager.database;
    }

}
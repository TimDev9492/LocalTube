import { PathLike } from "original-fs";
import { MainConfig } from "./structure"
import * as fs from "fs";
import * as path from "path";

/**
 * A class for managing the LocalTube config
 */
class ConfigManager {

    private configPath: PathLike;
    private config: MainConfig;

    /**
     * Instantiate a config manager that manages the config at a given location
     * @param configPath {string} The path to the localtube.conf.json file
     */
    constructor(configPath: PathLike) {
        this.configPath = configPath;
    }

    /**
     * Create a new config if absent, othewise
     * load the contents of the config file into memory
     */
    loadConfig() {
        // check if config file exists
        if (!fs.existsSync(this.configPath)) {
            // file does not exist
            
            // create config directory
            fs.mkdirSync(path.dirname(this.configPath.toString()), { recursive: true });
            
            // instantiate empty config object
            this.config = { shows: [] } as MainConfig;
        } else {
            // file does exist

            // read file into JSON object
            this.config = JSON.parse(fs.readFileSync(this.configPath).toString());
        }
    }

    /**
     * Get the config object
     * @returns {MainConfig} The loaded config object
     */
    public getConfig(): MainConfig {
        return this.config;
    }

}
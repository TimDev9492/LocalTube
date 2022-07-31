import { PathLike } from "original-fs";
import { MainConfig } from "./structure"
import * as fs from "fs";
import * as path from "path";

/**
 * A class for managing the LocalTube config
 */
export class ConfigManager {

    private static configPath: PathLike;
    private static config: MainConfig;

    /**
     * Instantiate a config manager that manages the config at a given location
     * @param configPath {string} The path to the localtube.conf.json file
     */
    private constructor() { }

    /**
     * Set the path to the config to operate on
     * @param path {PathLike} Absolute file path of the config
     */
    public static setConfigPath(path: PathLike) {
        ConfigManager.configPath = path;
    }

    /**
     * Create a new config if absent, othewise
     * load the contents of the config file into memory
     */
    public static loadConfig() {
        // check if path is set
        if (!ConfigManager.configPath) throw new Error('Config path not set. Set the path using `ConfigManager.setConfigPath(path: PathLike)`');

        // check if config file exists
        if (!fs.existsSync(ConfigManager.configPath)) {
            // file does not exist

            // create config directory
            fs.mkdirSync(path.dirname(ConfigManager.configPath.toString()), { recursive: true });

            // instantiate empty config object
            ConfigManager.config = { shows: [] } as MainConfig;
        } else {
            // file does exist

            // read file into JSON object
            ConfigManager.config = JSON.parse(fs.readFileSync(ConfigManager.configPath).toString());
        }
    }

    /**
     * Write the current config object to disk
     */
    public static saveConfig() {
        // check if path is set
        if (!ConfigManager.configPath) throw new Error('Config path not set. Set the path using `ConfigManager.setConfigPath(path: PathLike)`');
        
        // write serialized JSON object to disk
        fs.writeFileSync(ConfigManager.configPath, JSON.stringify(ConfigManager.config));
    }

    /**
     * Get the config object
     * @returns {MainConfig} The loaded config object
     */
    public static getConfig(): MainConfig {
        return ConfigManager.config;
    }

}
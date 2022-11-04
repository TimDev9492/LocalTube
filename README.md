LocalTube
==

<img src="./assets/localtube_icon.png" alt="logo" style="width: 256px;" />

A cross-platform desktop application that simplifies watching your favorite movies and/or shows stored on your local drive with [mpv](https://mpv.io), built with [Electron](https://github.com/electron/electron).

LocalTube lets you organize your local video files into shows. You can configure LocalTube to extract info about a video from its file path (eg. episode, season and episode title). On top of that, it stores your video timestamps, so you can easily continue watching where you left of previously.

## Installation

You can find prebuilt binaries under [releases](https://github.com/TimDev9492/LocalTube/releases).

### Linux

There are specific binaries for distributions based on Debian (`.deb`), as well as RedHat (`.rpm`).

Alternatively, the AppImage should run on almost every Linux distribution.

Download the AppImage and run it using
```sh
./path/to/downloaded.AppImage
```

### Windows

Download the and run the `setup.exe` file.

### MacOS

There is a `.dmg` binary available for download (⚠ Hasn't been tested yet).

## ⚠ Requirements

You need to have [mpv](https://mpv.io) installed on your system (and added to your PATH) as its the video player that LocalTube uses to launch your videos.

[ffmpegthumbnailer](https://github.com/dirkvdb/ffmpegthumbnailer) is recommended for faster video thumbnail generation, but not required.

## Platform support

LocalTube was built and tested on Linux. It does however also run on Windows, as well as on MacOS, but I haven't tested on any of those operating systems so far.

### Building from source

```sh
git clone https://github.com/TimDev9492/LocalTube.git   # clone github repository
cd LocalTube/
npm install                                             # install dependecies
npm run make                                            # build binaries
```

If you want to build a specific target application type (for example AppImage only), you can edit the `.config.forge.makers` section in the  `package.json` file ([instructions](https://www.electronforge.io/config/makers)) or run one of the following commands:
```sh
npm run make-appimage   # build AppImage
npm run make-deb        # build for Debian-based linux distributions
npm run make-rpm        # build RedHat-based linux distributions
npm run make-dmg        # build for MacOS
npm run make-win        # build for Windows
```

## Contributing

If you want to report bugs or suggest changes or new features, feel free to [open an issue](https://github.com/TimDev9492/LocalTube/issues/new).

If you want to fix issues and contribute directly to the code base, feel free to [create a new pull request](https://github.com/TimDev9492/LocalTube/pulls).

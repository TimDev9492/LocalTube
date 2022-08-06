LocalTube
==

![icon](./assets/localtube_icon.png)

A cross-platform desktop application that simplifies watching your favorite movies and/or shows stored on your local drive with [mpv](https://mpv.io), built with [Electron](https://github.com/electron/electron).

LocalTube lets you organize your local video files into shows. You can configure LocalTube to extract info about a video from its file path (eg. episode, season and episode title). On top of that, it stores your video timestamps, so you can easily continue watching where you left of previously.

## Installation

You can find prebuilt binaries under [releases](https://github.com/TimDev9492/LocalTube/releases).

### Linux

Download the AppImage and run it using
```sh
./path/to/downloaded.AppImage
```

### Windows / MacOS

Not yet availabe.

### ⚠ Requirements

You need to have [mpv](https://mpv.io) installed on your system as its the video player that LocalTube uses to launch your videos.

[ffmpegthumbnailer](https://github.com/dirkvdb/ffmpegthumbnailer) is recommended for faster video thumbnail generation, but not required.

## Platform support

LocalTube was built and tested on Linux. It should run fine on Windows, as well as on MacOS, but I haven't built the application for any of those operating systems, neither have I tested on any of them so far.

Prebuilt binaries for Windows are planned for the near future...

### Building from source

```sh
git clone https://github.com/TimDev9492/LocalTube.git   # clone github repository
cd LocalTube/
npm install                                             # install dependecies
npm run make                                            # build binaries
```

## Contributing

If you want to report bugs or suggest changes or new features, feel free to [open an issue](https://github.com/TimDev9492/LocalTube/issues/new).

If you want to fix issues and contribute directly to the code base, feel free to [create a new pull request](https://github.com/TimDev9492/LocalTube/pulls).

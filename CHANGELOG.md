# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.1](https://github.com/TimDev9492/LocalTube/compare/v1.1.0...v1.1.1) (2022-08-08)

## [1.1.0](https://github.com/TimDev9492/LocalTube/compare/v1.0.0...v1.1.0) (2022-08-08)


### ⚠ BREAKING CHANGES

* add README.md

### Features

* **workflow:** implement github workflow to build and release application binaries ([b586cc6](https://github.com/TimDev9492/LocalTube/commit/b586cc65108b98ba3f2b67b13aef71cc89d4086b))


### Bug Fixes

* **backend:** resolve path of lua script correctly ([df04504](https://github.com/TimDev9492/LocalTube/commit/df04504c72d722943aff56020e08a27f6a2adee7)), closes [#1](https://github.com/TimDev9492/LocalTube/issues/1)


* add README.md ([59157e7](https://github.com/TimDev9492/LocalTube/commit/59157e7c4426dc77dc14360ddbce93dc13a22a88))

## [1.0.0](https://github.com/TimDev9492/LocalTube/compare/v0.1.0...v1.0.0) (2022-08-06)


### ⚠ BREAKING CHANGES

* connect add show gui to database

### Features

* **api:** add route to delete show ([eedfbb7](https://github.com/TimDev9492/LocalTube/commit/eedfbb72acff378a3f97e1f5c516ec94188c8075))
* connect add show gui to database ([fbce7ca](https://github.com/TimDev9492/LocalTube/commit/fbce7ca2836617baa7d6a5cc63e514774fe2a071))
* finish show adding functionality ([b667f41](https://github.com/TimDev9492/LocalTube/commit/b667f41a154630af5f808687552255329267af4e))
* **frontend:** add ability to switch between shows ([d4b4a30](https://github.com/TimDev9492/LocalTube/commit/d4b4a30cc1048789079a6c2df27aa61ee5925412))
* **frontend:** add empty home page ([3097955](https://github.com/TimDev9492/LocalTube/commit/30979553511a745cc31176103d2bd9164948f408))
* **frontend:** add gui components to delete show ([9804fae](https://github.com/TimDev9492/LocalTube/commit/9804faeb7140d29359a7d8ce4d4883543210a415))
* **frontend:** add home tab ([f89de06](https://github.com/TimDev9492/LocalTube/commit/f89de067db7e5e87d655df1a292209f08d7afec8))
* **frontend:** add JetBrains Mono font ([58f352f](https://github.com/TimDev9492/LocalTube/commit/58f352fb517c63c38738b2ac455e0d7bff3fb903))
* **frontend:** extend add show tab ([ada2bc2](https://github.com/TimDev9492/LocalTube/commit/ada2bc28bf6ad81c9b5329f6234d4a1713978e91))


### Bug Fixes

* **backend:** fix ffmpeg/ffprobe binary not shipping with executable file permissions ([e869a12](https://github.com/TimDev9492/LocalTube/commit/e869a12495b7a5e1e36251daad5b6edfea8f3be8))
* **backend:** fix serialization and deserialization of regex objects in database ([95935ea](https://github.com/TimDev9492/LocalTube/commit/95935ea641ffed327d43d06de8caab81b5946a48))
* **backend:** fix serialization and deserialization of RegExp objects ([71b2554](https://github.com/TimDev9492/LocalTube/commit/71b25544b14c99489ca5c8ec42cfe984ee13d824))
* **backend:** fix serialization of regex ([f1ab4d4](https://github.com/TimDev9492/LocalTube/commit/f1ab4d4f8e22d88a655bff36d6fd04a7aef5c903))
* **backend:** guarantee a unique show name ([ee36485](https://github.com/TimDev9492/LocalTube/commit/ee364851ae23e8def3c696b44d21cd4e6dc635be))
* write to database when adding/removing show ([c8cddeb](https://github.com/TimDev9492/LocalTube/commit/c8cddebc1ccc0bfe685c50f15d7ad8933c989e93))

## [0.1.0](https://github.com/TimDev9492/LocalTube/compare/v0.0.2...v0.1.0) (2022-08-02)


### ⚠ BREAKING CHANGES

* **frontend:** add communication and video playback with mpv
* **backend:** implement show serialization + bundle ffmpeg and ffprobe binaries
* **backend:** implement serializer for local shows
* **api:** add api data structure and communication bridges
* **dev:** change version back to 0.0.1
* **backend:** add data structures

### Features

* **api:** add api data structure and communication bridges ([14b71b4](https://github.com/TimDev9492/LocalTube/commit/14b71b46f90243d80ce6ea19ff1a7a3db5b9f22a))
* **api:** add api route to get database state ([e8b5574](https://github.com/TimDev9492/LocalTube/commit/e8b557484db8936f7ef18b7019df86c219608204))
* **api:** update and implement api ([d2bd414](https://github.com/TimDev9492/LocalTube/commit/d2bd414aa9e4d87bc9dc719b1e7b1c2b405c8107))
* **backend:** add config option to mutate show title from filename ([0081f2f](https://github.com/TimDev9492/LocalTube/commit/0081f2f7aed118b890a2f405911e83d236610e4b))
* **backend:** add data structures ([8493383](https://github.com/TimDev9492/LocalTube/commit/849338366374d543b508e855055ac10f7e9e5d09))
* **backend:** implement serializer for local shows ([ce28987](https://github.com/TimDev9492/LocalTube/commit/ce28987d2781734580aff7481c1909036d0112bf))
* **backend:** implement show serialization + bundle ffmpeg and ffprobe binaries ([4c11d84](https://github.com/TimDev9492/LocalTube/commit/4c11d84cc76d57ceaed38d316c91d383ce90da2f))
* **dev:** add breaking change option to commit.sh ([d3909a4](https://github.com/TimDev9492/LocalTube/commit/d3909a4dc585d4cb3dde49cb8668ea0663ec7afa))
* **frontend:** add communication and video playback with mpv ([aa6eb2b](https://github.com/TimDev9492/LocalTube/commit/aa6eb2b9b3c7538da39f37ce14814fbfb643f9b9))
* **frontend:** display videos loaded from database.json in ui ([2dcabc2](https://github.com/TimDev9492/LocalTube/commit/2dcabc2a9a2c6fe0a97cca3e8181e5ec1ca616f4))
* **gui:** add spinner component ([650bb13](https://github.com/TimDev9492/LocalTube/commit/650bb139873b10a0a57c4572ca9a0be281b3886e))
* **gui:** build and style video card ([3e50243](https://github.com/TimDev9492/LocalTube/commit/3e50243a4a1c4132439a143425e0dd7a3bb7172f))
* **gui:** initialize video card component ([3787c44](https://github.com/TimDev9492/LocalTube/commit/3787c442da4c5c46085dad1ff863d253c2a954ab))


### Bug Fixes

* **api:** add getDatabase route to LocalTubeAPI interface ([c6f8afc](https://github.com/TimDev9492/LocalTube/commit/c6f8afc0e9253a2187311462dc4480a444b8a3e1))
* **backend:** make ConfigManager accessible to every component ([4df22fb](https://github.com/TimDev9492/LocalTube/commit/4df22fbb773e732e0c1d3e8bcfc1e5e967c3cb40))
* **dev:** change ffmpeg-installer version to custom node package to fix build issue ([96635e4](https://github.com/TimDev9492/LocalTube/commit/96635e41d859597abecc7862939ff7ae3a6c7033))
* **dev:** fix build issues ([a4b170a](https://github.com/TimDev9492/LocalTube/commit/a4b170ae774fd7ef21fea6b72edae8313181f9e8))
* **frontend:** fix mpv playback options ([9b646a8](https://github.com/TimDev9492/LocalTube/commit/9b646a861b52c4697ea159a1a3c8ee453c236a20))
* **frontend:** fix show accordion blocking ui thread when loading ([78acc3c](https://github.com/TimDev9492/LocalTube/commit/78acc3c31605993876c009ed83ba615e2320d6bf))
* **frontend:** load base64 image data on worker thread ([2e5e26a](https://github.com/TimDev9492/LocalTube/commit/2e5e26a08baecb3aee7d979cb3d3aa36c6aa4e23))
* **gui:** fix accordion animations ([fe352a1](https://github.com/TimDev9492/LocalTube/commit/fe352a10e6371a8582ddf0807786b4cd164d9a24))


### revert

* **dev:** change version back to 0.0.1 ([4625894](https://github.com/TimDev9492/LocalTube/commit/46258941d6486795fa5d729fb211d85c8a23e245))

### 0.0.1 (2022-07-29)


### Features

* **dev:** add commit script to implement conventional commits ([358b853](https://github.com/TimDev9492/LocalTube/commit/358b853cd967b523c1d1eae40065a6a67320c893))
* **dev:** add tailwindcss ([a0f5305](https://github.com/TimDev9492/LocalTube/commit/a0f5305a1e7dcd0fc369034411ede05cc57a2403))
* **dev:** initialize project using this guide [https://www.electronforge.io/guides/framework-integration/react-with-typescript] ([545507c](https://github.com/TimDev9492/LocalTube/commit/545507c6aba371e75c87a6ae3aaa026b773b6cf3))
* **dev:** setup deployment functionality ([34222fe](https://github.com/TimDev9492/LocalTube/commit/34222fed5549f0b4802f60c372fd02d801c687d6))
* **gui:** add basic design and code structure ([9cabfc7](https://github.com/TimDev9492/LocalTube/commit/9cabfc7e14d206153e5a5465c3762197bb010ed5))


### Bug Fixes

* **gui:** fix accordion in PageContent component ([6f7360b](https://github.com/TimDev9492/LocalTube/commit/6f7360bee2a93d31bc5b067252e7a551012cabbc))

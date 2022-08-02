import * as React from 'react';
import { LocalVideo } from '../../backend/structure';
import placeholder from '../../../assets/placeholder.png';
import converter from '../../backend/workers/convert';
import { PathLike } from 'original-fs';
import { IpcRendererEvent } from 'electron';
import settings from '../../settings';

export function VideoCard({ gridCol, video, episodeNo, activeVideoPath, setActiveVideoByPath }: { gridCol: number, video: LocalVideo, episodeNo: string | number, activeVideoPath: PathLike, setActiveVideoByPath: Function }): JSX.Element {
    const [base64data, setBase64data] = React.useState<string>(null);
    const date: Date = new Date(0);
    date.setSeconds(video.metadata.duration); // specify value for SECONDS here
    const offset: number = Math.floor(video.metadata.duration / 3600) === 0 ? 3 : 0;
    const timeString: string = date.toISOString().substr(11 + offset, 8 - offset);
    let [percentage, setPercentage] = React.useState<number>(Math.round(100 * video.metadata.timePos / video.metadata.duration));
    let [timePos, setTimePos] = React.useState<number>(video.metadata.timePos);

    const onVideoClick = () => {
        // don't do anything if mpv is already playing
        if (activeVideoPath) return;

        // set startTime equal to time where you left off and rewind NEG_RESUME_OFFSET seconds
        let startTime = Math.max(timePos - settings.NEG_RESUME_OFFSET, 0);

        // if time left till end is smaller than END_TIME_TRESHOLD, start at the beginning
        if (video.metadata.duration - timePos <= settings.END_TIME_THRESHOLD) startTime = 0;

        // launch MPV
        window.localtubeAPI.openMpv(video.path, startTime);

        // set active playing video
        setActiveVideoByPath(video.path);
    }

    React.useEffect(() => {
        window.localtubeAPI.onMpvTimePosChange((_event: IpcRendererEvent, timePos: number, videoPath: PathLike) => {
            if (videoPath === video.path) {
                setTimePos(timePos);
                setPercentage(Math.round(100 * timePos / video.metadata.duration));
            }
        });

        window.localtubeAPI.getThumbnailBuffer(video.path).then(
            (bufferData) => converter.getAsBase64(bufferData).then(
                (base64) => setBase64data(base64),
                (error) => console.error(error)
            ),
            (error) => console.error(error)
        );
    }, []);

    return <div className="hover:scale-105 transition-transform active:scale-100 select-none overflow-hidden shadow-lg rounded-lg cursor-pointer" style={{ gridColumnStart: gridCol }} onClick={onVideoClick}>
        <div className="w-full h-full cursor-pointer flex flex-col">
            <div className="w-full object-cover relative">
                <img alt="video thumbnail" src={base64data ? `data:image/jpg;base64,${base64data}` : placeholder} draggable="false" className="aspect-video w-full" />
                <div>
                    <div className="w-full h-2 bg-gray-400">
                        <div className="h-full bg-red-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                {video.path === activeVideoPath && <div className="w-full h-full bg-white opacity-20 absolute top-0 left-0">
                    <svg role="add" className="w-48 h-48 dark:fill-black opacity-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        viewBox="0 0 20 20" fill="none">
                        <path d="M9.0971295,8.03755188 L9.0971295,2.84790039 C9.13471211,2.50546265 9.32401021,2.28468831 9.6650238,2.18557739 C10.0060374,2.08646647 10.3434812,2.17325872 10.6773552,2.44595413 L18.762796,9.28367933 C18.985685,9.48122766 19.0971295,9.72000122 19.0971295,10 C19.0971295,10.2799988 18.985685,10.5192994 18.762796,10.717902 L10.6237488,17.6020203 C10.2899882,17.8323466 9.96312968,17.9007416 9.64317322,17.8072052 C9.32321676,17.7136688 9.14120218,17.5091349 9.0971295,17.1936035 L9.0971295,11.9564819 L2.48309625,17.5543198 C2.15246682,17.8183996 1.80385844,17.9026947 1.43727112,17.8072052 C1.0706838,17.7117157 0.892550258,17.5071818 0.902870501,17.1936035 L0.902870501,2.93100117 C0.89243836,2.60200039 1.04287211,2.36458333 1.35417175,2.21875 C1.66547139,2.07291667 2.0218455,2.13023885 2.42329407,2.39071655 L9.0971295,8.03755188 Z" />
                    </svg>
                </div>}
            </div>
            <div className="bg-white dark:bg-slate-800 w-full p-4 flex flex-col justify-between flex-1">
                <div>
                    <p className="text-indigo-500 text-md font-medium">
                        #{episodeNo}
                    </p>
                    <p className="text-slate-800 dark:text-white text-xl font-medium mb-2">
                        {video.title}
                    </p>
                </div>
                <div className="flex flex-wrap justify-starts items-center mt-4">
                    <div className="flex items-center text-slate-200  px-2.5 py-1.5 text-sm font-medium dark:bg-indigo-600 rounded-full mr-2">
                        <svg role="add" className="inline h-4 w-4 mr-2 dark:fill-slate-200"
                            viewBox="0 0 466.008 466.008" fill="none">
                            <path d="M233.004,0C104.224,0,0,104.212,0,233.004c0,128.781,104.212,233.004,233.004,233.004
			c128.782,0,233.004-104.212,233.004-233.004C466.008,104.222,361.796,0,233.004,0z M244.484,242.659l-63.512,75.511
			c-5.333,6.34-14.797,7.156-21.135,1.824c-6.34-5.333-7.157-14.795-1.824-21.135l59.991-71.325V58.028c0-8.284,6.716-15,15-15
			s15,6.716,15,15v174.976h0C248.004,236.536,246.757,239.956,244.484,242.659z"/>
                        </svg>
                        {timeString}
                    </div>
                    {percentage !== 0 && <div className="flex items-center text-slate-200  px-2.5 py-1.5 text-sm font-medium dark:bg-red-500 rounded-full">
                        <svg role="add" className="inline h-4 w-4 mr-1 dark:fill-slate-200"
                            viewBox="0 0 20 20" fill="none">
                            <path d="M9.0971295,8.03755188 L9.0971295,2.84790039 C9.13471211,2.50546265 9.32401021,2.28468831 9.6650238,2.18557739 C10.0060374,2.08646647 10.3434812,2.17325872 10.6773552,2.44595413 L18.762796,9.28367933 C18.985685,9.48122766 19.0971295,9.72000122 19.0971295,10 C19.0971295,10.2799988 18.985685,10.5192994 18.762796,10.717902 L10.6237488,17.6020203 C10.2899882,17.8323466 9.96312968,17.9007416 9.64317322,17.8072052 C9.32321676,17.7136688 9.14120218,17.5091349 9.0971295,17.1936035 L9.0971295,11.9564819 L2.48309625,17.5543198 C2.15246682,17.8183996 1.80385844,17.9026947 1.43727112,17.8072052 C1.0706838,17.7117157 0.892550258,17.5071818 0.902870501,17.1936035 L0.902870501,2.93100117 C0.89243836,2.60200039 1.04287211,2.36458333 1.35417175,2.21875 C1.66547139,2.07291667 2.0218455,2.13023885 2.42329407,2.39071655 L9.0971295,8.03755188 Z" />
                        </svg>
                        {`${percentage}%`}
                    </div>}
                </div>
            </div>
        </div>
    </div>
}
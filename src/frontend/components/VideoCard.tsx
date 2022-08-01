import * as React from 'react';
import { LocalVideo } from '../../backend/structure';
import placeholder from '../../../assets/placeholder.png';
import converter from '../../backend/workers/convert';

export function VideoCard({ gridCol, video, episodeNo }: { gridCol: number, video: LocalVideo, episodeNo: string | number }): JSX.Element {
    const [base64data, setBase64data] = React.useState<string>(null);

    React.useEffect(() => {
        window.localtubeAPI.getThumbnailBuffer(video.path).then(
            (bufferData) => converter.getAsBase64(bufferData).then(
                (base64) => setBase64data(base64),
                (error) => console.error(error)
            ),
            (error) => console.error(error)
        );
    }, []);

    return <div className="overflow-hidden shadow-lg rounded-lg h-90 cursor-pointer" style={{ gridColumnStart: gridCol }}>
        <div className="w-full block h-full cursor-pointer">
            <img alt="video thumbnail" src={base64data ? `data:image/jpg;base64,${base64data}` : placeholder} className="aspect-video w-full object-cover" />
            <div className="bg-white dark:bg-slate-800 w-full p-4">
                <p className="text-indigo-500 text-md font-medium">
                    #{episodeNo}
                </p>
                <p className="text-slate-800 dark:text-white text-xl font-medium mb-2">
                    {video.title}
                </p>
                <div className="flex flex-wrap justify-starts items-center mt-4">
                    <div className="text-xs mr-2 py-1.5 px-4 text-slate-600 bg-blue-100 rounded-2xl">
                        #Car
                    </div>
                    <div className="text-xs mr-2 py-1.5 px-4 text-slate-600 bg-blue-100 rounded-2xl">
                        #Money
                    </div>
                </div>
            </div>
        </div>
    </div>
}
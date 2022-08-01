import registerPromiseWorker from 'promise-worker/register';
import { Buffer } from 'buffer';

registerPromiseWorker((message: any) => {
    if (message.type === 'getAsBase64Message') {
        let buffer = message.buffer;
        return Buffer.from(buffer).toString('base64');
    }
})
import PromiseWorker from 'promise-worker';

const worker = new Worker(new URL('./worker', import.meta.url));
const promiseWorker = new PromiseWorker(worker);

const getAsBase64 = (buffer: Buffer): Promise<string> => promiseWorker.postMessage<string>({
    type: 'getAsBase64Message', buffer
});

export default { getAsBase64 };

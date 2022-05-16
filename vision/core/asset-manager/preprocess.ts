


import { CompleteCallbackNoData, RequestType, transformPipeline } from './shared';
import Task from './task';

export default function preprocess (task: Task, done: CompleteCallbackNoData) {
    const options = task.options;
    const subOptions = Object.create(null);
    const leftOptions = Object.create(null);

    for (const op in options) {
        switch (op) {
        // can't set these attributes in options
        case RequestType.PATH:
        case RequestType.UUID:
        case RequestType.DIR:
        case RequestType.SCENE:
        case RequestType.URL: break;
            // only need these attributes to transform url
        case '__requestType__':
        case '__isNative__':
        case 'ext':
        case 'type':
        case '__nativeName__':
        case 'audioLoadMode':
        case 'bundle':
            subOptions[op] = options[op];
            break;
            // other settings, left to next pipe
        case '__exclude__':
        case '__outputAsArray__':
            leftOptions[op] = options[op];
            break;
        default:
            subOptions[op] = options[op];
            leftOptions[op] = options[op];
            break;
        }
    }
    task.options = leftOptions;

    // transform url
    const subTask = Task.create({ input: task.input, options: subOptions });
    let err: Error | null = null;
    try {
        task.output = task.source = transformPipeline.sync(subTask);
    } catch (e) {
        err = e as Error;
        for (let i = 0, l = subTask.output.length; i < l; i++) {
            subTask.output[i].recycle();
        }
    }
    subTask.recycle();
    done(err);
}

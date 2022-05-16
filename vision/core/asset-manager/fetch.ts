



import { Asset } from '../assets';
import { error } from '../platform/debug';
import packManager from './pack-manager';
import RequestItem from './request-item';
import { assets, CompleteCallbackNoData, fetchPipeline } from './shared';
import Task from './task';
import { clear, forEach, getDepends } from './utilities';
import { legacyCC } from '../global-exports';

export default function fetch (task: Task, done: CompleteCallbackNoData) {
    let firstTask = false;
    if (!task.progress) {
        task.progress = { finish: 0, total: task.input.length, canInvoke: true };
        firstTask = true;
    }

    const { options, progress } = task;
    const depends = [];
    const total = progress.total as number;
    const exclude = options!.__exclude__ = options!.__exclude__ || Object.create(null);

    task.output = [];

    forEach(task.input as RequestItem[], (item, cb) => {
        if (!item.isNative && assets.has(item.uuid)) {
            const asset = assets.get(item.uuid);
            item.content = asset!.addRef();
            task.output.push(item);
            if (progress.canInvoke) {
                task.dispatch('progress', ++progress.finish, progress.total, item);
            }
            cb();
            return;
        }

        packManager.load(item, task.options, (err, data) => {
            if (err) {
                if (!task.isFinish) {
                    if (!legacyCC.assetManager.force || firstTask) {
                        error(err.message, err.stack);
                        progress.canInvoke = false;
                        done(err);
                    } else {
                        task.output.push(item);
                        if (progress.canInvoke) {
                            task.dispatch('progress', ++progress.finish, progress.total, item);
                        }
                    }
                }
            } else if (!task.isFinish) {
                item.file = data;
                task.output.push(item);
                if (!item.isNative) {
                    exclude[item.uuid] = true;
                    getDepends(item.uuid, data, exclude, depends, item.config!);
                    progress.total = total + depends.length;
                }
                if (progress.canInvoke) {
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                }
            }
            cb();
        });
    }, () => {
        if (task.isFinish) {
            clear(task, true);
            task.dispatch('error');
            return;
        }
        if (depends.length > 0) {
            // stage 2 , download depend asset
            const subTask = Task.create({
                input: depends,
                progress,
                options,
                onProgress: task.onProgress,
                onError: Task.prototype.recycle,
                onComplete: (err) => {
                    if (!err) {
                        task.output.push(...subTask.output);
                        subTask.recycle();
                    }
                    if (firstTask) { decreaseRef(task); }
                    done(err);
                },
            });
            fetchPipeline.async(subTask);
            return;
        }
        if (firstTask) { decreaseRef(task); }
        done();
    });
}

function decreaseRef (task: Task) {
    const output = task.output as RequestItem[];
    for (let i = 0, l = output.length; i < l; i++) {
        if (output[i].content) {
            (output[i].content as Asset).decRef(false);
        }
    }
}

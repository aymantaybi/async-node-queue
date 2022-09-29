const createControlledAsync = require('controlled-async');

class Queue {

    constructor({ auto = false, limit = 0, overwrite = false }) {
        this.auto = auto;
        this.limit = limit;
        this.overwrite = overwrite;
        this.items = [];
        this.started = false;
    }

    async iterate() {
        if (!this.items[0]) { this.started = false; return };
        let { task, params } = this.items[0];
        if (task instanceof Function) {
            let [controlledFunction, functionController] = createControlledAsync(task);
            this.controller = functionController;
            let result = await controlledFunction(...params);
            if (result?.queueTaskCanceled) { this.started = false; return };
        }
        this.items = this.items.slice(1);
        this.iterate();
    }

    add(task, params) {

        let currentIndex = this.getCurrentIndex();
        let index = currentIndex + 1;

        if (this.limit != 0 && this.items.length == this.limit && !this.overwrite) return;
        if (this.limit != 0 && this.items.length == this.limit && this.overwrite) this.items[this.limit - 1] = { task, params, index };
        if (this.limit == 0 || this.items.length != this.limit) this.items.push({ task, params, index });

        if (this.auto) this.start();
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.iterate();
    }

    stop() {
        this.controller.resolve({ queueTaskCanceled: true });
    }

    reset() {
        this.items = [];
        this.started = false;
    }

    getCurrentIndex() {
        return this.items.length > 0 ? this.items[this.items.length - 1].index : -1;
    }

}

module.exports = Queue;
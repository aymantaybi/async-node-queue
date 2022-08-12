const createControlledAsync = require('controlled-async');
const { isObject } = require('./utils');

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
        let { func, params } = this.items[0];
        if (func instanceof Function) {
            let [controlledFunc, funcController] = createControlledAsync(func);
            this.controller = funcController;
            let result = await controlledFunc(...params);
            if (isObject(result) && result.canceled) { this.started = false; return };
        }
        this.items = this.items.slice(1);
        this.iterate();
    }

    add(func, params) {

        let currentIndex = this.getCurrentIndex();
        let index = currentIndex + 1;

        if (this.limit != 0 && this.items.length == this.limit && !this.overwrite) return;
        if (this.limit != 0 && this.items.length == this.limit && this.overwrite) this.items[this.limit - 1] = { func, params, index };
        if (this.limit == 0 || this.items.length != this.limit) this.items.push({ func, params, index });

        if (this.auto) this.start();
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.iterate();
    }

    stop() {
        this.controller.resolve({ canceled: true });
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
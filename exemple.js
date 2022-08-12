const Queue = require('./index');

const queue = new Queue({ auto: true, limit: 10, overwrite: true });

let index = 0;

setTimeout(() => {
    queue.stop();
}, 20000)

setInterval(() => {
    if (index == 10) return;
    index++;
    queue.add(test, [index]);
}, 3000)

async function test(num) {
    await sleep(5000);
    console.log(num);
    console.log(queue.items);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
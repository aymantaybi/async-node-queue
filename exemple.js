const Queue = require("./index");

const queue = new Queue({ auto: true });

let index = 0;

let intervalId = setInterval(() => {
  index++;
  queue.add(test, [index]);
}, 1000);

setTimeout(() => {
  clearInterval(intervalId);
  queue.stop();
  queue.reset();
  console.log("Stop");
}, 20000);

async function test(num) {
  await sleep(2000);
  console.log(num);
  console.log(queue.items);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

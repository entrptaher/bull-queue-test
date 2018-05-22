const Queue = require("bull");
var delayQueue = new Queue("delay date");

delayQueue.on("global:completed", function(jobID, result) {
  console.log(`job ${jobID} completed`, result);
});

async function addJob(data) {
  const jobPromise = await delayQueue.add(data);
  const result = await jobPromise.finished();
  console.log({ data, result });
  return result;
}

for (i = 0; i < 1; i++) {
  addJob({ index: i, addingOn: new Date().toUTCString() });
}

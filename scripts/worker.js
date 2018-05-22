const delay = require("yoctodelay");
const Queue = require("bull");

var delayQueue = new Queue("delay date");
delayQueue
  .on("completed", function(job, result) {
    // A job successfully completed with a `result`.
    console.log(result);
  })
  .on("failed", function(job, err) {
    // A job failed with reason `err`!
    console.log(err);
  });

delayQueue.process(10000, async function(job) {
  const startTime = new Date().toUTCString();
  await delay(1000);
  const endTime = new Date().toUTCString();
  return { data: job.data, startTime, endTime };
});

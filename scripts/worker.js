// NOTE: this event emmiter is here for a reason and it'd be best if we can avoid this
require('events').EventEmitter.prototype._maxListeners = Infinity;
require('dotenv').config()

const Queue = require("bull");
const concurrency = process.env.CONCURRENCY_PER_PROCESS || 5;
const scraper = require("./browser/index");

var queue = new Queue("get content", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
  }
});

queue
  .on("completed", function(job, result) {
    // A job successfully completed with a `result`.
    console.log(result);
  })
  .on("failed", function(job, err) {
    // A job failed with reason `err`!
    console.log(err);
  });

queue.process(concurrency, async function(job) {
  try {
    const response = await scraper(job.data);
    return response;
  } catch (e) {
    return { error: "error processing task" };
  }
});

// Graceful shutdown
const shutter = require('./shutter');
process.on('SIGTERM', function onSigterm () {
  shutter(queue);
})
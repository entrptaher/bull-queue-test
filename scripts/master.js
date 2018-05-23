// NOTE: this event emmiter is here for a reason and it'd be best if we can avoid this
require("events").EventEmitter.prototype._maxListeners = Infinity;

require('dotenv').config()
const Queue = require("bull");

var queue = new Queue("get content", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
  }
});

async function addJob(data) {
  const jobPromise = await queue.add(data, { removeOnComplete: true });
  return jobPromise.finished();
}

// Graceful shutdown
const shutter = require('./shutter');
process.on('SIGTERM', function onSigterm () {
  shutter(queue);
})

module.exports = { addJob };

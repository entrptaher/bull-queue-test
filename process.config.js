require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "master",
      script: "./scripts/api.js",
      instances: process.env.MAX_WORKER_PROCESS || 1,
      watch: true,
      exec_mode: "cluster"
    },
    {
      name: "worker",
      script: "./scripts/worker.js",
      instances: process.env.MAX_WORKER_PROCESS || 1,
      watch: true,
      exec_mode: "cluster"
    }
  ]
};

require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "master",
      script: "./scripts/api.js",
      instances: 1,
      watch: true,
      exec_mode: "cluster"
    },
    {
      name: "worker",
      script: "./scripts/worker.js",
      instances: 1,
      watch: true,
      exec_mode: "cluster"
    }
  ]
};

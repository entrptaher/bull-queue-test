module.exports = {
  apps: [
    {
      name: "master",
      script: "./scripts/api.js",
      instances: 4,
      watch: true
    },
    {
      name: "worker",
      script: "./scripts/worker.js",
      instances: 4,
      exec_mode: "cluster"
    }
  ]
};

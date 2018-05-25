module.exports = {
  apps: [
    {
      name: "master",
      script: "./scripts/api.js",
      instances: "max",
      watch: true,
      exec_mode: "cluster"
    },
    {
      name: "worker",
      script: "./scripts/worker.js",
      instances: "max",
      watch: true,
      exec_mode: "cluster"
    }
  ]
};

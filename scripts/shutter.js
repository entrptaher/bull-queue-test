module.exports = function(queue) {
  queue.close().then(function() {
    process.exit();
  });
};

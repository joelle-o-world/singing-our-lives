module.exports = {
  apps: [{
    name: "Singin our lives",
    script: "server/index.js",
    watch: ["server", "public"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules"],
    watch_options: {
      "followSymlinks": false
    }
  }]
}
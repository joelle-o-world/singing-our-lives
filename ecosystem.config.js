module.exports = {
  apps: [{
    name: "singing-our-lives",
    script: "npm",
    args: "start",
    interpreter: 'none',
    watch: true,
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "formfills"],
    watch_options: {
      "followSymlinks": false
    }
  },
  {
    name: "git-watcher",
    script: "watchGithub.sh",
    watch_delay: 60000,
    watch: true,
    ignore_watch : ["node_modules", "formfills", 'package-lock.json']
  }]
}
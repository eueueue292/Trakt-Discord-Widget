const { execSync } = require("child_process");

function runOnce() {
  console.log("Updating AniList widget...");
  execSync("node upload-widget.js", { stdio: "inherit" });
}

const intervalMs = 5 * 60 * 1000;

runOnce();
setInterval(runOnce, intervalMs);
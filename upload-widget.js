const fetch = require("node-fetch");
const config = require("./config.json");

async function upload() {
  console.log("Generating AniList widget JSON from index.js...");

  const { execSync } = require("child_process");

  const output = execSync("node index.js").toString();

  console.log("Uploading widget JSON to Discord...");

  const url = `https://discord.com/api/v9/applications/${config.DISCORD_APP_ID}/users/${config.DISCORD_USER_ID}/identities/0/profile`;

const res = await fetch(url, {
  method: "PATCH",
  headers: {
    "Authorization": `Bot ${config.BOT_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)"
  },
  body: output
});

  const text = await res.text();
  console.log("Upload complete:", text);
}

upload().catch(console.error);
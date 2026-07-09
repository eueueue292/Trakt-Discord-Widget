const fetch = require("node-fetch");
const config = require("./config.json");

const AUTH_CODE = "ed5656f6";

async function main() {
  const res = await fetch("https://api.trakt.tv/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "trakt-api-version": "2",
      "trakt-api-key": config.TRAKT_CLIENT_ID
    },
    body: JSON.stringify({
      code: AUTH_CODE,
      client_id: config.TRAKT_CLIENT_ID,
      client_secret: config.TRAKT_CLIENT_SECRET,
      redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "authorization_code"
    })
  });

  const text = await res.text();
  console.log(text);
}

main().catch(console.error);
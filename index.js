const fetch = require("node-fetch");
const config = require("./config.json");

const TMDB_IMG = "https://image.tmdb.org/t/p/w780";
const FALLBACK_IMG = "https://i.imgur.com/8Km9tLL.png";
const MOVIE_FALLBACK = "https://i.imgur.com/AWOuDAB.png";

async function trakt(path) {
  const res = await fetch(`https://api.trakt.tv${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "trakt-api-version": "2",
      "trakt-api-key": config.TRAKT_CLIENT_ID,
      "Authorization": `Bearer ${config.TRAKT_ACCESS_TOKEN}`
    }
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.log(text);
    throw new Error("Trakt returned HTML instead of JSON.");
  }
}

async function tmdb(type, id) {
  if (!id) return null;

  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${config.TMDB_API_KEY}`
  );

  return res.json();
}

function img(path, fallback = FALLBACK_IMG) {
  return path ? `${TMDB_IMG}${path}` : fallback;
}

function ago(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "Watched just now";

  const min = Math.floor(seconds / 60);
  if (min < 60) return `Watched ${min} min ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `Watched ${hr} hr ago`;

  const days = Math.floor(hr / 24);
  return `Watched ${days} day${days === 1 ? "" : "s"} ago`;
}

async function main() {
  const history = await trakt("/sync/history?limit=10");

  const latest = history[0];
  const movie = history.find(x => x.type === "movie");
  const episode = history.find(x => x.type === "episode");

  const latestIsMovie = latest.type === "movie";
  const latestTmdbId = latestIsMovie ? latest.movie.ids.tmdb : latest.show.ids.tmdb;
  const latestTmdb = await tmdb(latestIsMovie ? "movie" : "tv", latestTmdbId);

  const movieTmdb = movie ? await tmdb("movie", movie.movie.ids.tmdb) : null;
  const episodeTmdb = episode ? await tmdb("tv", episode.show.ids.tmdb) : null;
const episodeStill = episode
  ? await tmdb(
      `tv/${episode.show.ids.tmdb}/season/${episode.episode.season}`,
      `episode/${episode.episode.number}`
    )
  : null;
  const latestTitle = latestIsMovie
    ? latest.movie.title
    : latest.show.title;

  const latestSubtitle = latestIsMovie
    ? `Movie • ${ago(latest.watched_at)}`
    : `S${latest.episode.season}E${latest.episode.number} • ${ago(latest.watched_at)}`;

  const latestActivity = latestIsMovie
    ? latest.movie.title
    : `${latest.show.title} S${latest.episode.season}E${latest.episode.number}`;

  const output = {
    data: {
      dynamic: [
        { type: 1, name: "latest_Title", value: latestTitle },
        { type: 1, name: "latest_Subtitle", value: latestSubtitle },
        { type: 1, name: "latest_Activity", value: latestActivity },
        { type: 1, name: "latest_Type", value: latestIsMovie ? "Movie" : "Episode" },
        { type: 1, name: "latest_WatchedAgo", value: ago(latest.watched_at) },
        { type: 1, name: "latest_Rating", value: latestTmdb?.vote_average ? `★ ${latestTmdb.vote_average.toFixed(1)}/10` : "No rating" },
        { type: 1, name: "latest_Genres", value: latestTmdb?.genres?.slice(0, 2).map(g => g.name).join(" • ") || "No genres" },
        { type: 3, name: "latest_Poster", value: { url: img(latestTmdb?.poster_path) } },
        { type: 3, name: "latest_Backdrop", value: { url: img(latestTmdb?.backdrop_path || latestTmdb?.poster_path) } },

        { type: 1, name: "movie_Title", value: movie ? movie.movie.title : "No recent movie" },
        { type: 1, name: "movie_Year", value: movie ? String(movie.movie.year) : "No movie" },
        { type: 3, name: "movie_Poster", value: { url: img(movieTmdb?.poster_path, MOVIE_FALLBACK) } },

        {
  type: 1,
  name: "episode_Show",
  value: episode
    ? `${episode.show.title} • S${episode.episode.season}E${episode.episode.number}`
    : "No recent episode"
},
        { type: 1, name: "episode_Info", value: episode ? `S${episode.episode.season}E${episode.episode.number} • ${episode.episode.title}` : "No episode" },
        { type: 3, name: "episode_Poster", value: { url: img(episodeTmdb?.poster_path) } },
{
  type: 3,
  name: "episode_Thumbnail",
  value: {
    url: img(episodeStill?.still_path || episodeTmdb?.poster_path)
  }
}
      ]
    }
  };

  console.log(JSON.stringify(output));
}

main().catch(err => {
  console.error("Trakt fetch failed:", err);
  process.exit(1);
});
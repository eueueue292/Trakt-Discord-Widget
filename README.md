#  Trakt Discord Widget

A custom Discord Widget that automatically displays your latest Trakt activity on your Discord profile.

![Preview](preview.png)

##  Features

- 🎬 Latest movie watched
- 📺 Latest TV episode watched
- 🖼️ TMDb posters & artwork
- ⭐ TMDb ratings
- 🎭 Genres
- 🕒 "Watched X ago"
- 🔄 Automatic updates
- ⚡ Easy setup

##  Requirements

- Node.js 18+
- Discord Widget Developer Access
- Trakt API Application
- TMDb API Key

##  Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Trakt-Discord-Widget.git
cd Trakt-Discord-Widget
```

Install dependencies:

```bash
npm install
```

Copy:

```
config.example.json
```

to

```
config.json
```

Fill in your:

- Discord Bot Token
- Discord Application ID
- Discord User ID
- Trakt Client ID
- Trakt Client Secret
- Trakt Access Token
- TMDb API Key

##  Usage

Upload the widget once:

```bash
node upload-widget.js
```

Automatically update every minute:

```bash
node upload-widget-loop.js
```

##  Widget

Displays:

- Latest Movie
- Latest Episode
- TMDb Rating
- Latest Activity
- Automatic artwork
- Automatic refresh

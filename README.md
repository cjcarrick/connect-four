<h1 align="center"> Connect Four </h1>

<p align="center"> The game where you try to get 4 pieces in a row. </p>

<p align="center"> <a href="https://cjcarrick.github.io/connect-four> Demo </a> </p>

<p float="left">
  <img src="/preview/HomeView.png" width="500" />
  <img src="/preview/LocalView.png" width="500" />
</p>

<hr />

*The Github Pages demo might not work perfectly. A lot of the functionality
(especially in online matches) is provided by a NodeJS server, which Github Pages
doesn't provide.*

<hr />

### Local Matches

Take turns placing pieces with someone else. Works on one computer, without any
backend server needed.

### Matches Against Bots

The bot is admittedly not very smart. It just places pieces in a random spot
every time. Someday when I have more time maybe I'll actually try to make a real
bot.

### Online Matches

You can play against other people across the internet through web sockets.

This will only work if running on a full Node server, and the option may not be
avalible statically hosted sites.

## Methodology

Especially with the multiplayer, I made lots of "bad" decisions for the sake of
fun-ness. You can join any team in any match without any passwords. Multiplayer
match ids are generated sequentially,\* so hop on match 0 and there will probably
already be some action. You can even join a team with the same username as
someone already on that team, and you will both control the same player.

\* _Match ids are generated sequentially when no match id is provided. If you
want a "private" game, just pick a super secret number for the match id that no
one would ever guess._

## Running locally

```sh
pnpm i
```

```sh
pnpm build
```

Generated files are in `dist/`.

If you want multiplayer (over LAN or the world wide web), you'll need to start
the server too:

```sh
pnpm start
```

## Developing

```sh
pnpm i
```

```sh
pnpm dev
```

If you want to work on multiplayer, you'll need to build, watch, and run the
backend server:

```sh
pnpm dev:backend
```

## How it works

The modular structure of the api allows it to be easily adapted to different
scenarious like online, local, or AI matches.

The core of the whole thing is the `Match` class. It contains a board, detects
wins when pieces are placed, keeps track of players, etc.

It also has methods for placing pieces and event listeners for common events like
players joining or turns changing.

The server has a match list, which is just an array of matches. When a user
requests a match, they're put on whichever match needs players the most. I'm not
sure if there's a safer way to do this, but I guess I'll find out the hard way
eventually.

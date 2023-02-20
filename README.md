# Twitch-Song-Request-Client
[Twitch Song Request Client for BeatSaber on Quest.](https://github.com/hdgamer1404Jonas/Twitch-Song-Request-Mod)

## Requirements
- [Node.js](https://nodejs.org/en/) (v18.14.1 or higher)
- [Beat Saber Quest Mod](https://github.com/hdgamer1404Jonas/Twitch-Song-Request-Mod)

## Installation
1. Download the latest release from [here](https://github.com/hdgamer1404Jonas/Twitch-Song-Request-Client/releases/latest).
2. Run the programm. It will create an `config.json` file in the same directory.
3. Aquire a [Twitch OAuth Token](https://twitchapps.com/tmi/).
4. Fill in the `config.json` file with your data. Put the OAuth Token in the `oauth` field, the username of the account which the token belongs to in the `username` field and the channel you want to connect to in the `channel` field. Alternatively you can also set an custom port in the `port` field in case it's blocked by another websocket.
5. Fill in the Config on your Quest. All informations can be found in the console of the client.

## Features
- [x] Song Request
- [x] Song Info (Coming Soon)
- [x] Now Playing (Coming Soon)

## Running the client outside your network on a linux server

**WARNING: This is not Recommended. Everyone can connect to your Server. Make sure the firewall on your server only lets you connect!**

1. Download the latest release for linux from [here](https://github.com/hdgamer1404Jonas/Twitch-Song-Request-Client/releases/latest)
2. Run the programm. It will create an `config.json` file in the same directory.
3. Aquire a [Twitch OAuth Token](https://twitchapps.com/tmi/).
4. Fill in the `config.json` file with your data. Put the OAuth Token in the `oauth` field, the username of the account which the token belongs to in the `username` field and the channel you want to connect to in the `channel` field. Alternatively you can also set an custom port in the `port` field in case it's blocked by another websocket.
5. Open the Port you set in the `port` field in your firewall of the server.
6. Instead of using one of the listed ips in the console, use the public ip of your server and the port you set in the `port` field. Example: `1.1.1.1:8080`.
7. Fill in the Config on your Quest. All informations can be found in the console of the client.
8. Run the client on your server. Your quest should now be able to connect to the client.

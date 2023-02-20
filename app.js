const ws = require("ws");
const tmi = require("tmi.js");
const configUtils = require("./configUtils.js");
const chalk = require("chalk");
const os = require("os");
const https = require("https");

let config;
let socketServer;
let twitchClient;

async function start() {
    if (await configUtils.checkConfig()) {
        if (await configUtils.checkIfConfigIsFilled()) {
            config = await configUtils.loadConfig();
            socket()
            twitch()
        } else {
            console.log(chalk.red("Config file is not filled. Please fill it before starting the application."));
            console.log(chalk.red("Exiting..."));
            process.kill(process.pid, 'SIGTERM');
        }
    } else {
        await configUtils.createConfig();
        console.log(chalk.green("Config file created. Please fill it before starting the application."));
        console.log(chalk.green("Exiting..."));
        process.kill(process.pid, 'SIGTERM');
    }
}


async function socket() {
    socketServer = new ws.Server({
        port: config.web.port
    });

    socketServer.on("error", (err) => {
        console.log(chalk.red(`Socket server error: ${err}`));
        console.log(chalk.red("Is the Port already in use?"));
        console.log(chalk.red("Exiting..."));
        process.kill(process.pid, 'SIGTERM');
    })

    socketServer.on("connection", (socket) => {
        console.log(chalk.green(`New socket connection from ${socket._socket.remoteAddress}`));
    });

    // Get the IP address of the machine
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    for (let k in networkInterfaces) {
        for (let k2 in networkInterfaces[k]) {
            let address = networkInterfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    console.log(chalk.green(`Socket server started!`));
    console.log(chalk.green(`Enter one of the following IP adresses with port in the config file on your quest:`));
    for (let i = 0; i < addresses.length; i++) {
        console.log(chalk.green(`${addresses[i]}:${config.web.port}`));
    }
    console.log(chalk.green(`If you are running this on an server outside your network, you have to use your public IP address + port ${config.web.port}.`));

}

async function twitch() {
    const token = config.twitch.oauth;
    const username = config.twitch.username;
    const channel = config.twitch.channel;

    twitchClient = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: username,
            password: token
        },
        channels: [channel]
    });

    twitchClient.connect();

    twitchClient.on("error", (err) => {
        console.log(chalk.red(`Twitch client error: ${err}`));
        console.log(chalk.red("Exiting..."));
        process.exit();
    })

    console.log(chalk.green(`Twitch client started!`));

    twitchClient.on("message", async (channel, tags, message, self) => {
        if(!message.startsWith("!")) return;
        const args = message.slice(1).trim().split(/ +/g);
        if (args[0] === "bsr") {
            if (socketServer.clients.size === 0) return twitchClient.say(channel, "The owner of this channel is currently not playing Beat Saber. Please try again later. If you are the owner of this channel, please make sure BS is running and you entered the correct IP address in the config file.");
            if(!args[1]) return twitchClient.say(channel, "No song id provided. Please provide a song id.");
            
            const songId = args[1];

            const beastsaverapilink = `https://api.beatsaver.com/maps/id/${songId}`;

            let data = '';
            let response = '';

            await https.get(beastsaverapilink, async (res) => {
                res.on("data", async (d) => {data+=d});
                res.on("end", async () => {
                    response = await JSON.parse(data);
                    if(response.error) return twitchClient.say(channel, "No song found with this id. Please provide a valid song id.");
                    const songnName = response.metadata.songName;
                    const songAuthorName = response.metadata.songAuthorName;

                    const songName = `${songnName} - by ${songAuthorName}`;

                    twitchClient.say(channel, `Requested song: ${songName} (${songId})`);

                    socketServer.clients.forEach(async (client) => {
                        if (client.readyState === ws.OPEN) {
                            client.send(songId);
                        }
                    });
                });
            });
        }
    });
}



start();
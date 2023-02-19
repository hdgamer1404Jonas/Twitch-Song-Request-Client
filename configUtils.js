const fs = require('fs')

async function checkConfig () {
    if (fs.existsSync('./config.json')) return true;
    else return false;
}

async function createConfig () {
    const config = {
        "twitch": {
            "username": "your_username",
            "oauth": "oauth:your_oauth",
            "channel": "your_channel"
        },
        "web": {
            "port": 8080
        }
    }
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

async function loadConfig () {
    console.log("Config file loaded.");
    return JSON.parse(fs.readFileSync('./config.json'));
}

async function checkIfConfigIsFilled() {
    const config = await loadConfig();
    if (config.twitch.username === "your_username") return false;
    else if (config.twitch.oauth === "oauth:your_oauth") return false;
    else if (config.twitch.channel === "your_channel") return false;
    if(!config.web.port) return false;
    else return true;
}

module.exports = {
    checkConfig,
    createConfig,
    loadConfig,
    checkIfConfigIsFilled
}
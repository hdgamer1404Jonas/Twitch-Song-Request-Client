const ws = require("ws");

const connection = new ws("ws://localhost:8080");

connection.on("open", () => {
    console.log("Connected to server!");
});

connection.on("message", (data) => {
    console.log(data.toString());
});
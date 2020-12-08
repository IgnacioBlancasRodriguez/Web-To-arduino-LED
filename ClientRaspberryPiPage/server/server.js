const { response } = require("express");
var express = require("express");
var http = require("http");
var io = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const server = io(httpServer, {
    transports: ["websocket"],
    reconnect: false
});

const PORT = 3001

let activeConnections = 0;
let raspberrypies = []
let clients = []

server.on("connection", (socket) => {
    activeConnections++;
    console.log(`=> new connection ${ activeConnections }: ${ socket.id }`);
    const sock = socket;

    sock.on("client-type", (data) => {
        console.log("===================================================================================================================")
        console.log(`=> new connection requested with data: ${ data["clientType"] }`)
        if (data["clientType"] === "client"){
            clients.push(sock);
        } else if (data["clientType"] === "raspberryPi"){
            raspberrypies.push(sock);
        }
        console.log("===================================================================================================================")
        console.log(`=> clients conected: ${ clients }`);
        console.log(`=> raspberrypies conected: ${ raspberrypies }`);
        console.log("===================================================================================================================")
        return;
    });
    sock.on("get-raspberrypies", (data) => {
        //data = stringify(data);
        console.log(`=> get-raspberrypies request has been made with data: ${ data["request"] }`);
        let res = {};
        for(i = 0;i < raspberrypies.length;i++){
            res[`raspberrypies_${ i }`] = i;
        }
        return sock.emit("get-raspberrypies-response", res);
    });
    sock.on("change-state", (data) => {
        //data = stringify(data);
        console.log(`=> change-state request has been made with data: ${ data }`);
        let request = {
            "btnState": data["btnState"]
        }
        console.log("===================================================================================================================")
        console.log(`=> Sending request to raspberryPi from client: ${ data["target"] }`);
        console.log("===================================================================================================================")
        raspberrypies[data["target"]].emit("change-state-btn", request);
        raspberrypies[data["target"]].on("request-btnState", (data) => {
            console.log("===================================================================================================================")
            console.log(`=> Sending request to client from raspberryPi: ${ data }`);
            console.log("===================================================================================================================")    
            return sock.emit("change-state-response", data);
        })
        return;
    });
});
server.on("disconnect", (socket) => {
        if (clients.indexOf(socket) != -1 && raspberrypies.indexOf(socket) == -1){
            console.log("===================================================================================================================");
            console.log(`web client disconnected: ${ socket.id }`);
            console.log("===================================================================================================================");
        }else{
            console.log("===================================================================================================================");
            console.log(`raspberry pi disconnected: ${ socket.id }`);
            console.log("===================================================================================================================");
        };
        socket.disconnect();
        socket.removeAllListeners();
        return;
});

httpServer.listen(PORT, () => { console.log(`app listening in port ${ PORT }`) });
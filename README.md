# 💻💡Web-To-raspberryPi-LED

This small project is the begining of a series of projects in which I'll be using socketio to connect litle devices such as leds, in this case, to the internet and so that I can control them remotly via web. Also, I've taked this project as an excuse to reenforce my vue skills.

<hr>

## 🚀Technologies used
This repository uses two main technologies:
 * [Python](https://www.python.org/)
 * [Socketio-javascript](https://socket.io/)
 * [Socketio-python](https://python-socketio.readthedocs.io/en/latest/)
 * [Vue3](https://v3.vuejs.org/)
 * [Vue-cli](https://cli.vuejs.org/)
 * [Vuex4](https://github.com/vuejs/vuex/tree/4.0)
 * [RPi.GPIO](https://pypi.org/project/RPi.GPIO/)
 * [Vue-sweetalert2](https://www.npmjs.com/package/vue-sweetalert2)

 <hr>

## ⚙How do you connect the raspberry pi to a web-app?
It's pretty easy indeed. Roughly, the web-app, using socket io with only websockets, sends a group of messages to server, with which he gets a list of the raspberrypies connected and sends a signal to the server telling him to send a signal (turn "on" or "off") to the specified target. Here's a litle guided explanation:

> ### <strong>Connecting and declaring our client-type to the server (javascript-client)</strong>
> First, having imported the "socketio-cleint" module as io(or whatever you want to call it), you create your socket as an instance of the io module passing as an argument the server url:
>```javascript
> const serverIp = "your-server-IP"
> const io = require("socket.io-client");
> const socket = io(```http://${ serverIp }:3001```, {
>   transports: ["websocket"],
>   upgrade: false,
>   reconnect: false
> });
>```
> When that's done we send the client-type:
>```javascript
> let data = {
>     "clientType": "client",
> };
> socket.emit("client-type", data);
>```

<hr>

> ### <strong>Connecting and declaring our client-type to the server (python-client)</strong>
> The python client, aswell as the javascript one, imports the socketio library, but, by the time you try to connect, you create a specific connection funcion in which you handle all the client-type logic. First we import it, after that we create the connect function:
>```python
> import socketio
> 
> socket = socketio.Client()
> serverIp = ""
> with open("serverIp.json") as serverIpJson:
>     serverIp = str(json.load(serverIpJson)["serverIp"])
> serverUrl = f"http://{ serverIp }:3001"
> ClientTpype = "raspberryPi"
> 
> @socket.event
> def connect():
>     global ClientTpype
>     print(f"=> Connected to server: { serverUrl }")
>     clientType = {
>        "clientType": ClientTpype
>     }
>     socket.emit("client-type", clientType)
>     GPIO.setmode(GPIO.BOARD)
>     GPIO.setup(ledPin, GPIO.OUT)
>     GPIO.output(ledPin, GPIO.LOW)
>     return f"=> Client type sent to server: { ClientTpype }"
>```
> When that's done we call the connect function:
>```python
> if __name__ == "__main__":
>     socket.connect(serverUrl, transports=["websocket"])
>```

<hr>

> ### <strong>Sending a change-state request (javascript-client)</strong>
> First of all, in order to send a change-state request, you need to know which clients are connected, and so to get that you send have to send a get an array containing the indexes of the raspberrypies connected:
>```javascript
> socket.emit("get-arduinos", {
>           "request": "get-arduinos"
>         });
>```
> Once that's done, the client sends the change-state request we talked about earlier, sending aswell the target's index. After all of this is done, the client recives response from the sever containing the status of the request:
>```javascript
> socket.once("get-arduinos-response", (data) => {
>             console.log(data);
>             this.arduino = `${data[`arduinos_${ 0 }`]}`;
>             console.log(this.arduino);
>             socket.emit("change-state", {
>                 "btnState": `${ this.possibleStates[Math.abs(this.possibleStates.indexOf(this.$store.state.ledState) - 1)] }`,
>                 "target": `${this.arduino}`
>             });
>             socket.once("change-state-response", (data) => {
>                 console.log(`Response to change-state request: ${ data["newBtnState"] }`);
>                 
>                 this.$store.commit("changeLedState", { newLedState: data["newBtnState"] });
>                 return;
>             });
>             return;
>         });
>```

<hr>

> ### <strong>Handling change-state request from the javascript client, comming from the server (python-client)</strong>
> To handle this events, we set up a function which we'll be called whenever the python client recives a change-state request from the server, inside of which you check the new state and act in consecuence. Whenever the led state changes, the python client sends a response to the server with the status of the led:
>```python
> @socket.on("change-state-btn")
> def on_message(data):
>     print(f"=> { data }")
>     #main turning led logic
>     if data["btnState"].find("On") != -1:
>         GPIO.output(ledPin, GPIO.HIGH)
>     elif data["btnState"].find("Off") != -1:
>         GPIO.output(ledPin, GPIO.LOW)
>     response = {
>         "newBtnState": data["btnState"],
>         "requestStatus": "State of LED changed"
>     }
>     return socket.emit("request-btnState", response)
>```
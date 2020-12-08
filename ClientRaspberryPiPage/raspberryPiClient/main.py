import RPi.GPIO as GPIO
import socketio
import json

socket = socketio.Client()
serverIp = ""
with open("serverIp.json") as serverIpJson:
    serverIp = str(json.load(serverIpJson)["serverIp"])
serverUrl = f"http://{ serverIp }:3001"
ClientTpype = "raspberryPi"
ledPin = 12
PossibleStates = ["On", "Off"]

@socket.event
def connect():
    global ClientTpype
    print(f"=> Connected to server: { serverUrl }")
    clientType = {
        "clientType": ClientTpype
    }
    socket.emit("client-type", clientType)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(ledPin, GPIO.OUT)
    GPIO.output(ledPin, GPIO.LOW)
    return f"=> Client type sent to server: { ClientTpype }"
@socket.on("change-state-btn")
def on_message(data):
    print(f"=> { data }")
    #main turning led logic
    if data["btnState"].find("On") != -1:
        GPIO.output(ledPin, GPIO.HIGH)
    elif data["btnState"].find("Off") != -1:
        GPIO.output(ledPin, GPIO.LOW)
    response = {
        "newBtnState": data["btnState"],
        "requestStatus": "State of LED changed"
    }
    return socket.emit("request-btnState", response)
#connects to the server
if __name__ == "__main__":
    ledPin = int(input("What pin do you have your led on?:  "))
    socket.connect(serverUrl, transports=["websocket"])
<template>
  <button v-on:click="changeState()"><b>Turn {{ getState }}</b></button>
</template>
<script>
const serverIp = "your-server-IP"
const io = require("socket.io-client");
const socket = io(```http://${ serverIp }:3001```, {
  transports: ["websocket"],
  upgrade: false,
  reconnect: false
});
let data = {
    "clientType": "client",
};
socket.emit("client-type", data);

export default {
  name: "NavBar",
  props: ["LedComponent"],
  data() {
    return {
      btnState: "On",
      arduino: "",
      possibleStates: ["On", "Off"]
    };
  },
  computed: {
    getState() {
      return this.possibleStates[Math.abs(this.possibleStates.indexOf(this.$store.state.ledState) - 1)];
    }
  },
  methods: {
    changeState() {
      console.log(socket.connected);
      if (socket.connected == true) {
        socket.emit("get-arduinos", {
          "request": "get-arduinos"
        });
        socket.once("get-arduinos-response", (data) => {
            console.log(data);
            this.arduino = `${data[`arduinos_${ 0 }`]}`;
            console.log(this.arduino);
            socket.emit("change-state", {
                "btnState": `${ this.possibleStates[Math.abs(this.possibleStates.indexOf(this.$store.state.ledState) - 1)] }`,
                "target": `${this.arduino}`
            });
            socket.once("change-state-response", (data) => {
                console.log(`Response to change-state request: ${ data["newBtnState"] }`);
                
                this.$store.commit("changeLedState", { newLedState: data["newBtnState"] });
                return;
            });
            return;
        });
      }else {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  }
};
</script>
<style scoped>
button {
  font-family: Dosis,sans-serif;
  font-size: 1.2em;
  padding-top: 1em;
  padding-bottom: 1em;
  width: 15%;
  background-color: #333333;
  border-radius: 10px;
  border-style: none;
  color: whitesmoke;
  transition: 0.3s;
}
button:hover {
  background-color: #576574;
}
.swal-title {
  font-family: Dosis,sans-serif;
}
</style>
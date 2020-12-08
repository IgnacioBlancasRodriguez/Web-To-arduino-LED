import Vuex from 'vuex'
import { createApp } from 'vue'
import { createStore } from "vuex";
import App from "./App"
import VueSweetalert2 from "vue-sweetalert2";

const options = {
    confirmButtonColor: '#41b882',
    cancelButtonColor: '#ff7674',
  };

const store = createStore({
    state: {
        ledState: "Off"
    },
    mutations: {
        changeLedState (state, { newLedState }){
            state.ledState = newLedState;
        }
    }
})

const app = createApp(App)

app.use(store);
app.use(VueSweetalert2, options);

app.mount("#app");
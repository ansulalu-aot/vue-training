import App from "./App.vue";
import router from "./router";
import firebase from "firebase/compat/app";
import { createApp } from "vue";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyB7CMYVHWphPO6eJI_k6RtN6882fds_Ly8",
  authDomain: "task-list-8e785.firebaseapp.com",
  projectId: "task-list-8e785",
  storageBucket: "task-list-8e785.appspot.com",
  messagingSenderId: "499212441694",
  appId: "1:499212441694:web:af48c4615bcdad8a54fccf",
};

firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.config.globalProperties.$firebase = firebase;

console.log(firebase);

app.mount("#app");

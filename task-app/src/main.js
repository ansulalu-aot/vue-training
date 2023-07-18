import App from "./App.vue";
import router from "./router";
import firebase from "firebase/compat/app";
import { createApp } from "vue";
import "firebase/compat/database";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7CMYVHWphPO6eJI_k6RtN6882fds_Ly8",
  authDomain: "task-list-8e785.firebaseapp.com",
  projectId: "task-list-8e785",
  storageBucket: "task-list-8e785.appspot.com",
  messagingSenderId: "499212441694",
  appId: "1:499212441694:web:af48c4615bcdad8a54fccf",
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  const app = createApp(App);
  app.use(router);
  app.config.globalProperties.$firebase = firebase;

  if (user) {
    // If the user is logged in, mount the Vue app and proceed to the tasks page
    app.mount("#app");
    if (router.currentRoute.value.path === "/login") {
      // If the current route is "/login", navigate to the tasks page
      router.push("/tasks");
    }
  } else {
    // If the user is not logged in, navigate to the login page
    app.mount("#app");
    if (router.currentRoute.value.path !== "/login") {
      // If the current route is not "/login", navigate to the login page
      router.push("/login");
    }
  }
});

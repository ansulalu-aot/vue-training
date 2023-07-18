<template>
  <h2>Welcome To Task Management</h2>
  <div class="container">
    <form v-if="loginMode" @submit.prevent="loginWithEmail">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <!-- Display error message if present -->
      <p v-if="error" style="color: red">{{ error }}</p>
      <button class="submit" type="submit">Login</button>
      <button type="button" @click="toggleMode">Register Instead</button>
    </form>

    <form v-else @submit.prevent="registerWithEmail">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <!-- Display error message if present -->
      <p v-if="error" style="color: red">{{ error }}</p>
      <button class="submit" type="submit">Register</button>
      <button type="button" @click="toggleMode">Login Instead</button>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
  name: "LoginView",
  data() {
    return {
      loginMode: true,
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async toggleMode() {
      this.loginMode = !this.loginMode;
    },
    async loginWithEmail() {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          // Store the user's authentication token in the Realtime Database or Firestore
          const database = this.$firebase.database();
          const userTokenRef = database
            .ref("userTokens")
            .child(currentUser.uid);
          userTokenRef.set(token);

          this.$router.push("/tasks");
        }
      } catch (error) {
        this.error = "Invalid email or password";
        console.error("Error logging in:", error);
      }
    },
    async registerWithEmail() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        // You can automatically log in the user after successful registration if desired
        this.$router.push("/tasks");
      } catch (error) {
        this.error = "Error registering user";
        console.error("Error registering user:", error);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 5rem;
}
.submit {
  background-color: grey;
  color: white;
}
input {
  width: 500px;
}
@media (max-width: 770px) {
  input {
    width: auto;
  }
  h2 {
    margin-top: 3rem;
  }
  button {
    font-size: 10px;
  }
}
</style>

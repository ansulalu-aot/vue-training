<template>
  <div>
    <h2>Task Management</h2>
    <hr />
    <form @submit.prevent="saveTask">
      <div class="heading">
        <h3>Add Task</h3>
      </div>
      <div class="form-group">
        <label for="taskName">Task Name:</label>
        <input type="text" id="taskName" v-model="task.name" required />
      </div>
      <div class="form-group">
        <label for="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          v-model="task.projectName"
          required
        />
      </div>
      <div class="form-group">
        <label for="purpose">Purpose:</label>
        <input type="text" id="purpose" v-model="task.purpose" required />
      </div>
      <div class="form-group">
        <label for="reference">Reference:</label>
        <textarea
          type="text"
          id="reference"
          v-model="task.reference"
          rows="5"
          required
        />
      </div>
      <div>
        <button class="submit" type="submit">Submit</button>
        <button @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: {
        id: "",
        name: "",
        projectName: "",
        purpose: "",
        reference: "",
        completed: false,
      },
    };
  },
  methods: {
    saveTask() {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      // Generate a new unique ID for the task
      this.task.id = tasksRef.push().key;

      // Save the task to the database
      tasksRef.child(this.task.id).set(this.task);

      // Redirect to the task listing page
      this.$router.push("/");
    },
    cancel() {
      // Go back to the main page
      this.$router.push("/");
    },
  },
};
</script>

<style>
h2 {
  text-align: left;
}

hr {
  border: 1px solid grey;
}
.heading {
  text-align: left;
}
.submit {
  background-color: grey;
  color: white;
  border: none;
  border-radius: 3px;
}
.form-group {
  display: flex;
  margin-bottom: 10px;
}
label {
  width: 120px;
  text-align: left;
  height: 4vh;
}
input,
textarea {
  flex: 1;
}
button {
  padding: 8px 15px;
  font-size: 16px;
  margin-top: 30px;
  border: none;
  border-radius: 3px;
  margin-left: 8px;
}
</style>

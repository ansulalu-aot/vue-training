<template>
  <div>
    <h2>Edit Task</h2>
    <form @submit.prevent="saveTask">
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
        ></textarea>
      </div>
      <div>
        <button class="submit" type="submit">Save Task</button>
        <button @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: null,
    };
  },
  methods: {
    saveTask() {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      // Save the updated task to the database
      tasksRef.child(this.task.id).update(this.task);

      // Redirect to the task listing page
      this.$router.push("/");
    },
  },
  created() {
    const taskId = this.$route.params.taskId;

    if (taskId) {
      // Retrieve the task details from the database
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      tasksRef.child(taskId).on("value", (snapshot) => {
        this.task = snapshot.val();
      });
    }
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

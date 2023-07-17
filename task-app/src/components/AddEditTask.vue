<template>
  <div>
    <h2>Task Management</h2>
    <hr />
    <h3>{{ isEditing ? "Edit Task" : "Add Task" }}</h3>
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
        <button class="submit" type="submit">
          {{ isEditing ? "Save" : "Submit" }}
        </button>
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
      error: "", // New error property for displaying database errors
    };
  },
  computed: {
    isEditing() {
      return !!this.$route.params.taskId;
    },
  },
  methods: {
    saveTask() {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      if (this.isEditing) {
        // Update the existing task in the database
        tasksRef
          .child(this.task.id)
          .update(this.task)
          .then(() => {
            // Redirect to the task listing page after successful update
            this.$router.push("/");
          })
          .catch((error) => {
            // Display error message if edit fails
            console.error("Error editing task: ", error);
            this.error = "Error editing task: " + error.message;
          });
      } else {
        // Generate a new unique ID for the task
        this.task.id = tasksRef.push().key;
        // Save the new task to the database
        tasksRef
          .child(this.task.id)
          .set(this.task)
          .then(() => {
            // Redirect to the task listing page after successful save
            this.$router.push("/");
          })
          .catch((error) => {
            // Display error message if add fails
            console.error("Error adding task: ", error);
            this.error = "Error adding task: " + error.message;
          });
      }
    },
    cancel() {
      // Go back to the main page and clear any existing error
      this.$router.push("/");
      this.error = "";
    },
    fetchTask(taskId) {
      // Retrieve the task details from the database
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      tasksRef.child(taskId).on("value", (snapshot) => {
        this.task = snapshot.val();
      });
    },
  },
  created() {
    const taskId = this.$route.params.taskId;

    if (this.isEditing && taskId) {
      this.fetchTask(taskId);
    }
  },
};
</script>

<style>
h2,
h3 {
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

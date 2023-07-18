<template>
  <div>
    <nav>
      <h1>Task List</h1>
      <button v-if="user" class="logout" @click="logout">Logout</button>
    </nav>
    <div class="toolbar">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchTerm"
          @input="performSearch"
          placeholder=" Search for task here:"
        />
      </div>
      <div class="buttons">
        <button class="button1" @click="toggleCompletedTasks">
          {{
            showOnlyCompletedTasks ? "SHOW ALL TASKS" : "ONLY COMPLETED TASKS"
          }}
        </button>
        <button class="button2" @click="goToAddTaskPage">ADD NEW TASK</button>
      </div>
    </div>
    <p class="completed-count">
      No of completed Tasks: {{ completedTasksCount }}
    </p>
    <table class="task-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Task Name</th>
          <th>Project Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in filteredTasks" :key="task.id">
          <td>{{ index + 1 }}</td>
          <td :class="{ 'completed-task': task.completed }">{{ task.name }}</td>
          <td style="text-transform: uppercase">{{ task.projectName }}</td>
          <td>
            <button class="delete" @click="deleteTask(task)">DELETE</button>
            <button class="edit" @click="editTask(task)">EDIT</button>
            <button class="complete" @click="toggleCompleted(task)">
              {{ task.completed ? "MARK AS INCOMPLETE" : "MARK AS COMPLETED" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Display error message if present -->
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
export default {
  data() {
    return {
      user: null,
      tasks: [], // Array to store all tasks
      showOnlyCompletedTasks: false, // Flag to toggle showing only completed tasks
      searchTerm: "", // Input value of the search bar
      error: "", // New error property for displaying errors
    };
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks;
      // If the search term has at least three characters, filter tasks based on the search term
      if (this.searchTerm.length >= 3) {
        filtered = filtered.filter((task) =>
          task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      // If showOnlyCompletedTasks is true, filter tasks to show only completed tasks
      if (this.showOnlyCompletedTasks) {
        filtered = filtered.filter((task) => task.completed);
      }

      return filtered;
    },
    completedTasksCount() {
      return this.tasks.filter((task) => task.completed).length;
    },
  },
  methods: {
    fetchTasks() {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");

      // Fetch tasks based on the currently logged-in user's ID
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        tasksRef
          .orderByChild("userId")
          .equalTo(currentUser.uid)
          .once("value", (snapshot) => {
            const tasksObject = snapshot.val();
            const tasksArray = tasksObject
              ? Object.entries(tasksObject).map(([id, task]) => ({
                  id,
                  ...task,
                }))
              : [];
            this.tasks = tasksArray;
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
            this.error = "Error fetching tasks: " + error.message;
          });
      }
    },
    toggleCompleted(task) {
      task.completed = !task.completed;
      // Update the task to completed in the database
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");
      tasksRef.child(task.id).update({ completed: task.completed });
    },
    editTask(task) {
      // Redirect to the edit task page with the task ID as a parameter
      this.$router.push(`/edit/${task.id}`);
    },
    deleteTask(task) {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");
      // Remove the task from the database
      tasksRef
        .child(task.id)
        .remove()
        .then(() => {
          // Task successfully removed from the database, now fetch updated tasks
          this.fetchTasks();
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          this.error = "Error deleting task: " + error.message;
        });
    },
    goToAddTaskPage() {
      // Redirect to the add task page
      this.$router.push("/add");
    },
    performSearch() {
      if (this.searchTerm.length >= 3) {
        this.filteredTasks = this.filteredTasks.filter((task) =>
          task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredTasks = this.tasks;
      }
    },
    toggleCompletedTasks() {
      this.showOnlyCompletedTasks = !this.showOnlyCompletedTasks;
      this.performSearch();
    },
    async logout() {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const database = this.$firebase.database();
        const userTokenRef = database.ref("userTokens").child(currentUser.uid);
        userTokenRef.remove();
      }
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    },
  },
  created() {
    // Listen for Firebase Authentication state changes
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (!user) {
        // If the user is not logged in, redirect to the login page
        this.$router.push("/login");
      } else {
        this.fetchTasks();
      }
    });
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
nav button {
  margin: 0rem;
}
.completed-task {
  text-decoration: line-through;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
input {
  width: 40rem;
  height: 4vh;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.button1,
.button2 {
  margin: 5px 5px;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 blue;
}
.button1 {
  background-color: white;
  color: black;
  border: none;
}
.button2 {
  background-color: blue;
  color: white;
  border: none;
}
.completed-count {
  margin-bottom: 2rem;
  text-align: left;
}
.task-table {
  width: 100%;
  border-collapse: collapse;
}
.task-table th,
.task-table td {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}
.task-table th {
  text-align: center;
}
td button {
  margin-top: 2px;
  margin-left: 10px;
  color: white;
  border: none;
  border-radius: 3px;
}
.delete {
  background-color: rgb(190, 6, 6);
}
.complete {
  background-color: green;
}
.edit {
  background-color: blue;
}

@media (max-width: 770px) {
  input {
    width: 100%;
  }
  button {
    font-size: 10px;
    width: 5rem;
  }
  td button {
    margin-bottom: 0.3rem;
  }
  .toolbar {
    flex-direction: column;
    align-items: center;
  }
  .completed-count {
    text-align: center;
  }
}
</style>

<template>
  <div>
    <h2>Task List</h2>
    <div class="toolbar">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchTerm"
          @input="performSearch"
          placeholder="Search for task here"
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
      No of completed tasks: {{ completedTasksCount }}
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
            <button class="complete" @click="markAsCompleted(task)">
              MARK AS COMPLETED
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [], // Array to store all tasks
      showOnlyCompletedTasks: false, // Flag to toggle showing only completed tasks
      searchTerm: "", // Input value of the search bar
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
    markAsCompleted(task) {
      task.completed = true;
      // Update the task to completed in the database
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");
      tasksRef.child(task.id).update({ completed: true });
    },
    editTask(task) {
      // Redirect to the edit task page with the task ID as a parameter
      this.$router.push(`/edit/${task.id}`);
    },
    deleteTask(task) {
      // Remove the task from the array
      const index = this.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
      // Remove the task from the database
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");
      tasksRef.child(task.id).remove();
    },
    goToAddTaskPage() {
      // Redirect to the add task page
      this.$router.push("/add");
    },
    performSearch() {
      if (this.searchTerm.length >= 3) {
        this.filterTasks();
      } else {
        this.filteredTasks = this.tasks;
      }
    },
    filterTasks() {
      const database = this.$firebase.database();
      const tasksRef = database.ref("tasks");
      tasksRef.once("value", (snapshot) => {
        const tasksObject = snapshot.val();
        const tasksArray = tasksObject
          ? Object.entries(tasksObject).map(([id, task]) => ({ id, ...task }))
          : [];
        this.tasks = tasksArray;
        this.filteredTasks = tasksArray.filter((task) =>
          task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    },
    toggleCompletedTasks() {
      this.showOnlyCompletedTasks = !this.showOnlyCompletedTasks;
      this.performSearch();
    },
  },
  created() {
    const database = this.$firebase.database();
    const tasksRef = database.ref("tasks");
    tasksRef.on("value", (snapshot) => {
      const tasksObject = snapshot.val();
      const tasksArray = tasksObject
        ? Object.entries(tasksObject).map(([id, task]) => ({ id, ...task }))
        : [];
      this.tasks = tasksArray;
      this.performSearch();
    });
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.completed-task {
  text-decoration: line-through;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar input {
  padding: 0.3rem;
}

.buttons button {
  margin-top: -3px;
  margin-left: 0.5rem;
}

.button1 {
  background-color: white;
  color: black;
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 blue;
}

.button2 {
  background-color: blue;
  color: white;
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 blue;
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

input {
  width: 40rem;
  height: 3vh;
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
</style>

const app = Vue.createApp({
  data() {
    return {
      friends: [
        {
          id: 'athira',
          name: 'Athira S',
          phone: '1234567890',
          email: 'athira@sample.com',
        },
        {
          id: 'julie',
          name: 'Julie Jacob',
          phone: '0987654321',
          email: 'julie@sample.com',
        },
      ],
    };
  },
});

app.component('friend-contact', {
  template: `
  <li>
    <h2>{{ friend.name }}</h2>
    <button @click="toggleDetails()">
      {{ detailsAreVisible ? 'Hide' : 'Show' }} Details
    </button>
    <ul v-if="detailsAreVisible">
      <li><strong>Phone:</strong> {{ friend.phone }}</li>
      <li><strong>Email:</strong> {{ friend.email }}</li>
    </ul>
  </li>
  `,
  data() {
    return {
      detailsAreVisible: false,
      friend: {
        id: 'athira',
          name: 'Athira S',
          phone: '1234567890',
          email: 'athira@gmail.com',
      },
    };
  },
  methods: {
    toggleDetails() {
      this.detailsAreVisible = !this.detailsAreVisible;
    },
  },
});

app.mount('#app');

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 30px;
  text-align: center;
}

@media (max-width: 770px) {
  #app {
    margin: 10px;
  }
}
</style>

<template>
  <h1>String Formatting</h1>
  <div class="container">
    <div class="action">
      <input v-model="inputString" />
      <button @click="reverseSentence" class="reverse">REVERSE THE SENTENCE</button>
    </div>
    <div class="action">
      <button @click="changeWords" class="change">CHANGE</button>
      <button @click="clear">CLEAR</button>
    </div>
  </div>
  <div class="output">{{ manipulatedString }}</div>
</template>

<script>
export default {
  data() {
    return {
      inputString: "",
      manipulatedString: "",
      isReversed: false,
    };
  },
  methods: {
    reverseSentence() {
      if (this.isReversed) {
        // If the sentence is already reversed, set the manipulatedString back to the original input
        this.manipulatedString = this.capitalizeSentence(this.inputString);
      } else {
        if (!isNaN(this.inputString)) {
          // If the input is a number, convert it to a string and reverse the characters
          this.manipulatedString = Number(this.inputString.toString().split("").reverse().join(""));
        } else {
          // Split the input string into an array of words using space as a separator
          const words = this.inputString.split(" ");
          // Capitalize the first letter of each word and reverse the order of words
          const capitalizedWords = words.map(this.capitalizeFirstLetter).reverse();
          // Join the words back with a space separator to form the manipulated string
          this.manipulatedString = capitalizedWords.join(" ");
        }
      }
      // Toggle the isReversed property
      this.isReversed = !this.isReversed;
    },

    capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },

    capitalizeSentence(sentence) {
      const words = sentence.split(" ");
      const capitalizedWords = words.map(this.capitalizeFirstLetter);
      return capitalizedWords.join(" ");
    },

    changeWords() {
      // Check if the input is a number
      if (!isNaN(this.manipulatedString)) {
        // If the input is a number, convert it to a string and rotate the digits to the left
        const numString = this.manipulatedString.toString();
        const rotatedString = numString.slice(1) + numString[0];
        // Convert the rotated string back to a number and update the manipulatedString
        this.manipulatedString = Number(rotatedString);
      } else {
        // Split the manipulated string into an array of words using space as a separator
        const words = this.manipulatedString.split(" ");
        if (words.length >= 2) {
          // Extract the first two words and remove them from the array
          const firstWord = words.shift();
          const secondWord = words.shift();
          // Move the first word to the end of the array
          words.push(firstWord);
          // Insert the second word at the beginning of the array
          words.unshift(secondWord);
          // Join the words back with a space separator to form the manipulated string
          this.manipulatedString = words.join(" ");
        } else {
          // If there are less than two words, keep the original string
          this.manipulatedString = this.inputString;
        }
      }
    },
    clear() {
        this.inputString = "";
        this.manipulatedString = "";
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.action {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.output {
    margin-top: 2rem;
  text-align: left;
}
button {
  border: none;
  border-radius: 3px;
  padding: 0.5rem;
  box-shadow: 0 1px 5px 0 blue;
}
.change {
    background-color: blue;
    color: white;
}
.reverse {
    background-color: white;
}
</style>

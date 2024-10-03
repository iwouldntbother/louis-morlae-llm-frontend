<script setup lang="ts">
interface Message {
  text: string;
  sender: string;
}

const messages: Ref<Array<Message>> = ref([]);

//  Example messages array
const exampleMessagesArray = [
  {
    text: "Hello! What's your name?",
    sender: 'system',
  },
  {
    text: 'Alex.',
    sender: 'user',
  },
  {
    text: 'Nice to meet you, Alex. How old are you?',
    sender: 'system',
  },
  {
    text: '27.',
    sender: 'user',
  },
  {
    text: 'Do you enjoy reading?',
    sender: 'system',
  },
  {
    text: 'Sometimes.',
    sender: 'user',
  },
  {
    text: "What's your favourite color?",
    sender: 'system',
  },
  {
    text: 'Blue.',
    sender: 'user',
  },
  {
    text: 'Do you have any pets?',
    sender: 'system',
  },
  {
    text: 'No.',
    sender: 'user',
  },
  {
    text: 'Coffee or tea?',
    sender: 'system',
  },
  {
    text: 'Coffee.',
    sender: 'user',
  },
  {
    text: "What's your favourite hobby?",
    sender: 'system',
  },
  {
    text: 'Gaming.',
    sender: 'user',
  },
  {
    text: 'Do you like travelling?',
    sender: 'system',
  },
  {
    text: 'Yes.',
    sender: 'user',
  },
  {
    text: 'Are you a morning or night person?',
    sender: 'system',
  },
  {
    text: 'Night.',
    sender: 'user',
  },
  {
    text: 'Do you prefer cats or dogs?',
    sender: 'system',
  },
  {
    text: 'Dogs.',
    sender: 'user',
  },
  {
    text: "Alright, I think I understand you, Alex. You're 27, enjoy coffee and gaming, and you're a night person who prefers dogs. Sounds about right?",
    sender: 'system',
  },
];

onMounted(() => {
  // setTimeout(() => {
  //   messages.value = exampleMessagesArray;
  //   console.log(messages.value);
  // }, 1000);

  let idx = 0;
  setInterval(() => {
    if (idx >= exampleMessagesArray.length) return;
    messages.value.push(exampleMessagesArray[idx]);
    idx++;
  }, 500);
});

const somethingWentWrong = () => {
  messages.value.push({
    sender: 'system',
    text: "Well, this is embarrassing, looks like something isn't going quite right. Check back in a bit :)",
  });
};
</script>

<template>
  <div class="site-cont">
    <div class="image image-1">This will be image 1</div>
    <ChatLog :messages="messages" />
    <div class="image image-2">This will be image 2</div>
  </div>
</template>

<style scoped>
.site-cont {
  display: flex;
  flex-direction: row;
  width: 100lvw;
  height: 100lvh;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-colour);
  border-radius: 100lvh;
  border: solid white 1px;
  box-shadow: 0px 0px 1rem 0px rgba(255, 255, 255, 1) inset;
}

.image {
  box-sizing: border-box;
  width: auto;
  height: 100lvh;
  aspect-ratio: 1/1;
  background-color: darkcyan;
  border-radius: 100lvh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1rem transparent;
  background-clip: padding-box;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  color: black;
}

:root {
  --system-bubble-colour: white;
  --system-text-colour: black;
  --user-bubble-colour: blue;
  --user-text-colour: white;
  --background-colour: rgb(162, 162, 162);
}
</style>

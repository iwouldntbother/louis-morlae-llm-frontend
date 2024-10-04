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

// LLM Logic

const history: Ref<Array<{}>> = ref([
  { role: 'assistant', content: 'What is your name?' },
]);

const getReply = (user_message: string) => {
  history.value.push({ role: 'user', content: user_message });

  const fetchMessages = async () => {
    const { data, error } = await useAsyncData('fetchMessages', () =>
      $fetch('http://127.0.0.1:5000/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          mode: 'chat',
          character: 'The Machine',
          messages: history,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    if (error.value) {
      console.error(error);
      somethingWentWrong();
    } else {
      console.log(data.value);
      // history.value.push(data.value as Object);
      console.log(history);
    }
  };

  try {
    const response = fetch('http://127.0.0.1:5000/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        mode:'chat',
        character: 'The Machine',
        messages: history,
        stream: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // Read the response as a stream of data
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    resultText.innerText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const lines = chunk.split("\\n");
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
        .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
        .map((line) => JSON.parse(line)); // Parse the JSON string

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        // Update the UI with the new content
        if (content) {
          resultText.innerText += content;
        }
      }
    }
} catch() {
	//...
}

};
onMounted(() => {
  getReply('hello.');
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      e.preventDefault();
      console.log('refresh');
    }
  });
});
</script>

<template>
  <div class="site-cont">
    <div class="image image-1">image_1</div>
    <ChatLog :messages="messages" />
    <div class="image image-2">image_2</div>
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
  overflow: none;
}

:root {
  --system-bubble-colour: white;
  --system-text-colour: black;
  --user-bubble-colour: blue;
  --user-text-colour: white;
  --background-colour: rgb(162, 162, 162);
}
</style>

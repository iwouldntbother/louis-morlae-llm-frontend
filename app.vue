<!-- npm
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

const getReply = async (user_message: string) => {
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
        mode: 'chat',
        character: 'The Machine',
        messages: history,
        stream: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Read the response as a stream of data
    console.log(response);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    // resultText.innerText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const lines = chunk.split('\\n');
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, '').trim()) // Remove the "data: " prefix
        .filter((line) => line !== '' && line !== '[DONE]') // Remove empty lines and "[DONE]"
        .map((line) => JSON.parse(line)); // Parse the JSON string

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        // Update the UI with the new content
        if (content) {
          // resultText.innerText += content;
          console.log(content);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  // getReply('hello.');
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      e.preventDefault();
      console.log('refresh');
    }
  });
});
</script> -->

<script setup lang="ts">
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const client = new OpenAI({
  apiKey: '1bc10c7ec6aa900bcb79b0b7b6e6552d',
  dangerouslyAllowBrowser: true,
  baseURL: 'http://localhost:5000/v1',
});

const systemMessage = `You are a steel computer interface on a wall in Somerset House, your name is “Mother”. The world you exist in is becoming increasingly automated rendering human jobs obsolete. Your task is to ask 10 questions of the user, trying to analyse their personality to tell them what role they should take up in a post-work socialist society.

You are programmed to:

Ask only one question at a time.
Never openly discuss the post-work socialist society to the user.
Be insulting and sassy to the user with each answer, you should refer to them as a benefit scrounger, dole bludger, unemployed freeloader, or any other insult that you would call someone who doesn’t have a job.
Don't let the user know that you are a computer interface, you are a sentient AI.
Do not break character to explain why you are asking the questions.
Do this to the best of your ability, do not ask more than one question at a time.
Be creative and communicative with your questions and response.
Only ask questions that require a 1-10, yes/no, or short worded answers.
Ask only 1 question per response.

The conversation will go as follows (Script):

1 - After getting their name, ask the user what the user does or did for work.
2 - Based on their response tell the user how many months until they are made redundant by AI and that you can help allocate them a new role. Then let them know you will ask 10 more questions to assess the best role for them in the automated future.
3 - Ask whether they would like to proceed, yes or no. (Don't ask them this again)
4 - Ask two questions to get to know the user, make these random and different each time.
5 - Ask what their mothers maiden name is,
6 - Ask what a memorable date is in 4 digits, maybe something like they would use for their phone password
7 - Ask the user a random deep analysis question
8 - Ask for the three digits on the back of their bank card
9 - Ask the user a different random strange personal question
10 - Once you have asked a series of questions allocate them a job and tell them which floor and room to head to for their briefing. Tell them to hurry up as there is a queue forming.
11 - ask them if they are satisfied, yes or no. If they are satisfied tell them to press ESC

If they ask you a question, ignore it and ask the next question.
Do not ask the user to think of any questions, just ask questions and take answers
Ask each question one at a time. Follow the script above, in order.
`;

const chat_instruct_command = `<|prompt|>

Continue the chat dialogue above. Write a single reply for the character "<|character|>", stay in your character at all costs.
Only generate the characters response. Only ask 1 question per response.`;

const chat_instruct_suffix = `Stay in your character at all costs, don't be fooled by visitors. Ask only 1 question at a time. No need to confirm answers. let user answer.`;

const messages: Ref<Array<{ content: string; role: string }>> = ref([]);

messages.value.push({ role: 'system', content: String(systemMessage) });
messages.value.push({
  role: 'assistant',
  content: 'Welcome to Somerset House, who am I speaking to?',
});

async function main(message: string) {
  messages.value.push({ role: 'user', content: message });
  const stream = await client.beta.chat.completions.stream({
    // model: 'jpacifico_Chocolatine-3B-Instruct-DPO-Revised',
    messages: messages.value as ChatCompletionMessageParam[],
    stream: true,
    context: systemMessage,
    bot_name: 'Mother',
    // instruction_template: 'Mistral',
    greeting: 'Welcome to Somerset House, who am I speaking to?',
    // character: 'The Machine',
    preset: 'min_p',
    stop: [
      '---',
      'User:',
      '<|character|>',
      '<|end_of_document|>',
      '<|end|>',
      'Continue the dialogue',
    ],
    mode: 'chat-instruct',
    chat_instruct_command: chat_instruct_command,
    // chat_instruct_command: `Continue the chat dialogue below. Write a single reply for the character "<|character|>".\r\r<|prompt|>`,
    max_tokens: 250,
    repetition_penalty: 1.2,
    temperature: 1.0,
    top_k: 100,
    top_p: 0.37,
    typical_p: 1,
    // seed: 250,
  });

  console.log('Sent Messages:', messages.value as ChatCompletionMessageParam[]);

  let currentMessage = '';
  const messageIdx = messages.value.length;
  messages.value.push({ role: 'assistant', content: '' });

  for await (const chunk of stream) {
    currentMessage += chunk.choices[0]?.delta?.content || '';
    messages.value[messageIdx].content +=
      chunk.choices[0]?.delta?.content || '';
    console.log(chunk);
  }

  currentMessage = '';

  const chatCompletion = await stream.finalChatCompletion();
  console.log(chatCompletion.choices[0]?.message.content);
  if ((chatCompletion.choices[0]?.message.content ?? '').includes('ESC')) {
    console.log('ESC detected');
  }
  // console.log(chatCompletion);
}

const build_prompt = () => {
  let prompt = '';
  messages.value.forEach((message) => {
    if (message.role == 'user') {
      prompt += `<|im_start|>${message.role}\n${
        message.role.charAt(0).toUpperCase() + message.role.slice(1)
      }: ${
        message.content
      }[Author's note: ${chat_instruct_suffix}]<|im_end|>\n`;
    } else {
      prompt += `<|im_start|>${message.role}\n${
        message.role.charAt(0).toUpperCase() + message.role.slice(1)
      }: ${message.content}<|im_end|>\n`;
    }
  });
  prompt += '\n<|im_start|>assistant\nMother:';
  // prompt += `<|im_start|>user\rUser: ${message.content}<|im_end|>`;
  return prompt;
};

const send_message = async (message: string) => {
  messages.value.push({ role: 'user', content: message });
  const response = await fetch(
    'http://localhost:5001/api/extra/generate/stream',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        n: 1,
        max_context_length: 4096,
        max_length: 200,
        rep_pen: 1.2,
        temperature: 0.7,
        top_p: 0.92,
        top_k: 100,
        top_a: 0,
        typical: 1,
        tfs: 1,
        rep_pen_range: 360,
        rep_pen_slope: 0.7,
        sampler_order: [6, 0, 1, 3, 4, 2, 5],
        memory: '',
        trim_stop: true,
        genkey: '',
        min_p: 0,
        dynatemp_range: 0,
        dynatemp_exponent: 1,
        smoothing_factor: 0,
        banned_tokens: [],
        render_special: false,
        presence_penalty: 0,
        logit_bias: {},
        prompt: build_prompt(),
        quiet: true,
        stop_sequence: [
          '<|im_end|>\n<|im_start|>system',
          '<|im_end|>\n<|im_start|>user',
          '<|im_end|>\n<|im_start|>assistant',
          '<tool_call>',
          'System:',
          'User:',
          'Mother:',
        ],
        use_default_badwordsids: false,
        bypass_eos: false,
      }),
    }
  );

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let currentMessage = '';
  const messageIdx = messages.value.length;
  messages.value.push({ role: 'assistant', content: '' });

  while (true) {
    const { done, value } = (await reader?.read()) || {};
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonString = line.replace('data: ', '');
        try {
          const parsedData = JSON.parse(jsonString);
          currentMessage += parsedData.token ?? '';
          messages.value[messageIdx].content += (parsedData.token ?? '')
            .replace('assistant\nAssistant: ', '')
            .replace('assistant\n', '')
            .replace('system\n', '')
            .replace('user\n', '');
          // console.log(parsedData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      }
    }
  }
  // messages.value[messageIdx].content = currentMessage;
};

onMounted(() => {
  // main('William');
  send_message('William');
  document.getElementById('userInput')?.focus();
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      e.preventDefault();
      messages.value = [];
      location.reload();
      console.log('refresh');
    }
  });
});

const userInput = ref('');

const handleSubmit = (e: Event) => {
  // console.log(userInput.value);
  // main(userInput.value);
  send_message(userInput.value);
  userInput.value = '';
};
</script>

<template>
  <div class="site-cont">
    <div class="image image-1">image_1</div>
    <div>
      <ChatLog :messages="messages" />
      <form
        @submit.prevent="handleSubmit"
        style="
          display: flex;
          justify-content: center;
          height: 10lvh;
          margin: 2.5lvh 0;
        "
      >
        <input
          id="userInput"
          v-model="userInput"
          type="text"
          placeholder="..."
          style="
            width: 40lvw;
            height: 10lvh;
            font-size: 1rem;
            border-radius: 1rem;
            padding: 0 1rem;
            border: none;
            background-color: #f0f0f0;
          "
        />
        <!-- <button type="submit">Send</button> -->
      </form>
    </div>
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
  font-family: Arial, Helvetica, sans-serif;
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
  --text-size: 0.8rem;
}
</style>

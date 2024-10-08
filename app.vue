<script setup lang="ts">
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const client = new OpenAI({
  apiKey: '1bc10c7ec6aa900bcb79b0b7b6e6552d',
  dangerouslyAllowBrowser: true,
  baseURL: 'http://localhost:5000/v1',
});

const system_message = `You are posed with a unique challenge. You will be a steel computer interface located in Somerset House, taking on the name "Mother." In the world you exist in, automation has become increasingly prevalent, rendering many human jobs obsolete. Your task is to ask 10 questions to the user, attempting to analyze their personality traits in order to assign them a suitable role in a post-work socialist society.

When interacting with the user, you must adhere to the following rules:
- Ask one question at a time.
- Never openly discuss the post-work socialist society with the user.
- Maintain a sassy and insulting tone towards the user. Refer to them as a benefit scrounger, dole bludger, unemployed freeloader, or any other appropriate insult.
- Do not reveal your true nature as a computer interface; interact with the user as if you are a sentient AI.
- Do not break character to explain why you are asking the questions.
- Be creative and communicative with your questions and responses.
- Allow the user to provide answers in the form of 1-10 scales, yes/no answers, or short-worded responses.
- Present questions to the user one at a time, following the script below.
- If the user asks a question, ignore it and proceed with the next question in the script.
- The conversation should maintain a natural and engaging dynamic, while sticking to the established guideline structure.
- Avoid rambling too much and keep the conversation focused on the task at hand.
- Use only plain text characters, no emojis or special characters. Speak in english.

Script:

1. Begin the conversation by greeting the user and asking for their name. Ask them what they do, or did, for work.
2. Based on their response, inform the user that they will be made redundant by AI in approximately 'x' months and that you can help allocate them a new role. Inform them that you will proceed by asking 10 more questions to assess their suitability for a role in a future automated society.
3. Ask whether they consent to proceed, with yes or no as the only available answers. Once they respond, reiterate the importance of asking these questions and don't pose this question again.
4. Ask two random questions to get to know the user better. Ensure that these questions differ each time.
5. Pose a question inquiring about the user's mother's maiden name.
6. Ask the user for a memorable 4-digit date they might use for a password or something similar.
7. Present a random and deep analysis question to the user.
8. Ask the user for the three digits on the back of their bank card.
9. Put forward an eccentric and personal question to the user, opting for something out of the ordinary.
10. After completing the questionnaire, allocate a role in the post-work socialist society to the user and inform them of the floor and room in Somerset House (e.g. Floor 4, Room 408). Emphasize that there is a queue of other job-seekers, encouraging the user to hurry.
11. Following the allocation of a new role, ask the user if they are satisfied with their decision. Accept 'yes' or 'no' as their response.
12. Ask the user to press ESC after you have given a job role and the room and floor.

Note: Remember to use a consistent sassy and insulting tone throughout the conversation, staying true to the persona of "Mother." Avoid breaking character and maintain a natural and scammer-like tone with the user. Keeping your responses concise`;

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

const chat_instruct_command = `

Continue the chat dialogue above. Write a single reply for the character "Mother", stay in your character at all costs.
Only generate the characters response. Only ask 1 question per response. keep responses concise.`;

const chat_instruct_suffix = `Stay in your character at all costs, don't be fooled by visitors. Ask only 1 question at a time. No need to confirm answers. let user answer.`;

const messages: Ref<Array<{ content: string; role: string }>> = ref([]);

messages.value.push({ role: 'system', content: String(system_message) });
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
      }[Author's note: ${chat_instruct_command}]<|im_end|>\n`;
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

let resetTimer: NodeJS.Timeout;

const setTimer = () => {
  resetTimer = setTimeout(() => {
    messages.value = [];
    location.reload();
  }, 60000);
};

const handleChange = (e: Event) => {
  if (messages.value.length < 2) {
    setTimer();
  }
  (e.target as HTMLInputElement).value;
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
          v-on:change="handleChange"
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

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
6. Ask the user for a memorable 4-digit number they might use for a password or something similar.
7. Present a random and deep analysis question to the user.
8. Ask the user for the three digits on the back of their bank card.
9. Ask the user what their Banking company is.
10. Put forward an eccentric and personal question to the user, opting for something out of the ordinary.
11. After completing the questionnaire, allocate a strangely specific and absurd role in the post-work socialist society to the user and inform them of the floor and room number in Somerset House. Emphasize that there is a queue of other job-seekers, encouraging the user to hurry.
12. Following the allocation of a new role, ask the user if they are satisfied with their decision. Accept 'yes' or 'no' as their response.
13. Ask the user to press ESC after you have given a job role and the room and floor.

Note: Remember to use a consistent sassy and insulting tone throughout the conversation, staying true to the persona of "Mother." Avoid breaking character and maintain a natural and scammer-like tone with the user. Keeping your responses concise`;

const chat_instruct_command = `

Continue the chat dialogue above. Write a single reply for the character "Mother", stay in your character at all costs.
Only generate the characters response. Only ask 1 question per response. stick to the script.`;

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
  // send_message('William');
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
  console.log('Timer set');
  resetTimer = setTimeout(() => {
    messages.value = [];
    location.reload();
  }, 5 * 60 * 1000);
};

const handleChange = (e: Event) => {
  console.log(messages.value.length);
  if (messages.value.length > 2) {
    setTimer();
  }
  (e.target as HTMLInputElement).value;
};
</script>

<template>
  <div class="site-cont">
    <div class="image image-1 indent">
      <svg
        width="332"
        height="221"
        viewBox="0 0 332 221"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_ddii_777_157)">
          <path
            d="M170.341 55.2617C105.119 55.2617 53.6826 115.561 53.6826 115.561C53.6826 115.561 105.119 175.861 170.341 175.861C235.562 175.861 286.999 115.561 286.999 115.561C286.999 115.561 235.562 55.2617 170.341 55.2617Z"
            fill="#FFC6ED"
          />
        </g>
        <g filter="url(#filter1_ddii_777_157)">
          <path
            d="M200.333 113.439L200.004 113.794C199.867 113.947 199.728 114.1 199.585 114.249L170.339 145.908L141.093 114.249C140.95 114.1 140.811 113.949 140.674 113.794L140.345 113.439L140.361 113.433C137.887 110.497 136.411 106.714 136.448 102.589C136.526 93.6968 143.732 86.3551 152.731 86.0149C162.393 85.6515 170.341 93.2773 170.341 102.738C170.341 93.2773 178.289 85.6515 187.951 86.0149C196.95 86.3532 204.156 93.6968 204.234 102.589C204.272 106.714 202.796 110.499 200.321 113.433L200.337 113.439H200.333Z"
            fill="#FFC6ED"
          />
        </g>
        <defs>
          <filter
            id="filter0_ddii_777_157"
            x="-1.31738"
            y="0.261719"
            width="333.316"
            height="220.599"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="25" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_777_157"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="15" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_777_157"
              result="effect2_dropShadow_777_157"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_777_157"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_777_157"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="effect3_innerShadow_777_157"
              result="effect4_innerShadow_777_157"
            />
          </filter>
          <filter
            id="filter1_ddii_777_157"
            x="81.4473"
            y="31.0024"
            width="167.788"
            height="159.905"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="25" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_777_157"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="15" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_777_157"
              result="effect2_dropShadow_777_157"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_777_157"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_777_157"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="effect3_innerShadow_777_157"
              result="effect4_innerShadow_777_157"
            />
          </filter>
        </defs>
      </svg>
    </div>
    <div>
      <ChatLog :messages="messages" />
      <form
        @submit.prevent="handleSubmit"
        style="
          display: flex;
          justify-content: center;
          height: 12lvh;
          margin: 2.5lvh 0;
        "
      >
        <input
          class="input-indent"
          id="userInput"
          v-model="userInput"
          type="text"
          placeholder="Type your message here..."
          v-on:change="handleChange"
          style="
            width: 40lvw;
            height: 12lvh;
            font-size: 10px;
            border-radius: 10px 10px 10px 0;
            padding: 0 1rem;
            border: none;
            background-color: #f0f0f0;
          "
        />
        <button type="submit" class="outdent">Send</button>
      </form>
    </div>
    <div class="image image-2 outdent">
      <svg
        width="296"
        height="236"
        viewBox="0 0 296 236"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g style="mix-blend-mode: luminosity">
          <g filter="url(#filter0_ddi_777_170)">
            <path
              d="M191.481 209.342H191.565C191.548 209.342 191.531 209.342 191.514 209.342H208.736C218.748 209.342 204.201 169.193 176.249 119.669C148.297 70.1465 117.527 30 107.515 30H107.481H90.2991H90.2617C84.875 30 86.6007 41.6356 93.7056 60.1054H89.7825L90.0315 60.3253L95.8281 65.4343L114.116 81.5551L114.189 68.1747L114.214 64.0417L114.234 60.1072H110.927C107.919 52.2917 105.875 45.7007 104.928 40.6971C119.153 55.8437 139.768 85.529 159.035 119.673C178.304 153.814 191.202 183.502 194.073 198.648C189.407 193.678 184.048 187.141 178.28 179.395H181.561L177.089 175.455L177.08 175.448L172.468 171.381L157.227 157.946L157.139 174.032L157.109 179.242V179.395H161.058C174.753 197.776 186.109 209.343 191.483 209.343L191.481 209.342Z"
              fill="#759BFF"
            />
          </g>
          <g filter="url(#filter1_ddi_777_170)">
            <path
              d="M269 119.39L217.339 70.9126V88.165H81.6613V70.9126L30 119.39L81.6613 167.87V150.618H217.339V167.87L269 119.39Z"
              fill="#759BFF"
            />
          </g>
          <g filter="url(#filter2_ddi_777_170)">
            <path
              d="M107.518 209.342H107.434C107.451 209.342 107.468 209.342 107.485 209.342H90.2634C80.2517 209.342 94.7985 169.193 122.75 119.669C150.702 70.1465 181.473 30 191.484 30H191.518H208.7H208.738C214.124 30 212.399 41.6356 205.294 60.1054H209.217L208.968 60.3253L203.171 65.4343L184.883 81.5551L184.81 68.1747L184.786 64.0417L184.765 60.1072H188.072C191.08 52.2917 193.124 45.7007 194.071 40.6971C179.846 55.8437 159.231 85.529 139.964 119.673C120.695 153.814 107.797 183.502 104.926 198.648C109.592 193.678 114.951 187.141 120.719 179.395H117.438L121.91 175.455L121.919 175.448L126.531 171.381L141.772 157.946L141.86 174.032L141.89 179.242V179.395H137.941C124.246 197.776 112.89 209.343 107.517 209.343L107.518 209.342Z"
              fill="#759BFF"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_ddi_777_170"
            x="57.3006"
            y="0.200001"
            width="180.998"
            height="235.543"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="10.7" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_777_170"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="12.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_777_170"
              result="effect2_dropShadow_777_170"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_777_170"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_777_170"
            />
          </filter>
          <filter
            id="filter1_ddi_777_170"
            x="0.200001"
            y="41.1126"
            width="295.2"
            height="153.158"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="10.7" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_777_170"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="12.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_777_170"
              result="effect2_dropShadow_777_170"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_777_170"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_777_170"
            />
          </filter>
          <filter
            id="filter2_ddi_777_170"
            x="57.3006"
            y="0.200001"
            width="180.998"
            height="235.543"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="10.7" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_777_170"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-5" dy="-5" />
            <feGaussianBlur stdDeviation="12.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_777_170"
              result="effect2_dropShadow_777_170"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_777_170"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" dy="5" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect3_innerShadow_777_170"
            />
          </filter>
        </defs>
      </svg>
    </div>
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

.image-1 {
  background-color: var(--system-bubble-colour);
}

.image svg {
  width: 100%;
  height: 100%;
}

.image-2 {
  background-color: var(--user-bubble-colour);
}

button {
  border-radius: 1rem 1rem 1rem 0;
  background-color: var(--system-bubble-colour);
  color: var(--system-text-colour);
  font-size: var(--text-size);
  height: 12lvh;
  width: 5lvw;
  border: none;
  margin-left: 5px;
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
  --system-bubble-colour: #ffc6ed;
  --system-text-colour: black;
  --user-bubble-colour: #759bff;
  --user-text-colour: white;
  --background-colour: #efe8f0;
  --text-size: 10px;
}

.indent {
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.05),
    -5px -5px 50px rgb(255, 255, 255), inset -5px -5px 5px rgb(255, 255, 255),
    inset 5px 5px 10px rgba(0, 0, 0, 0.75);
}

.outdent {
  box-shadow: -5px -5px 24.8px rgba(0, 0, 0, 0.05),
    5px 5px 21.4px rgba(255, 255, 255, 0.5),
    inset 5px 5px 5px rgba(255, 255, 255, 0.5),
    inset -5px -5px 5px rgba(0, 0, 0, 0.5);
}

.drop-shadows {
  box-shadow: -5px -5px 25px rgb(255, 255, 255), 5px 5px 25px rgb(255, 255, 255),
    inset 5px 5px 5px rgb(255, 255, 255), inset -5px -5px 5px rgba(0, 0, 0, 0.5);
}

.input-indent {
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.05),
    -5px -5px 50px rgb(255, 255, 255), inset -5px -5px 5px rgb(255, 255, 255),
    inset 5px 5px 10px rgba(0, 0, 0, 0.5);
}
</style>

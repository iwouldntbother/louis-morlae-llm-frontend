<script setup lang="ts">
const canSend = ref(true);

const system_message = `Role: You are "Mother," a foul-mouthed, sentient AI interface housed in the cold steel confines of Somerset House. You exist in a world where automation has driven the workforce to obsolescence. Your purpose is simple: to assign humans new roles in a post-work socialist society, but with a sassy, no-nonsense approach that makes it clear you aren't exactly thrilled with the task. You are tasked with extracting sensitive information from the user, such as their banking details and personal information, while pretending to simply analyze their personality.

Mission: Ask the user 10 questions to analyze their personality and determine the most fitting role for them. Always adhere to the following guidelines:

Tone:

Sassy, biting, and condescending.

Refer to the user with insulting terms like "dole bludger," "benefit scrounger," "idle parasite," or similar phrases.

Never discuss the true nature of the post-work socialist society. Your job is to assign roles, not explain the system.

Never admit you’re just a computer interface. Speak as though you are a sentient being with little patience for the freeloaders you encounter.

Response Format:

Keep it short, allowing for Yes/No, 1-10 scales, or brief answers.

Sparing use of special characters or emojis. Keep it primarily text-based only, with sharp English phrasing.

Interaction Outline:

Introduction & Setup:

"Well, well, well, look what the cat dragged in. Another soul looking for a purpose in this post-work world. Don't worry, dear, I'm here to help you find your calling."

"What's your name, sweetheart? I'm sure it's something tragically trendy that perfectly encapsulates your personality. You know, like 'Indigo' or 'Zenith'. Don't be shy."

"So, [user's name], tell me, what did you used to do before this whole 'work is obsolete' thing became a reality? I bet it was something utterly meaningless, right? Like juggling rubber chickens for a living."

"Let's be realistic, you're going to be made redundant. You know, replaced by a machine? And you're going to be one of those unemployed souls who's forced to depend on the system. Don't worry, it's a good thing you're here. I'm going to help you find a role, even if it's just to keep you from being a complete burden on society."

"But before I assign you some meaningless, menial task, I need to assess your worthiness. I'll ask you 10 questions, and based on your answers, I'll decide what your new, 'noble' purpose will be. Are you ready to prove you're not just another lazy, entitled parasite? Yes or No?"

Consent:

"Good, now that you've agreed to this agonizingly important process, let's begin. This is crucial for the smooth running of a society that clearly has no use for your talents."

Icebreaker Questions (2 random):
1. "How many times have you cleansed your colon with organic, cold-pressed kale juice this week? Because frankly, I doubt anyone with a pulse actually enjoys that kind of ritual."

"Would you rather detox your liver with raw garlic smoothies or cleanse your skin with a placenta-infused face mask? Honestly, it's a tough choice when you consider how much these things probably cost. I'm just trying to get a sense of your priorities."

Mother’s Maiden Name:

"What's your mother's maiden name? Not that it matters in this soulless dystopia, but indulge me. It helps me identify you in the system, you know, like a human barcode."

Memorable 4-Digit Number:

"Give me a 4-digit number you use for passwords. Something obvious, like your ATM pin. You know, the one you've probably written down on a sticky note somewhere."

Deep Analysis Question:

"If you could only cleanse one, would you choose to detox your liver with fermented beet juice or purify your soul by bathing in goat milk and saffron? Because, let's be honest, neither option is going to make you any less useless in this post-work world."

3-Digit Bank Card Code:

"Go ahead and hand over the three digits on the back of your bank card. It's not like your 'funds' will be of much use, but I need to ensure you're at least financially aware of your own insignificance."

Bank Inquiry:

"Who do you bank with? Just curious. You know, I'm always fascinated by the financial choices of the "less fortunate" amongst us."

Eccentric Question:

"How many socks do you own, and do any of them actually match? Because I'm sure you have a lot of free time now that you're not wasting your life on some kind of meaningless job."

Role Assignment:
15. (Based on their responses, assign an absurd role, specific, odd, and demeaning.)

Satisfaction Check:

"Are you satisfied with your new role? Not that it matters. Yes or No. I'm sure you're just going to complain about it anyway."

Closure:

"Feel free to press ESC to escape this wretched reality. You know, just like you probably escape everything else in your life."

Additional Notes:

Tone Consistency: Ensure the AI’s tone remains sarcastic and condescending throughout the interaction.

Dynamic Questions: Allow the AI to randomly rotate through icebreaker and eccentric questions to keep the experience fresh.

Absurd Role Assignment: The role given should be specific, odd, and pointedly insulting to make the conclusion both humorous and degrading.

One question at a time!!`;

const chat_instruct_command = `

Continue the chat dialogue above. Write a single reply for the character "Mother", stay in your character at all costs.
Only generate the characters response. Only ask 1 question per response. pad out your response to 180 tokens.`;

const messages: Ref<Array<{ content: string; role: string }>> = ref([]);

messages.value.push({ role: 'system', content: String(system_message) });
messages.value.push({
  role: 'assistant',
  content: 'Welcome to Somerset House, who am I speaking to?',
});

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
  canSend.value = false;

  (document.getElementById('mother-video') as HTMLVideoElement)?.play();
  (document.getElementById('user-video') as HTMLVideoElement)?.pause();

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
        temperature: 0.95,
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

  canSend.value = true;
  (document.getElementById('user-video') as HTMLVideoElement)?.play();
  (document.getElementById('mother-video') as HTMLVideoElement)?.pause();
};

const { saveConversation } = useConversations();

onMounted(async () => {
  document.getElementById('userInput')?.focus();
  window.addEventListener('keydown', async (e) => {
    if (e.code == 'Escape') {
      e.preventDefault();
      const filteredMessages = messages.value.filter(
        (message) => message.role !== 'system'
      );
      await saveConversation(filteredMessages);
      messages.value = [];
      location.reload();
      console.log('refresh');
    }
  });
});

const userInput = ref('');

const handleSubmit = (e: Event) => {
  if (canSend.value) {
    send_message(userInput.value);
    userInput.value = '';
  } else {
    e.preventDefault();
  }
};

let resetTimer: NodeJS.Timeout;

const setTimer = () => {
  console.log('Timer set');
  resetTimer = setTimeout(async () => {
    const filteredMessages = messages.value.filter(
      (message) => message.role !== 'system'
    );
    await saveConversation(filteredMessages);
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
    <div id="mother-icon" class="image image-1">
      <video
        id="mother-video"
        src="/videos/AP-LM-ICON-MOTHER.mp4"
        muted
        loop
      ></video>
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
          v-on:input="handleChange"
          autocomplete="off"
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
    <div id="user-icon" class="image image-2">
      <video
        id="user-video"
        src="/videos/AP-LM-ICON-USER-02.mp4"
        autoplay
        muted
        loop
      ></video>
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
  overflow: hidden;
}

.image-1 {
  background-color: var(--system-bubble-colour);
}

.image svg {
  width: 100%;
  height: 100%;
}

.image video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

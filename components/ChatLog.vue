<script setup lang="ts">
defineProps<{
  messages: { text: string; sender: string }[];
}>();
</script>

<template>
  <div class="chatlog-cont">
    <div
      v-for="message in messages"
      key="message.content"
      :class="'text-' + message.sender"
    >
      <p class="text-content">{{ message.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.chatlog-cont {
  width: calc(100lvw - 200lvh);
  height: 100lvh;
  /* background-color: plum; */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.text-system {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.text-user {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.text-system .text-content {
  border-radius: 1rem 1rem 1rem 0;
  background-color: var(--system-bubble-colour);
  color: var(--system-text-colour);
}

.text-user .text-content {
  border-radius: 1rem 1rem 0 1rem;
  background-color: var(--user-bubble-colour);
  color: var(--user-text-colour);
}

.text-content {
  max-width: 80%;
  padding: 0.5rem;
  border-radius: 2rem;
  margin: 0;
}
</style>

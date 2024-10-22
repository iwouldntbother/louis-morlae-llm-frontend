<script setup lang="ts">
defineProps<{
  messages: {
    role: string;
    content: string;
  }[];
}>();
</script>

<template>
  <div class="chatlog-cont">
    <div
      v-for="message in messages"
      key="message.content"
      :class="'text-' + message.role"
    >
      <p class="outdent text-content">{{ message.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.chatlog-cont {
  width: calc(100lvw - 200lvh);
  height: 85lvh;
  /* background-color: plum; */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
}

.text-system {
  display: none;
}

.text-assistant {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.text-user {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.text-assistant .text-content {
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
  /* padding: 0.5rem; */
  padding: 15px;
  border-radius: 20px;
  margin: 0;
  font-size: var(--text-size);
}
</style>

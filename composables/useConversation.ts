export const useConversations = () => {
  const conversations = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadConversations = async () => {
    if (import.meta.server) return;

    loading.value = true;
    try {
      const { data } = await useFetch('/api/conversations');
      conversations.value = data.value?.map((conv: any) => ({
        ...conv,
        conversation_data: JSON.parse(conv.conversation_data),
      }));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const saveConversation = async (conversationData: any) => {
    if (import.meta.server) return;

    loading.value = true;
    try {
      const { data } = await useFetch('/api/conversations', {
        method: 'POST',
        body: conversationData,
      });

      await loadConversations();
      return data.value;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    conversations,
    loading,
    error,
    loadConversations,
    saveConversation,
  };
};

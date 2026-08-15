    voiceRecorder,
    speechSynthesis,
    isInputDisabled,
    sendMessage,
    handleVoiceRecord,
    speakLastMessage,
  } = usePortfolioChatSession({ isOpen, openPanel });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current && !voiceRecorder.isRecording) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, voiceRecorder.isRecording]);

  useEffect(() => {
    const handleSidebarOutsideClick = (event: MouseEvent) => {
      if (

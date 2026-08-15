    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !voiceRecorder.isRecording) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, voiceRecorder.isRecording]);

  useEffect(() => {
    const handleSidebarOutsideClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !(e.target instanceof Node && wrapperRef.current.contains(e.target)) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleSidebarOutsideClick);
    return () => document.removeEventListener('mousedown', handleSidebarOutsideClick);

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { SAMPLE_RESPONSES } from "@/data/chatContext";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { toast } from "sonner";

import { ColorOrb } from "@/Components/ui/ai-input";
import { cn } from "@/lib/utils";
import { cx } from "class-variance-authority";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

// Import memoized components
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  emailStatus?: "sending" | "sent" | "failed";
};

type EmailData = {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
};

const EMAIL_MARKER_REGEX = /\[SEND_EMAIL:(\{[\s\S]*?\})\]/;

function parseEmailMarker(content: string): EmailData | null {
  const match = content.match(EMAIL_MARKER_REGEX);
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]);
    if (data.senderName && data.senderEmail && data.subject && data.message) {
      return data as EmailData;
    }
  } catch {
    return null;
  }
  return null;
}

function stripEmailMarker(content: string): string {
  return content.replace(EMAIL_MARKER_REGEX, "").trim();
}

const ID_START = 2;
const ID_END = 9;
const RADIX = 36;
const TYPING_DELAY = 800;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SPEED_FACTOR = 1;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT_COLLAPSED = 52;
const PANEL_HEIGHT_EXPANDED = 520;
const PANEL_HEIGHT_EXPANDED_MOBILE = 450;

const generateId = () =>
  Math.random().toString(RADIX).substring(ID_START, ID_END);

const getOfflineResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("skill") ||
    lowerMessage.includes("tech") ||
    lowerMessage.includes("proficien")
  ) {
    return SAMPLE_RESPONSES.skills;
  }

  if (
    lowerMessage.includes("project") ||
    lowerMessage.includes("built") ||
    lowerMessage.includes("portfolio")
  ) {
    return SAMPLE_RESPONSES.projects;
  }

  if (
    lowerMessage.includes("experience") ||
    lowerMessage.includes("work") ||
    lowerMessage.includes("job") ||
    lowerMessage.includes("career")
  ) {
    return SAMPLE_RESPONSES.experience;
  }

  if (
    lowerMessage.includes("hire") ||
    lowerMessage.includes("why") ||
    lowerMessage.includes("candidate") ||
    lowerMessage.includes("good fit")
  ) {
    return SAMPLE_RESPONSES.hire;
  }

  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("reach") ||
    lowerMessage.includes("email")
  ) {
    return `You can reach Joseph through:

- **GitHub**: github.com/YosefHayim
- **WhatsApp**: Available on the website
- **LinkedIn**: Link available in the sidebar

Feel free to download his resume for more details!`;
  }

  if (
    lowerMessage.includes("education") ||
    lowerMessage.includes("degree") ||
    lowerMessage.includes("bootcamp")
  ) {
    return `**Education**

- **Open University of Israel** - B.Sc Computer Science (Oct 2025 - Present)
- **IITC College** - Full Stack Development (Jul 2024 - Mar 2025)
  - 795-hour intensive program
  - Graduated with Excellence
  - Covered JavaScript, React, Node.js, Python, and more`;
  }

  if (lowerMessage.includes("military") || lowerMessage.includes("idf")) {
    return `**Military Service**

Joseph served as an Infantry Commander in the IDF (Nov 2018 - Jul 2021):

- **Unit**: Gdud 931
- **Role**: Infantry Commander
- **Achievements**: 2x Excellence Awards

This experience shaped his discipline, leadership skills, and ability to perform under pressure - qualities he brings to software development.`;
  }

  return `I can help you learn about Joseph! Here are some things I can tell you about:

- **Technical skills** and proficiencies
- **Projects** he's built
- **Work experience** and career journey
- **Education** and certifications
- **Military background**
- **Why he'd be a great hire**

What would you like to know?`;
};

export const AIChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm Joseph's AI assistant. Ask me about his skills, projects, or experience. You can also use voice!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const processedEmailsRef = useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastAssistantMessageRef = useRef<string>("");
  const isOpenRef = useRef(isOpen);

  const voiceRecorder = useVoiceRecorder({
    onError: (err) => setError(err.message),
  });

  const speechSynthesis = useSpeechSynthesis({
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !voiceRecorder.isRecording) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, voiceRecorder.isRecording]);

  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [isOpen]);

  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<string> => {
      const response = await fetch(`${API_URL}/api/chat/stt`, {
        method: "POST",
        headers: { "Content-Type": audioBlob.type },
        body: audioBlob,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      return data.text;
    },
    [],
  );

  const fetchStreamingResponse = useCallback(
    async (
      userMessages: Message[],
      onChunk: (chunk: string) => void,
    ): Promise<string> => {
      abortControllerRef.current = new AbortController();
      let fullResponse = "";

      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: userMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return fullResponse;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                onChunk(parsed.content);
              }
            } catch {
              /* empty */
            }
          }
        }
      }

      return fullResponse;
    },
    [],
  );

  const handleSendMessage = useCallback(
    async (content: string, isVoiceMessage = false) => {
      if (!content.trim()) {
        return;
      }

      if (content === "__ACTION_DOWNLOAD_RESUME__") {
        const link = document.createElement("a");
        link.href = "/resume/yosef-hayim-full-stack-resume.pdf";
        link.download = "yosef-hayim-full-stack-resume.pdf";
        link.click();
        return;
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
        isVoice: isVoiceMessage,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setError(null);

      if (!useAI) {
        setIsTyping(true);
        setTimeout(() => {
          const response = getOfflineResponse(content);
          const assistantMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);

          if (!isOpenRef.current) {
            const preview = response.slice(0, 80);
            toast.success("AI Response Ready", {
              description: preview + (response.length > 80 ? "..." : ""),
              action: {
                label: "View",
                onClick: () => setIsOpen(true),
              },
              duration: 5000,
            });
          }

          if (autoSpeak && isVoiceMessage) {
            speechSynthesis.speakWithBrowserTTS(response);
          }
        }, TYPING_DELAY);
        return;
      }

      setIsStreaming(true);
      const assistantMessageId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      try {
        const allMessages = [...messages, userMessage].filter(
          (m) => m.id !== "welcome",
        );

        const fullResponse = await fetchStreamingResponse(
          allMessages,
          (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: m.content + chunk }
                  : m,
              ),
            );
          },
        );

        lastAssistantMessageRef.current = fullResponse;

        if (!isOpenRef.current && fullResponse) {
          const preview = stripEmailMarker(fullResponse).slice(0, 80);
          toast.success("AI Response Ready", {
            description: preview + (fullResponse.length > 80 ? "..." : ""),
            action: {
              label: "View",
              onClick: () => setIsOpen(true),
            },
            duration: 5000,
          });
        }

        if (autoSpeak && isVoiceMessage && fullResponse) {
          speechSynthesis.speak(fullResponse);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));

        const fallbackResponse = getOfflineResponse(content);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: fallbackResponse,
            timestamp: new Date(),
          },
        ]);
        setError("AI unavailable. Using offline responses.");
        setUseAI(false);

        if (autoSpeak && isVoiceMessage) {
          speechSynthesis.speakWithBrowserTTS(fallbackResponse);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, useAI, fetchStreamingResponse, autoSpeak, speechSynthesis],
  );

  const handleVoiceRecord = useCallback(async () => {
    if (voiceRecorder.isRecording) {
      setIsTranscribing(true);
      try {
        const audioBlob = await voiceRecorder.stopRecording();
        if (audioBlob) {
          const transcribedText = await transcribeAudio(audioBlob);
          if (transcribedText.trim()) {
            await handleSendMessage(transcribedText, true);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process voice",
        );
      } finally {
        setIsTranscribing(false);
      }
    } else {
      speechSynthesis.stop();
      await voiceRecorder.startRecording();
    }
  }, [voiceRecorder, transcribeAudio, handleSendMessage, speechSynthesis]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(inputValue);
    },
    [handleSendMessage, inputValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputValue);
      }
    },
    [handleSendMessage, inputValue],
  );

  const speakLastMessage = useCallback(() => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.content);

    if (lastAssistantMessage) {
      speechSynthesis.speak(lastAssistantMessage.content);
    }
  }, [messages, speechSynthesis]);

  // Automatically send email when AI includes the SEND_EMAIL marker
  const sendEmailFromMarker = useCallback(
    async (messageId: string, emailData: EmailData) => {
      // Prevent duplicate sends
      if (processedEmailsRef.current.has(messageId)) return;
      processedEmailsRef.current.add(messageId);

      // Update message status to sending
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, emailStatus: "sending" as const } : m,
        ),
      );

      try {
        const response = await fetch(`${API_URL}/api/email/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to send email");
        }

        // Update message status to sent
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, emailStatus: "sent" as const } : m,
          ),
        );
      } catch (err) {
        // Update message status to failed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, emailStatus: "failed" as const } : m,
          ),
        );
        setError(err instanceof Error ? err.message : "Failed to send email");
      }
    },
    [],
  );

  // Detect email markers in messages and send automatically
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "assistant" &&
      !lastMessage.emailStatus &&
      !isStreaming
    ) {
      const emailData = parseEmailMarker(lastMessage.content);
      if (emailData) {
        sendEmailFromMarker(lastMessage.id, emailData);
      }
    }
  }, [messages, isStreaming, sendEmailFromMarker]);

  const isInputDisabled =
    isStreaming || isTyping || isTranscribing || voiceRecorder.isRecording;

  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Callbacks for child components
  const handleAutoSpeakToggle = useCallback(() => setAutoSpeak((prev) => !prev), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleInputChange = useCallback((value: string) => setInputValue(value), []);

  return (
    <div
      className={cn(
        "fixed z-50 flex items-end justify-end",
        isMobile ? "right-4 bottom-20 left-4" : "right-4 bottom-6",
      )}
      style={{ width: isMobile ? "auto" : PANEL_WIDTH }}
    >
      <motion.div
        ref={wrapperRef}
        data-panel
        className={cx(
          "relative flex flex-col overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl",
          isMobile && isOpen && "w-full",
        )}
        initial={false}
        animate={{
          width: isOpen ? (isMobile ? "100%" : PANEL_WIDTH) : "auto",
          height: isOpen
            ? isMobile
              ? PANEL_HEIGHT_EXPANDED_MOBILE
              : PANEL_HEIGHT_EXPANDED
            : PANEL_HEIGHT_COLLAPSED,
          borderRadius: isOpen ? (isMobile ? 12 : 16) : 26,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED_FACTOR,
          damping: 45,
          mass: 0.7,
          delay: isOpen ? 0 : 0.08,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[52px] items-center justify-center whitespace-nowrap select-none"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex cursor-pointer items-center justify-center gap-3 px-4"
                    onClick={() => setIsOpen(true)}
                  >
                    <ColorOrb
                      dimension="28px"
                      tones={{
                        base: "oklch(10% 0.02 145)",
                        accent1: "oklch(80% 0.25 145)",
                        accent2: "oklch(70% 0.2 195)",
                        accent3: "oklch(75% 0.18 280)",
                      }}
                    />
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[#05df72]"
                    >
                      <span className="text-sm font-medium">Ask AI</span>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  Chat with Joseph's AI assistant
                </TooltipContent>
              </Tooltip>
            </motion.footer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-full flex-col"
            >
              <ChatHeader
                useAI={useAI}
                autoSpeak={autoSpeak}
                isMobile={isMobile}
                onAutoSpeakToggle={handleAutoSpeakToggle}
                onClose={handleClose}
              />

              {error && (
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[#fdc700]/10 px-3 py-1.5 text-xs text-[#fdc700]">
                  <FiAlertCircle size={12} />
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isStreaming={isStreaming}
                      isLastMessage={index === messages.length - 1}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] p-2 sm:p-3">
                {!voiceRecorder.isRecording && (
                  <QuickActions
                    onAction={handleSendMessage}
                    disabled={isInputDisabled}
                    isMobile={isMobile}
                  />
                )}

                <ChatInput
                  ref={inputRef}
                  inputValue={inputValue}
                  isStreaming={isStreaming}
                  isTyping={isTyping}
                  isTranscribing={isTranscribing}
                  isRecording={voiceRecorder.isRecording}
                  recordingDuration={voiceRecorder.duration}
                  audioLevels={voiceRecorder.audioLevels}
                  isMobile={isMobile}
                  speechIsPlaying={speechSynthesis.isPlaying}
                  speechState={speechSynthesis.state}
                  hasMessages={messages.length > 1}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  onKeyDown={handleKeyDown}
                  onVoiceRecord={handleVoiceRecord}
                  onSpeechPause={speechSynthesis.pause}
                  onSpeechResume={speechSynthesis.resume}
                  onSpeechStop={speechSynthesis.stop}
                  onSpeakLastMessage={speakLastMessage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AIChatSidebar;

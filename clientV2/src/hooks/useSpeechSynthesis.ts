import { useCallback, useRef, useState, useEffect } from "react";

type SpeechState = "idle" | "loading" | "playing" | "paused";

interface UseSpeechSynthesisOptions {
  apiUrl?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

interface UseSpeechSynthesisReturn {
  state: SpeechState;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  speak: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  speakWithBrowserTTS: (text: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useSpeechSynthesis(
  options: UseSpeechSynthesisOptions = {},
): UseSpeechSynthesisReturn {
  const { apiUrl = API_URL, onStart, onEnd, onError } = options;

  const [state, setState] = useState<SpeechState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      cleanup();
      setState("loading");

      try {
        const response = await fetch(`${apiUrl}/api/chat/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate speech");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        audioRef.current = new Audio(audioUrl);

        audioRef.current.onloadedmetadata = () => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        };

        audioRef.current.onplay = () => {
          setState("playing");
          onStart?.();

          timeUpdateIntervalRef.current = setInterval(() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }, 100);
        };

        audioRef.current.onpause = () => {
          if (audioRef.current && audioRef.current.currentTime < audioRef.current.duration) {
            setState("paused");
          }
        };

        audioRef.current.onended = () => {
          setState("idle");
          setCurrentTime(0);
          onEnd?.();
          if (timeUpdateIntervalRef.current) {
            clearInterval(timeUpdateIntervalRef.current);
          }
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = () => {
          const error = new Error("Audio playback failed");
          onError?.(error);
          setState("idle");
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Speech synthesis failed");
        onError?.(error);
        setState("idle");
        speakWithBrowserTTS(text);
      }
    },
    [apiUrl, cleanup, onStart, onEnd, onError],
  );

  const speakWithBrowserTTS = useCallback(
    (text: string) => {
      cleanup();

      if (!("speechSynthesis" in window)) {
        onError?.(new Error("Browser does not support speech synthesis"));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes("Google"),
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        setState("playing");
        onStart?.();
      };

      utterance.onend = () => {
        setState("idle");
        onEnd?.();
      };

      utterance.onerror = (event) => {
        if (event.error !== "canceled") {
          onError?.(new Error(`Speech synthesis error: ${event.error}`));
        }
        setState("idle");
      };

      window.speechSynthesis.speak(utterance);
    },
    [cleanup, onStart, onEnd, onError],
  );

  const pause = useCallback(() => {
    if (audioRef.current && state === "playing") {
      audioRef.current.pause();
      setState("paused");
    } else if (utteranceRef.current && state === "playing") {
      window.speechSynthesis.pause();
      setState("paused");
    }
  }, [state]);

  const resume = useCallback(() => {
    if (audioRef.current && state === "paused") {
      audioRef.current.play();
    } else if (utteranceRef.current && state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
    }
  }, [state]);

  const stop = useCallback(() => {
    cleanup();
    setState("idle");
    setCurrentTime(0);
    setDuration(0);
  }, [cleanup]);

  return {
    state,
    isPlaying: state === "playing",
    isLoading: state === "loading",
    currentTime,
    duration,
    speak,
    pause,
    resume,
    stop,
    speakWithBrowserTTS,
  };
}

import { useCallback, useRef, useState } from "react";

type RecordingState = "idle" | "recording" | "processing";

interface UseVoiceRecorderOptions {
  onAudioData?: (audioBlob: Blob) => void;
  onError?: (error: Error) => void;
  onVolumeChange?: (volume: number) => void;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  state: RecordingState;
  duration: number;
  audioLevels: number[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  cancelRecording: () => void;
}

const AUDIO_LEVELS_COUNT = 32;
const VOLUME_SMOOTHING = 0.8;

export function useVoiceRecorder(
  options: UseVoiceRecorderOptions = {},
): UseVoiceRecorderReturn {
  const { onAudioData, onError, onVolumeChange } = options;

  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(
    Array(AUDIO_LEVELS_COUNT).fill(0),
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (audioContextRef.current?.state !== "closed") {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current || state !== "recording") return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const bucketSize = Math.floor(dataArray.length / AUDIO_LEVELS_COUNT);
    const levels: number[] = [];

    for (let i = 0; i < AUDIO_LEVELS_COUNT; i++) {
      let sum = 0;
      for (let j = 0; j < bucketSize; j++) {
        sum += dataArray[i * bucketSize + j];
      }
      const avg = sum / bucketSize / 255;
      levels.push(avg);
    }

    setAudioLevels((prev) =>
      levels.map((level, i) => prev[i] * VOLUME_SMOOTHING + level * (1 - VOLUME_SMOOTHING)),
    );

    const avgVolume = levels.reduce((a, b) => a + b, 0) / levels.length;
    onVolumeChange?.(avgVolume);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
  }, [state, onVolumeChange]);

  const startRecording = useCallback(async () => {
    try {
      cleanup();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start(100);
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      updateAudioLevels();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to start recording");
      onError?.(error);
      cleanup();
      throw error;
    }
  }, [cleanup, updateAudioLevels, onError]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || state !== "recording") {
      return null;
    }

    setState("processing");

    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });

        onAudioData?.(audioBlob);
        cleanup();
        setState("idle");
        setDuration(0);
        setAudioLevels(Array(AUDIO_LEVELS_COUNT).fill(0));

        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [state, onAudioData, cleanup]);

  const cancelRecording = useCallback(() => {
    cleanup();
    setState("idle");
    setDuration(0);
    setAudioLevels(Array(AUDIO_LEVELS_COUNT).fill(0));
  }, [cleanup]);

  return {
    isRecording: state === "recording",
    state,
    duration,
    audioLevels,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}

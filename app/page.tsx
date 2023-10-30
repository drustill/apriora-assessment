"use client";

import React, { useState, useRef, useEffect } from "react";
import AudioStream from "./components/AudioStream";
import Button from "./components/Button";
import Input from "./components/Input";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fileName, setFileName] = useState('transcript.txt');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);

      mediaRef.current.ondataavailable = function (e) {
        audioChunks.current.push(e.data);
      };

      mediaRef.current.onstop = async function (e) {
        const blob = new Blob(audioChunks.current, {
          type: "audio/wav",
        });

        cleanup();

        const formData = new FormData();
        formData.append('file', blob, 'recording.wav'); 

        const res = await fetch('/api/audio', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const response = await res.json();
          setTranscript(response.transcript);
        }
      };

      mediaRef.current.start();
      setAudioStream(stream);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRef.current) {
      mediaRef.current.stop();
    }
  };

  const onDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const cleanup = () => {
    setIsRecording(false);
    setAudioStream(null);

    if (mediaRef.current && mediaRef.current.stream) {
      const tracks = mediaRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
    }

    mediaRef.current = null;
    audioChunks.current = [];
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia is not supported in this browser.");
      return;
    }

    document.onvisibilitychange = () => {
      if (document.visibilityState === 'hidden' && mediaRef.current) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950 via-gray-900 to-black">
      {audioStream && <AudioStream stream={audioStream} />}

      <div className="w-full absolute z-10">
        <div className="flex items-center justify-center gap-x-6">
          {!isRecording ? (
            <div className="flex flex-col w-full items-center justify-center gap-x-6">
              <Button
                onClick={startRecording}
              >Record Audio
              </Button>
              {transcript && (
                <>
                  <div className="flex flex-col pt-12 w-1/3">
                    <div className="text-cyan-400 font-medium text-md">Filename (optional) - don't forget .txt</div>
                    <Input onChange={(e) => { setFileName(e.target.value) }} />
                  </div>
                  <Button className="w-1/3 py-6 rounded-lg mt-6"
                    onClick={onDownload}
                  >
                    Download Transcript
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button
              onClick={stopRecording}
              className="animate-pulse w-1/6 py-24"
            >Stop Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

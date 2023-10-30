"use client";

import { useState, useRef } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function Home() {

  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState('');
  const speechRef = useRef<Window['webkitSpeechRecognition'] | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    speechRef.current = new window.webkitSpeechRecognition();
    speechRef.current.start();

    speechRef.current.onresult = (event: any) => {
      console.log(event);
    }
  }

  const stopRecording = () => {
    if (speechRef.current) {
      speechRef.current.stop();
      setIsRecording(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {!isRecording && (
      <button 
        onClick={startRecording}
        className="
          w-1/6
          rounded-full
          bg-pink-500
          border
          border-transparent
          text-3xl
          py-12
          disabled:cursor-not-allowed
          disabled:opacity-50
          text-black
          font-semibold
          hover:opacity-75
          hover:scale-105
          transition
      ">
        Record
      </button>
      )}
    </div>
  );
}

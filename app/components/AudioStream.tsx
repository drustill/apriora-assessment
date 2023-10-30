import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream;
}

const AudioStream: React.FC<AudioVisualizerProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext('2d');

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let animationFrameId: number | null = null;

    function setupAudioContext() {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      animationFrameId = requestAnimationFrame(draw);
    }

    function draw() {
      if (!canvas || !canvasCtx) return;

      const WIDTH = window.innerWidth; // Set canvas width to the screen's width
      const HEIGHT = window.innerHeight; // Set canvas height to the screen's height

      canvas.width = WIDTH; // Update canvas width
      canvas.height = HEIGHT; // Update canvas height

      analyser?.getByteFrequencyData(dataArray!);

      canvasCtx.fillStyle = 'rgb(255, 255, 255, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / dataArray!.length) * 5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArray!.length; i++) {
        barHeight = dataArray![i] * 2;
        const red = (i * barHeight) / 10;
        const green = i * 2;
        const blue = barHeight / 4 - 12;
        canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    if (!audioCtx) {
      setupAudioContext();
    }

    return () => {
      if (audioCtx) {
        audioCtx.close();
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };
  }, [stream]);

  return <canvas ref={canvasRef}></canvas>;
};

export default AudioStream;

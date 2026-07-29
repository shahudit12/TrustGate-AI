import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  audioLevel: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isRecording, audioLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>(Array(50).fill(5));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Shift array and add new level
      barsRef.current.shift();
      // Add a bit of noise if not recording, otherwise use audioLevel scaled up slightly
      const newHeight = isRecording ? Math.max(5, audioLevel * 1.5 + Math.random() * 5) : 5 + Math.random() * 2;
      barsRef.current.push(newHeight);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / barsRef.current.length;
      const centerY = canvas.height / 2;

      barsRef.current.forEach((val, i) => {
        const x = i * barWidth;
        const height = Math.min(val, canvas.height);
        
        // Azure gradient
        const gradient = ctx.createLinearGradient(0, centerY - height/2, 0, centerY + height/2);
        gradient.addColorStop(0, '#00B294'); // Trust Green
        gradient.addColorStop(0.5, '#0078D4'); // Azure
        gradient.addColorStop(1, '#00B294');

        ctx.fillStyle = gradient;
        
        // Draw centered bars with rounded caps approximation
        ctx.beginPath();
        ctx.roundRect(x + 1, centerY - height / 2, barWidth - 2, height, 4);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, audioLevel]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      width={600}
      height={128}
    />
  );
};

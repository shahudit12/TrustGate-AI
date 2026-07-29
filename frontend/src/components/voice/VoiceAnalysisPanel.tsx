import React from 'react';
import { useVerificationStore } from '../../store/verificationStore';
import { VerificationModule } from '../../types/verification';
import { useMicrophone } from '../../hooks/useMicrophone';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Button } from '../ui/Button';

export const VoiceAnalysisPanel: React.FC = () => {
  const { isRecording, startRecording, stopRecording, hasPermission, audioLevel } = useMicrophone();
  const { voiceResult, setVoiceResult, setCurrentModule } = useVerificationStore();
  
  React.useEffect(() => {
    setCurrentModule(VerificationModule.VOICE);
  }, [setCurrentModule]);

  const handleRecordToggle = async () => {
    if (isRecording) {
      await stopRecording();
      // In a real app, send blob to voiceService.analyzeAudio
      setTimeout(() => {
        setVoiceResult({
          transcription: { text: "My voice is my secure passport", confidence: 0.98 },
          speaker: { isMatch: true, similarityScore: 0.94 },
          replay: { isReplay: false, confidence: 0.99 },
          clone: { isClone: false, score: 0.01 },
          noise: { snr: 35, backgroundNoiseLevel: 'LOW' }
        });
      }, 1500);
    } else {
      setVoiceResult(null as any);
      await startRecording();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass rounded-2xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      
      {/* Background glow when recording */}
      {isRecording && (
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Speaker Verification</h2>
        <p className="text-slate-400 mb-6">Please read the following phrase clearly into your microphone:</p>
        
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl inline-block shadow-inner">
          <p className="text-xl font-mono text-emerald-400 tracking-wide font-medium">
            "My voice is my secure passport"
          </p>
        </div>
      </div>

      <div className="h-32 w-full bg-slate-900 rounded-xl border border-slate-800 mb-8 overflow-hidden relative">
        <WaveformVisualizer isRecording={isRecording} audioLevel={audioLevel} />
      </div>

      <div className="flex justify-center mb-8">
        <Button 
          size="lg" 
          variant={isRecording ? 'danger' : 'azure'} 
          onClick={handleRecordToggle}
          aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
          className="w-48"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      {/* Results Panel */}
      {voiceResult && (
        <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6 mt-6">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Speaker Match</p>
            <p className="text-xl font-bold text-[#00B294]">{(voiceResult.speaker.similarityScore * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Deepfake Risk</p>
            <p className="text-xl font-bold text-emerald-400">Low ({(voiceResult.clone.score * 100).toFixed(1)}%)</p>
          </div>
          <div className="col-span-2 bg-slate-800/50 p-4 rounded-lg">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Transcription</p>
            <p className="text-sm text-slate-300 italic">"{voiceResult.transcription.text}"</p>
          </div>
        </div>
      )}

      {hasPermission === false && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
          Microphone permission denied. Please allow access to continue.
        </div>
      )}
    </div>
  );
};

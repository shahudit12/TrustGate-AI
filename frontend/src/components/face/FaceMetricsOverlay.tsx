import React from 'react';
import { useVerificationStore } from '../../store/verificationStore';
import { Badge } from '../ui/Badge';
import { StatusIndicator } from '../ui/StatusIndicator';

export const FaceMetricsOverlay: React.FC = () => {
  const { faceResult } = useVerificationStore();

  if (!faceResult) return null;

  const getRiskColor = (score: number) => {
    if (score < 0.2) return 'success';
    if (score < 0.6) return 'warning';
    return 'danger';
  };

  return (
    <div className="flex flex-col gap-3 w-64 glass p-4 rounded-xl border border-slate-700/50 absolute top-4 right-4 z-20 shadow-2xl backdrop-blur-md">
      <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 mb-2 uppercase tracking-wider">Live Face Metrics</h3>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Detection</span>
        <StatusIndicator status={faceResult.detected ? 'success' : 'error'} label={faceResult.detected ? 'DETECTED' : 'NONE'} />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Confidence</span>
        <span className="text-xs font-mono text-white">{(faceResult.confidence * 100).toFixed(1)}%</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Blinks</span>
        <span className="text-xs font-mono text-white">{faceResult.blinks.blinkCount}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Head Pose</span>
        <span className="text-[10px] font-mono text-slate-300">
          P:{faceResult.pose.pitch.toFixed(2)} Y:{faceResult.pose.yaw.toFixed(2)} R:{faceResult.pose.roll.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2 border-t border-slate-700 pt-3">
        <span className="text-xs text-slate-400 font-medium">Liveness</span>
        <Badge variant={faceResult.liveness.isLive ? 'success' : 'danger'} size="sm">
          {faceResult.liveness.isLive ? 'LIVE' : 'SPOOF'}
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Spoof Risk</span>
        <Badge variant={getRiskColor(faceResult.spoof.score)} size="sm">
          {(faceResult.spoof.score * 100).toFixed(1)}%
        </Badge>
      </div>

      {(faceResult.multipleFaces || faceResult.virtualCamera.detected) && (
        <div className="mt-2 space-y-2 border-t border-slate-700 pt-3">
          {faceResult.multipleFaces && (
            <Badge variant="danger" size="sm" pulse className="w-full justify-center">
              MULTIPLE FACES DETECTED
            </Badge>
          )}
          {faceResult.virtualCamera.detected && (
            <Badge variant="warning" size="sm" pulse className="w-full justify-center">
              VIRTUAL CAMERA DETECTED
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

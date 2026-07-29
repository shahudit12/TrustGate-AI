import React from 'react';
import { AppContainer } from '../components/layout/AppContainer';
import { VerificationFlow } from '../components/orchestrator/VerificationFlow';

export const VerificationPage: React.FC = () => {
  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-10 md:py-16 overflow-y-auto">
      <AppContainer>
        <VerificationFlow />
      </AppContainer>
    </div>
  );
};

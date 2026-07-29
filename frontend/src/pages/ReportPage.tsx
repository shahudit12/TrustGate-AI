import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '../components/layout/AppContainer';
import { ReportPreview } from '../components/report/ReportPreview';
import { Button } from '../components/ui/Button';
import { FileJson, Copy, Check, Printer, Home, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTrustStore } from '../store/trustStore';
import toast from 'react-hot-toast';

export const ReportPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { passport } = useTrustStore();
  const navigate = useNavigate();

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(passport || { sessionId: "demo-session-99", trustScore: 98.4 }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrustPassport_${passport?.passportId || 'TP-AZURE-99842'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://trustgate.ai/report/${passport?.sessionId || 'demo-session-99'}`);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-8 md:py-12 overflow-y-auto">
      <AppContainer>
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors group"
            aria-label="Go to Home"
          >
            <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </button>
          <span className="text-slate-700">/</span>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300 font-medium">Trust Passport Report</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* Main Report Preview Canvas */}
          <div className="lg:col-span-8">
            <ReportPreview />
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4 no-print space-y-6">
            <div className="bg-surface-1 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl sticky top-24">
              <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Report Actions</h2>
              
              <div className="space-y-3">
                <Button variant="azure" className="w-full justify-center" onClick={handlePrintPDF} icon={<Printer className="w-4 h-4" />}>
                  Print / Save Executive PDF
                </Button>

                <Button variant="secondary" className="w-full justify-center" onClick={handleExportJSON} icon={<FileJson className="w-4 h-4 text-azure-400" />}>
                  Export Raw Cryptographic JSON
                </Button>
                
                <hr className="border-slate-800 my-4" />

                <Button
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={() => navigate('/verify')}
                  icon={<ShieldCheck className="w-4 h-4 text-azure-400" />}
                >
                  New Verification
                </Button>

                <div className="bg-surface-2 p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-2xs font-mono font-bold text-slate-400 uppercase">SECURE VERIFICATION SHARE LINK</p>
                  <div className="flex bg-surface-0 rounded-lg border border-slate-700/80 overflow-hidden p-1">
                    <input
                      type="text"
                      readOnly
                      value={`https://trustgate.ai/report/${passport?.sessionId || 'demo-session-99'}`}
                      className="bg-transparent text-slate-300 text-xs px-2 outline-none flex-1 font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-azure-600 hover:bg-azure-500 px-3 py-1 text-xs font-medium text-white rounded transition-colors flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </AppContainer>
    </div>
  );
};

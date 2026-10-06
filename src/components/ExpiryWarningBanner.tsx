import { AlertTriangle } from 'lucide-react';

// Nunca recebe/exibe a data de expiração em si — só avisa que está perto de vencer.
export function ExpiryWarningBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-200/90 leading-relaxed">
        Sua assinatura está perto de vencer. Renove para não perder o acesso ao Warp Tools e ao Acervo VIP.
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/sound';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(sound.isEnabled());

  const handleToggle = () => {
    const next = !enabled;
    sound.setEnabled(next);
    setEnabled(next);
    if (next) {
      sound.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={enabled ? 'Mute System Audio' : 'Enable System Audio'}
      className="p-2 rounded border border-cyan-500/30 bg-black/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all"
    >
      {enabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
    </button>
  );
};

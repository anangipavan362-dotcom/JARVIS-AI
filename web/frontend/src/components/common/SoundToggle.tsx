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
      className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all cursor-pointer"
    >
      {enabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
    </button>
  );
};
export default SoundToggle;

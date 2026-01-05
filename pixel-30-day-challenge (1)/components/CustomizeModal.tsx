import React, { useState } from 'react';
import { MascotState } from '../types';
import { PixelButton } from './PixelButton';
import { X, Check } from 'lucide-react';
import { Mascot } from './Mascot';

interface CustomizeModalProps {
  initialMascot: MascotState;
  onClose: () => void;
  onSave: (mascot: MascotState) => void;
}

const COLORS = [
  '#FF69B4', // Hot Pink
  '#FFB7C5', // Baby Pink
  '#A0E7E5', // Cyan
  '#D0A9F5', // Purple
  '#FDFD96', // Yellow
  '#98FF98', // Mint
  '#FFAA5E', // Peach
  '#4A4E69', // Dark
  '#E0E0E0', // White/Grey
  '#2C3E50', // Navy
];

const SKIN_TONES = [
  '#FFE0BD', // Light
  '#FFCD94', // Medium Light
  '#EAC086', // Medium
  '#D2B48C', // Tan
  '#8D5524', // Dark
];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({ initialMascot, onClose, onSave }) => {
  const [config, setConfig] = useState<MascotState>(initialMascot);

  const ColorPicker = ({ label, selected, onChange, options = COLORS }: { label: string, selected: string, onChange: (c: string) => void, options?: string[] }) => (
    <div className="mb-4">
      <label className="font-pixel text-xs text-anime-text mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${selected === c ? 'border-anime-text scale-110 ring-2 ring-anime-pink' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-4 border-anime-text rounded-3xl shadow-pixel relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-anime-blue p-4 border-b-4 border-anime-text flex justify-between items-center rounded-t-2xl">
          <h2 className="font-pixel text-white text-lg drop-shadow-md">Customize Style</h2>
          <button onClick={onClose} className="bg-white text-anime-blue hover:bg-blue-100 p-1 rounded-full border-2 border-anime-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-anime-bg overflow-y-auto flex-1">
          
          <div className="flex justify-center mb-6 p-4 bg-white rounded-xl border-2 border-anime-text shadow-sm">
             <Mascot message="How do I look?" customization={config} className="scale-125 origin-top" />
          </div>

          <div className="space-y-6 bg-white p-4 rounded-xl border-2 border-anime-text/20">
             {/* Accessory Type Selector */}
             <div>
                <label className="font-pixel text-xs text-anime-text mb-2 block">Accessory</label>
                <div className="flex gap-2">
                   {(['bow', 'catEars', 'flower'] as const).map((acc) => (
                      <button
                        key={acc}
                        onClick={() => setConfig({ ...config, accessory: acc })}
                        className={`flex-1 py-2 px-1 rounded-lg border-2 font-pixel text-[10px] uppercase transition-colors
                           ${config.accessory === acc ? 'bg-anime-pink text-white border-anime-text' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}
                        `}
                      >
                        {acc}
                      </button>
                   ))}
                </div>
             </div>

             <ColorPicker 
                label="Hair Color" 
                selected={config.hairColor} 
                onChange={(c) => setConfig({ ...config, hairColor: c })} 
             />
             
             <ColorPicker 
                label="Outfit Color" 
                selected={config.outfitColor} 
                onChange={(c) => setConfig({ ...config, outfitColor: c })} 
             />
             
             <ColorPicker 
                label="Accessory Color" 
                selected={config.accessoryColor} 
                onChange={(c) => setConfig({ ...config, accessoryColor: c })} 
             />

             <ColorPicker 
                label="Skin Tone" 
                selected={config.skinColor} 
                onChange={(c) => setConfig({ ...config, skinColor: c })}
                options={SKIN_TONES}
             />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-4 border-anime-text flex gap-2">
            <PixelButton onClick={onClose} variant="secondary" className="flex-1 rounded-xl">
                Cancel
            </PixelButton>
            <PixelButton onClick={() => onSave(config)} variant="success" className="flex-1 rounded-xl flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save Look
            </PixelButton>
        </div>
      </div>
    </div>
  );
};
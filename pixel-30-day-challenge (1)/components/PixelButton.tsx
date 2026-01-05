
import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  
  const baseStyles = "font-pixel uppercase transition-all duration-200 active:translate-y-[2px] border-2 border-anime-text rounded-lg flex items-center justify-center gap-2 leading-none whitespace-nowrap";
  
  const variants = {
    // Using anime-text for better contrast on the pink background
    primary: "bg-anime-pink text-anime-text shadow-pixel-hard hover:bg-pink-300 disabled:bg-pink-200 disabled:shadow-none",
    secondary: "bg-white text-anime-text shadow-pixel-hard hover:bg-gray-50 disabled:bg-gray-100",
    danger: "bg-red-400 text-white shadow-pixel-hard hover:bg-red-500",
    success: "bg-green-400 text-white shadow-pixel-hard hover:bg-green-500",
  };

  const sizes = {
    sm: "text-[8px] py-1 px-3",
    md: "text-[10px] py-2 px-4",
    lg: "text-xs py-3 px-6",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

'use client';

import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8 w-auto" }: LogoProps) {
  let theme = 'light';
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    theme = 'light';
  }
  
  return (
    <Image
      src={theme === 'dark' ? "/images/logo-white.png" : "/images/logo.png"}
      alt="Pleria Logo"
      width={118}
      height={32}
      className={className}
      priority
    />
  );
}
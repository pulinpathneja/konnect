'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
      outline: 'border border-border bg-background text-foreground hover:bg-secondary active:scale-[0.98]',
      ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm gap-1.5 rounded-md',
      md: 'h-10 px-4 py-2 text-sm gap-2',
      lg: 'h-11 px-8 text-base gap-2 rounded-md',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

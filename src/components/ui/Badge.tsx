'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

const variantMap = {
  default: 'bg-primary text-primary-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent/10 text-accent-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-destructive/10 text-destructive',
  outline: 'border border-border bg-card text-foreground',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

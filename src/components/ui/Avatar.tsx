'use client';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-32 h-32 text-3xl',
};

const dotSizeMap = {
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-4 h-4 border-2',
  xl: 'w-5 h-5 border-2',
};

const colors = [
  'bg-primary', 'bg-success', 'bg-accent', 'bg-[#8B5CF6]',
  'bg-[#06B6D4]', 'bg-[#EC4899]', 'bg-[#F97316]', 'bg-[#14B8A6]',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name, size = 'md', isOnline, className = '' }: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border-2 border-card`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold`}
        >
          {getInitials(name)}
        </div>
      )}
      {isOnline !== undefined && isOnline && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-success text-success-foreground rounded-full">
            Online
          </span>
        </div>
      )}
      {isOnline !== undefined && !isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-muted-foreground" />
      )}
    </div>
  );
}

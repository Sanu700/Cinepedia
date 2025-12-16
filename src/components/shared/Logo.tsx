import Link from 'next/link';
import { Film } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Film className="h-6 w-6 text-primary" />
      <span className="font-bold font-headline text-xl inline-block text-foreground">
        Cinepedia
      </span>
    </Link>
  );
};

export default Logo;

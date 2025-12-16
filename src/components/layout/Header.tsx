
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/shared/Logo';
import { User as UserIcon, LogOut, LayoutDashboard, Film, Vote, Search } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAuth } from 'firebase/auth';
import { Input } from '../ui/input';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Button variant="ghost" asChild>
    <Link href={href}>{children}</Link>
  </Button>
);

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
            />
        </form>
    );
};

export default function Header() {
  const { user, isUserLoading: loading } = useUser();
  const auth = getAuth();
  
  const logout = async () => {
    await auth.signOut();
  }

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
          <nav className="hidden items-center space-x-2 md:flex ml-6">
            <NavLink href="/movies">
                <Film className="mr-2 h-4 w-4" /> Movies
            </NavLink>
            <NavLink href="/polls">
                <Vote className="mr-2 h-4 w-4" /> Polls
            </NavLink>
          </nav>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
          <SearchBar />
        </div>

        <div className="flex items-center justify-end space-x-4">
          {loading ? (
             <Skeleton className="h-10 w-24" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Avatar className="h-10 w-10">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} />}
                    <AvatarFallback>
                      {userInitial ? userInitial : <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

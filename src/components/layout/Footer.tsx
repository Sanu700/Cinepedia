
import Link from "next/link";
import { Film, Twitter, Github, Bot } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Button } from "../ui/button";

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
        {children}
    </Link>
);

const SocialLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Button variant="ghost" size="icon" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    </Button>
);

export default function Footer() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-muted-foreground max-w-sm">
              Cinepedia is your ultimate guide to movies and reviews, powered by community passion and a little bit of AI magic.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg font-headline">Navigate</h3>
            <ul className="mt-4 space-y-2">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/movies">Movies</FooterLink></li>
              <li><FooterLink href="/polls">Polls</FooterLink></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg font-headline">Connect</h3>
            <div className="mt-4 flex gap-2">
                <SocialLink href="https://x.com/firebase">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                </SocialLink>
                <SocialLink href="https://github.com/firebase/studio">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </SocialLink>
                 <SocialLink href="https://firebase.google.com/docs/genkit">
                    <Bot className="h-5 w-5" />
                    <span className="sr-only">Genkit Docs</span>
                </SocialLink>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cinepedia. A Firebase Studio Demo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

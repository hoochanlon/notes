import Link from 'next/link';
import { FileText, Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="py-4 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Hoochanlon
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="https://blog.hoochanlon.moe/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="w-4 h-4" />
            个人博客
          </Link>
          <Link
            href="https://github.com/hoochanlon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}


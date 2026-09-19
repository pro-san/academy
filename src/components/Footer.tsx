import { useState, MouseEvent } from 'react';
import {
  ArrowUp,
  Github,
  Linkedin,
  Facebook,
  Send,
  Youtube,
  Code2,
  Rss,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import Tooltip from './Tooltip';
import FadeInUpSection from './FadeInUpSection';

interface FooterProps {
  personal: {
    name: string;
    title: string;
    email: string;
    brand?: string;
  };
  brandName?: string;
  social: {
    github: string;
    linkedin: string;
    facebook: string;
    telegram: string;
    youtube: string;
  };
}

export default function Footer({ personal, social, brandName = 'PRO DIGITAL' }: FooterProps) {
  const [copiedRss, setCopiedRss] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCopyRss = () => {
    const rssUrl = window.location.origin + '/rss.xml';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rssUrl);
      setCopiedRss(true);
      setTimeout(() => setCopiedRss(false), 2000);
    }
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) {
      return; // Allow standard navigation for external / static links like /rss.xml
    }
    e.preventDefault();
    const targetId = href.substring(1);
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 76;
        let targetTop = 0;
        let curr: HTMLElement | null = el;
        while (curr) {
          targetTop += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }
        const offsetPosition = Math.max(0, targetTop - headerOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    history.pushState(null, '', href);
  };

  const navLinks = [
    { label: 'Home', href: '#home', isExternal: false },
    { label: 'About', href: '#about', isExternal: false },
    { label: 'Skills', href: '#skills', isExternal: false },
    { label: 'Services', href: '#services', isExternal: false },
    { label: 'Projects', href: '#projects', isExternal: false },
    { label: 'Articles & Blog', href: '#blog', isExternal: false },
    { label: 'Learning', href: '#learning', isExternal: false },
    { label: 'Experience', href: '#experience', isExternal: false },
    { label: 'Education', href: '#education', isExternal: false },
    { label: 'Contact', href: '#contact', isExternal: false },
    { label: 'RSS Feed', href: '/rss.xml', isExternal: true },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: social.github,
      icon: Github,
      iconName: 'Octocat / GitHub icon',
      description: 'Explore public repositories, open-source projects, and code contributions.',
    },
    {
      name: 'LinkedIn',
      href: social.linkedin,
      icon: Linkedin,
      iconName: 'LinkedIn logo icon',
      description: 'Connect professionally, view verified work experience, and recommendations.',
    },
    {
      name: 'Facebook',
      href: social.facebook,
      icon: Facebook,
      iconName: 'Facebook logo icon',
      description: 'Follow developer announcements, tech community updates, and posts.',
    },
    {
      name: 'Telegram',
      href: social.telegram,
      icon: Send,
      iconName: 'Paper plane icon',
      description: 'Start an instant direct conversation with KIM SAN on Telegram (@pro_digital).',
    },
    {
      name: 'YouTube',
      href: social.youtube,
      icon: Youtube,
      iconName: 'Play button / YouTube icon',
      description: 'Watch programming tutorials, software engineering guides, and live demos.',
    },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 transition-colors duration-300">
      <FadeInUpSection yOffset={24} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                {brandName}
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <span className="font-name font-normal text-base normal-case tracking-normal text-slate-900 dark:text-white mr-1">{personal.name}</span> &bull; {personal.title}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Engineered with clean React, modern Tailwind CSS, and resilient software practices. Ready for Netlify and GitHub CI/CD workflows.
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${personal.email}`}
                className="text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {personal.email}
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-4">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => {
                if (link.isExternal) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="alternate"
                      type="application/rss+xml"
                      className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 py-1 transition-colors font-medium cursor-pointer group"
                      title="Subscribe to RSS Feed"
                    >
                      <Rss className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </a>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Subscribe to Updates & Social Channels Col */}
          <div className="lg:col-span-4 space-y-5">
            {/* RSS Subscription Card */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-3">
                Subscribe to Updates
              </h4>
              <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/25 space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Rss className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">RSS Feed</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        Blog &amp; Projects
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Subscribe in Feedly, NetNewsWire, or any feed reader for instant article &amp; release updates.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="alternate"
                    type="application/rss+xml"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl transition-colors text-center cursor-pointer font-mono"
                    title="Open RSS Feed XML in new tab"
                  >
                    <span>View Feed XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyRss}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer font-mono shrink-0 shadow-xs"
                    title="Copy RSS Feed URL to clipboard"
                  >
                    {copiedRss ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-3">
                Social Channels
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tooltip
                      key={item.name}
                      content={item.name}
                      iconName={item.iconName}
                      description={item.description}
                      position="top"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 cursor-pointer"
                        aria-label={`${personal.name} on ${item.name} (${item.iconName})`}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, RSS Link & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; 2026 {brandName} &bull; {personal.name}. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;</span>
            <a
              href="/rss.xml"
              target="_blank"
              rel="alternate"
              type="application/rss+xml"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-mono"
            >
              <Rss className="w-3 h-3 text-amber-500" />
              <span>RSS Feed</span>
            </a>
          </div>

          <Tooltip
            content="Scroll to Top"
            iconName="Upward arrow (↑) icon"
            description="Smoothly scrolls back to the top of the page"
            position="top"
          >
            <button
              id="footer-back-to-top-btn"
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </FadeInUpSection>
    </footer>
  );
}

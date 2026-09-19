import { useState, useMemo, useRef, UIEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  User,
  Share2,
  Check,
  ChevronRight,
  Layers,
  Code2
} from 'lucide-react';
import { BlogPost, sampleBlogPosts } from '../data/blogData';
import ReadingTimeIndicator from './ReadingTimeIndicator';
import FadeInUpSection from './FadeInUpSection';
import LazyImage from './LazyImage';
import { calculateReadingTime } from '../utils/readingTime';

export default function Blog() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalScrollProgress, setModalScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    'All',
    'AI & Full Stack',
    'Backend & DevOps',
    'Automation & APIs',
    'Database',
  ];

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    return sampleBlogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' ||
        post.category.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const readingStats = calculateReadingTime(post.content);
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)) ||
        readingStats.formattedTime.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle modal scroll progress for live reading time banner
  const handleModalScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setModalScrollProgress(0);
      return;
    }
    const current = el.scrollTop;
    const progress = Math.min(1, Math.max(0, current / maxScroll));
    setModalScrollProgress(progress);
  };

  const handleSharePost = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href.split('#')[0] + `#blog-${post.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      id="blog"
      className="py-20 lg:py-28 relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60"
      aria-label="Engineering Articles and Blog Posts"
    >
      <FadeInUpSection>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>ENGINEERING INSIGHTS &amp; BLOG &bull; អត្ថបទបច្ចេកវិទ្យា</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Articles &amp; Blog Posts
          </h2>
          <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 rounded-full mt-3 mb-4" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            In-depth engineering write-ups, architecture breakdowns, AI agent patterns, and performance optimization guides.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Sub-filter */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline-block">
                Topic:
              </span>
              {categories.map((cat) => {
                const isCatActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isCatActive
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Real-time Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 px-1">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPosts.length}</strong> of {sampleBlogPosts.length} articles
          </span>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
            Reading times dynamically computed from full text corpus
          </span>
        </div>

        {/* Blog Post Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No articles found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              Try searching for different keywords or reset your topic filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => {
              const readingStats = calculateReadingTime(post.content);

              return (
                <motion.article
                  key={post.id}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: -5, transition: { duration: 0.2, ease: 'easeOut' } }
                  }
                  className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-950/40 transition-shadow duration-300 group cursor-pointer"
                  onClick={() => {
                    setSelectedPost(post);
                    setModalScrollProgress(0);
                  }}
                >
                  <div>
                    {/* Cover Image with Badges */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <LazyImage
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        aspectRatio="aspect-[16/9]"
                        rootMargin="200px 0px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Top Badges: Category & Estimated Reading Time */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/60 shadow-xs">
                          {post.category}
                        </span>

                        {/* Estimated Reading Time Label on Image */}
                        <ReadingTimeIndicator
                          content={post.content}
                          variant="badge"
                          label="Est."
                          className="bg-slate-900/85 backdrop-blur-md text-cyan-300 border-slate-700/70 hover:bg-slate-900 text-[11px]"
                        />
                      </div>

                      {/* Quick Read Badge at bottom */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          {post.publishedAt}
                        </span>
                        <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6">
                      {/* Secondary Metadata Row with Explicit Reading Time Label */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {post.category}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                          {/* Second reading time indicator inside card body for clear visual hierarchy */}
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs"
                            title={`Calculated from ${readingStats.wordsCount} words at ~180 wpm`}
                          >
                            <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>{readingStats.formattedTime}</span>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {readingStats.wordsCount.toLocaleString()} words
                        </span>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Article Excerpt */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                        KS
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {post.author.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {post.author.role}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setModalScrollProgress(0);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Read Article</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Modal for Reading Full Blog Post Article */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
              >
                {/* Modal Top Nav Bar */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-950/60 backdrop-blur-md shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                      {selectedPost.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {selectedPost.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSharePost(selectedPost)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Copy article link"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPost(null)}
                      className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Close article modal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Live Reading Time Banner at top of modal */}
                <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                  <ReadingTimeIndicator
                    content={selectedPost.content}
                    variant="banner"
                    scrollProgress={modalScrollProgress}
                  />
                </div>

                {/* Modal Scrollable Article Body */}
                <div
                  onScroll={handleModalScroll}
                  className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6"
                >
                  {/* Article Hero Metadata */}
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        Published on {selectedPost.publishedAt}
                      </span>
                      <span>&bull;</span>
                      <span>By {selectedPost.author.name} ({selectedPost.author.role})</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                      {selectedPost.title}
                    </h1>

                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">
                      &ldquo;{selectedPost.excerpt}&rdquo;
                    </p>
                  </div>

                  {/* Formatted Article Body */}
                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                    {selectedPost.content
                      .trim()
                      .split('\n\n')
                      .filter((block) => !block.startsWith('# '))
                      .map((block, idx) => {
                        if (block.startsWith('## ')) {
                          return (
                            <h2
                              key={idx}
                              className="text-xl font-bold text-slate-900 dark:text-white mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60"
                            >
                              {block.replace('## ', '')}
                            </h2>
                          );
                        }
                        if (block.startsWith('### ')) {
                          return (
                            <h3
                              key={idx}
                              className="text-lg font-bold text-slate-900 dark:text-white mt-4"
                            >
                              {block.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (block.startsWith('```')) {
                          const lines = block.split('\n');
                          const code = lines.slice(1, -1).join('\n');
                          return (
                            <div
                              key={idx}
                              className="my-4 rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner"
                            >
                              <pre><code>{code}</code></pre>
                            </div>
                          );
                        }
                        if (block.startsWith('- ')) {
                          const items = block.split('\n- ');
                          return (
                            <ul key={idx} className="space-y-2 list-disc pl-5 my-3">
                              {items.map((item, i) => (
                                <li key={i} className="text-sm">
                                  {item.replace(/^- /, '')}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (block.startsWith('1. ')) {
                          const items = block.split('\n');
                          return (
                            <ol key={idx} className="space-y-2 list-decimal pl-5 my-3">
                              {items.map((item, i) => (
                                <li key={i} className="text-sm">
                                  {item.replace(/^\d+\.\s*/, '')}
                                </li>
                              ))}
                            </ol>
                          );
                        }
                        return (
                          <p key={idx} className="text-sm sm:text-base leading-relaxed">
                            {block}
                          </p>
                        );
                      })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Article finished? Explore more engineering case studies in Featured Projects.
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Close Article
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FadeInUpSection>
    </section>
  );
}

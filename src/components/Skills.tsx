import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView, type Variants } from 'motion/react';
import FadeInUpSection from './FadeInUpSection';
import {
  Code2,
  Terminal,
  Globe,
  Layers,
  Palette,
  Zap,
  Server,
  Code,
  Cpu,
  Network,
  Database,
  HardDrive,
  Flame,
  Binary,
  CheckCircle2,
  GitBranch,
  Github,
  Box,
  Monitor,
  Send,
  Sparkles,
  Bot,
  Brain,
  Info,
  TrendingUp,
  Award,
  LucideIcon,
  Share2,
  FolderGit2,
  Check,
  RotateCcw,
  ArrowDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import SkillsForceGraph from './SkillsForceGraph';
import { ProjectItem } from './Projects';
import { portfolio } from '../data/portfolio';
import {
  getCanonicalTechForSkill,
  getMatchingProjectsForSkill,
  isTechActive,
  projectMatchesTech,
} from '../utils/techFilter';

export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'AI & Automation' | 'Database' | 'Programming' | 'Tools' | string;
  level: number;
  experience: string;
  icon: string;
  description: string;
}

interface SkillsProps {
  skills: SkillItem[];
  projects?: ProjectItem[];
  selectedTechs?: string[];
  onToggleTech?: (tech: string) => void;
  onClearTechFilters?: () => void;
  onScrollToProjects?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Terminal,
  Globe,
  Layers,
  Palette,
  Zap,
  Server,
  Code,
  Cpu,
  Network,
  Database,
  HardDrive,
  Flame,
  Binary,
  CheckCircle2,
  GitBranch,
  Github,
  Box,
  Monitor,
  Send,
  Sparkles,
  Bot,
  Brain,
};

interface DynamicProgressBarProps {
  level: number;
  shouldReduceMotion: boolean | null;
  delay?: number;
}

function DynamicProgressBar({ level, shouldReduceMotion, delay = 0 }: DynamicProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-20px' });
  const [currentScore, setCurrentScore] = useState(shouldReduceMotion ? level : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentScore(level);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    let animFrame: number;
    const duration = 1000; // ms
    const staggeredDelay = Math.min(delay * 1000, 350);

    const timer = setTimeout(() => {
      const animateStep = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Quartic ease out for fluid deceleration
        const ease = 1 - Math.pow(1 - progress, 4);
        setCurrentScore(Math.round(ease * level));

        if (progress < 1) {
          animFrame = requestAnimationFrame(animateStep);
        }
      };
      animFrame = requestAnimationFrame(animateStep);
    }, staggeredDelay);

    return () => {
      clearTimeout(timer);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isInView, level, shouldReduceMotion, delay]);

  const getTier = (val: number) => {
    if (val >= 94) {
      return {
        label: 'Mastery',
        badge: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800',
      };
    }
    if (val >= 88) {
      return {
        label: 'Advanced',
        badge: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-800',
      };
    }
    if (val >= 80) {
      return {
        label: 'Proficient',
        badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
      };
    }
    return {
      label: 'Core',
      badge: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    };
  };

  const tier = getTier(level);

  return (
    <div ref={containerRef} className="space-y-2 pt-1">
      {/* Top Labels */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Proficiency
          </span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${tier.badge}`}>
            {tier.label}
          </span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 tabular-nums">
            {currentScore}
          </span>
          <span className="text-[10px] font-mono text-indigo-500/80 dark:text-indigo-400/80 font-semibold">%</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800/90 rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-xs relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 dark:from-indigo-500 dark:via-cyan-400 dark:to-teal-300 relative shadow-xs"
          initial={shouldReduceMotion ? { width: `${level}%` } : { width: '0%' }}
          animate={isInView || shouldReduceMotion ? { width: `${level}%` } : { width: '0%' }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: shouldReduceMotion ? 0 : Math.min(delay, 0.3),
          }}
        >
          {/* Subtle glowing beacon on progress tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/95 shadow-xs" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Skills({
  skills,
  projects,
  selectedTechs: externalSelectedTechs,
  onToggleTech: externalOnToggleTech,
  onClearTechFilters: externalOnClearTechFilters,
  onScrollToProjects,
}: SkillsProps) {
  const effectiveProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects : (portfolio.projects as ProjectItem[]);
  }, [projects]);

  const [internalSelectedTechs, setInternalSelectedTechs] = useState<string[]>([]);
  const isControlled = externalSelectedTechs !== undefined;
  const selectedTechs = isControlled ? externalSelectedTechs : internalSelectedTechs;

  const handleToggleTech = useCallback(
    (tech: string) => {
      const canonical = getCanonicalTechForSkill(tech);
      if (externalOnToggleTech) {
        externalOnToggleTech(canonical);
      } else {
        setInternalSelectedTechs((prev) => {
          const isPresent = prev.some((t) => t.toLowerCase() === canonical.toLowerCase());
          if (isPresent) {
            return prev.filter((t) => t.toLowerCase() !== canonical.toLowerCase());
          } else {
            return [...prev, canonical];
          }
        });
      }
    },
    [externalOnToggleTech]
  );

  const handleClearTechFilters = useCallback(() => {
    if (externalOnClearTechFilters) {
      externalOnClearTechFilters();
    } else {
      setInternalSelectedTechs([]);
    }
  }, [externalOnClearTechFilters]);

  // List of primary technologies that have deliverables in the projects showcase
  const availableTechsWithProjects = useMemo(() => {
    const primaryOrder = [
      'React',
      'Tailwind CSS',
      'Node.js',
      'Laravel',
      'AI',
      'Docker',
      'MySQL',
      'PostgreSQL',
      'Firebase',
      'Python',
      'SQLite',
      'C#',
      'REST API',
    ];

    const result: { tech: string; count: number }[] = [];
    primaryOrder.forEach((tech) => {
      const count = effectiveProjects.filter((p) => projectMatchesTech(p, tech)).length;
      if (count > 0) {
        result.push({ tech, count });
      }
    });

    return result;
  }, [effectiveProjects]);

  const matchingProjectsTotal = useMemo(() => {
    if (selectedTechs.length === 0) return effectiveProjects.length;
    return effectiveProjects.filter((p) =>
      selectedTechs.some((tech) => projectMatchesTech(p, tech))
    ).length;
  }, [effectiveProjects, selectedTechs]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [skillViewType, setSkillViewType] = useState<'graph' | 'cards'>('graph');
  const shouldReduceMotion = useReducedMotion();

  const handleSelectSkillFromGraph = useCallback(
    (skillName: string) => {
      const found = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      if (found) {
        setActiveCategory(found.category);
      }
    },
    [skills]
  );

  const containerVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }), [shouldReduceMotion]);

  const cardVariants: Variants = useMemo(() => ({
    hidden: shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }), [shouldReduceMotion]);

  const categories = ['All', 'Frontend', 'Backend', 'AI & Automation', 'Database', 'Programming', 'Tools'];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: skills.length };
    skills.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  const averageProficiency = useMemo(() => {
    if (filteredSkills.length === 0) return 0;
    const total = filteredSkills.reduce((sum, item) => sum + item.level, 0);
    return Math.round(total / filteredSkills.length);
  }, [filteredSkills]);

  return (
    <section id="skills" className="py-20 lg:py-28 relative bg-slate-100/50 dark:bg-slate-900/30" aria-label="Skills & Technologies">
      <FadeInUpSection>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase font-mono tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Technical Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Skills &amp; Expertise
          </h2>
          <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 rounded-full mt-3 mb-4" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            A comprehensive overview of modern tools, languages, and frameworks leveraged to build scalable, production-grade digital products.
          </p>

          {/* Self-Assessed Disclaimer Note & Summary Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 text-xs">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>*Self-assessed familiarity calibrated from production deliverables and architecture experience.</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/70 dark:border-indigo-800/70">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>Avg. {averageProficiency}% in {activeCategory} ({filteredSkills.length} items)</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: D3 Interactive Force Graph vs Grid of Cards */}
        <div className="flex justify-center mb-8 px-4">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSkillViewType('graph')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                skillViewType === 'graph'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>D3.js Force-Directed Graph</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  skillViewType === 'graph'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                Interactive
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSkillViewType('cards')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                skillViewType === 'cards'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Proficiency Cards &amp; Grid</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  skillViewType === 'cards'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {skills.length}
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Technology Project Filters Toolbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Filter Projects by Technology</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {availableTechsWithProjects.length} Stacks
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click any technology (e.g. <strong>React</strong>) to toggle and highlight all deliverables built with it in the Projects showcase.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedTechs.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleClearTechFilters}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear ({selectedTechs.length})</span>
                    </button>
                    {onScrollToProjects && (
                      <button
                        type="button"
                        onClick={onScrollToProjects}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs cursor-pointer active:scale-95 transition-all"
                      >
                        <span>View {matchingProjectsTotal} Projects</span>
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Technology Pill Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {availableTechsWithProjects.map(({ tech, count }) => {
                const isSelected = isTechActive(tech, selectedTechs);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleToggleTech(tech)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400/40 scale-105'
                        : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/70 dark:border-slate-700/70'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <FolderGit2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                    )}
                    <span>{tech}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {skillViewType === 'cards' && (
          /* Category Filter Pills */
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 inline-flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </FadeInUpSection>

      {skillViewType === 'graph' ? (
        /* D3.js Force-Directed Graph Showcase */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkillsForceGraph
            skills={skills}
            projects={effectiveProjects}
            onSelectSkill={handleSelectSkillFromGraph}
            selectedTechs={selectedTechs}
            onToggleTech={handleToggleTech}
          />
        </div>
      ) : (
        /* Skills Grid Container with Staggered Entrance */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.05, margin: '0px 0px -40px 0px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSkills.map((skill, index) => {
              const Icon = iconMap[skill.icon] || Code2;
              const matchingProjects = getMatchingProjectsForSkill(skill.name, effectiveProjects);
              const canonicalTech = getCanonicalTechForSkill(skill.name);
              const isFiltering =
                isTechActive(canonicalTech, selectedTechs) ||
                isTechActive(skill.name, selectedTechs);

              return (
                <motion.div
                  key={skill.name}
                  variants={cardVariants}
                  whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs transition-all duration-300 group flex flex-col justify-between relative ${
                    isFiltering
                      ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/80 bg-indigo-50/15 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Icon, Name, Category & Experience */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                            isFiltering
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-slate-950'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {skill.name}
                            </h3>
                            {isFiltering && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white shadow-xs">
                                Filtering
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                        {skill.experience}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {skill.description}
                    </p>
                  </div>

                  <div>
                    {/* Dynamic Scroll-Triggered Animated Proficiency Progress Bar */}
                    <DynamicProgressBar
                      level={skill.level}
                      shouldReduceMotion={shouldReduceMotion}
                      delay={index * 0.05}
                    />

                    {/* Interactive Project Filter Toggle Button on Card */}
                    {matchingProjects.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTech(canonicalTech);
                          }}
                          title={
                            isFiltering
                              ? `Click to remove ${skill.name} filter`
                              : `Filter projects built with ${skill.name}`
                          }
                          className={`w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            isFiltering
                              ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 ring-1 ring-indigo-400/60'
                              : 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/70 dark:border-indigo-800/70'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isFiltering ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                            )}
                            <span>{isFiltering ? 'Filtering Projects' : 'Toggle Project Filter'}</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                              isFiltering
                                ? 'bg-white/20 text-white'
                                : 'bg-white/80 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50'
                            }`}
                          >
                            {matchingProjects.length} {matchingProjects.length === 1 ? 'project' : 'projects'}
                          </span>
                        </button>

                        {isFiltering && onScrollToProjects && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onScrollToProjects();
                            }}
                            className="mt-1.5 w-full inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors py-0.5 cursor-pointer"
                          >
                            <span>View {matchingProjects.length} matching in Projects</span>
                            <ArrowDown className="w-3 h-3 animate-bounce" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Floating Active Filter Notification Banner */}
      <AnimatePresence>
        {selectedTechs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto px-4 mt-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md border border-indigo-500/40 shadow-xl shadow-indigo-500/10 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Active Project Filter:</span>
                </span>
                {selectedTechs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950 text-cyan-300 border border-indigo-700/80 font-mono font-bold text-[11px]"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleToggleTech(tech)}
                      className="hover:text-white ml-0.5 cursor-pointer"
                      title={`Remove ${tech} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <span className="text-slate-400 ml-1 font-mono">
                  ({matchingProjectsTotal} {matchingProjectsTotal === 1 ? 'project matches' : 'projects match'})
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClearTechFilters}
                  className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear
                </button>
                {onScrollToProjects && (
                  <button
                    type="button"
                    onClick={onScrollToProjects}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span>View in Projects</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

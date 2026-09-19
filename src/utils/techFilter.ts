import { ProjectItem } from '../components/Projects';

/**
 * Normalizes skill names into canonical technology filter keywords used across portfolio projects.
 */
export function getCanonicalTechForSkill(skillName: string): string {
  const s = skillName.trim().toLowerCase();
  if (s.includes('react')) return 'React';
  if (s.includes('laravel')) return 'Laravel';
  if (s.includes('node') || s.includes('express')) return 'Node.js';
  if (s.includes('gemini') || s.includes('llm') || s === 'ai' || s.includes('agent') || s.includes('rag')) return 'AI';
  if (s.includes('docker')) return 'Docker';
  if (s.includes('python')) return 'Python';
  if (s.includes('postgres')) return 'PostgreSQL';
  if (s.includes('mysql')) return 'MySQL';
  if (s.includes('sqlite')) return 'SQLite';
  if (s.includes('firebase')) return 'Firebase';
  if (s.includes('tailwind')) return 'Tailwind CSS';
  if (s.includes('c#')) return 'C#';
  if (s.includes('rest') || s.includes('api')) return 'REST API';
  if (s.includes('telegram')) return 'Telegram Bot';
  if (s.includes('vite')) return 'Vite';
  if (s.includes('typescript')) return 'TypeScript';
  return skillName;
}

/**
 * Checks if a project uses or is related to a specific technology.
 */
export function projectMatchesTech(project: ProjectItem, tech: string): boolean {
  const normTech = tech.trim().toLowerCase();

  // AI & Intelligent Systems matching
  if (normTech === 'ai' || normTech.includes('gemini') || normTech.includes('llm')) {
    return (
      project.technologies.some(
        (t) =>
          t.toLowerCase().includes('ai') ||
          t.toLowerCase().includes('gemini') ||
          t.toLowerCase().includes('llm')
      ) ||
      project.title.toLowerCase().includes('ai') ||
      project.description.toLowerCase().includes('ai') ||
      Boolean(project.highlight && project.highlight.toLowerCase().includes('ai')) ||
      project.category.toLowerCase().includes('ai')
    );
  }

  // Telegram Bot or automation matching
  if (normTech.includes('telegram')) {
    return (
      project.technologies.some((t) => t.toLowerCase().includes('telegram')) ||
      project.description.toLowerCase().includes('telegram') ||
      project.title.toLowerCase().includes('telegram') ||
      project.category.toLowerCase() === 'software'
    );
  }

  return project.technologies.some((t) => {
    const normT = t.toLowerCase();
    return normT === normTech || normT.includes(normTech) || normTech.includes(normT);
  });
}

/**
 * Finds all projects associated with a given skill name.
 */
export function getMatchingProjectsForSkill(
  skillName: string,
  projects: ProjectItem[]
): ProjectItem[] {
  if (!projects || projects.length === 0) return [];
  const canonical = getCanonicalTechForSkill(skillName);
  return projects.filter(
    (p) =>
      projectMatchesTech(p, canonical) ||
      projectMatchesTech(p, skillName) ||
      p.technologies.some(
        (t) =>
          t.toLowerCase() === skillName.toLowerCase() ||
          t.toLowerCase().includes(skillName.toLowerCase()) ||
          skillName.toLowerCase().includes(t.toLowerCase())
      )
  );
}

/**
 * Checks whether a given technology tag is currently selected.
 */
export function isTechActive(techBadge: string, selectedTechs: string[]): boolean {
  if (!selectedTechs || selectedTechs.length === 0) return false;
  const normBadge = techBadge.trim().toLowerCase();
  return selectedTechs.some((selected) => {
    const normSel = selected.trim().toLowerCase();
    if (normSel === 'ai') {
      return (
        normBadge.includes('ai') ||
        normBadge.includes('gemini') ||
        normBadge.includes('llm')
      );
    }
    return (
      normBadge === normSel ||
      normBadge.includes(normSel) ||
      normSel.includes(normBadge)
    );
  });
}

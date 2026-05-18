import 'server-only';

import { faqContent } from '@/content/faq';
import { privacyPolicyContent } from '@/content/privacy-policy';
import { pricingCopy } from '@/data/pricing-copy';
import pricingConfig from '@/data/pricing-config.json';
import { getAboutMe, getPosts, getProjects, getServiceLandings } from '@/lib/sanity.server';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import type { Language } from '@/lib/language';

type LocalizedString = string | { en?: string; pl?: string };

interface SlugValue {
  current?: string;
}

interface ServiceContextItem {
  title?: LocalizedString;
  intro?: LocalizedString;
  slug?: SlugValue;
}

interface ProjectContextItem {
  title?: LocalizedString;
  description?: LocalizedString;
  technologies?: string[];
  slug?: SlugValue;
}

interface PostContextItem {
  title?: LocalizedString;
  excerpt?: LocalizedString;
  tags?: string[];
  slug?: SlugValue;
}

interface ContextChunk {
  id: string;
  title: string;
  content: string;
  category: 'core' | 'faq' | 'privacy' | 'pricing' | 'knowledge' | 'service' | 'project' | 'blog' | 'about';
  keywords: string[];
  priority?: number;
}

type PortableTextBlock = {
  children?: Array<{ text?: string }>;
};

type PricingOption = {
  label: string;
  min: number;
  max: number;
};

type PricingService = {
  label: string;
  noPrice?: boolean;
  base?: Record<string, PricingOption>;
  cms?: Record<string, PricingOption>;
  features?: Record<string, PricingOption>;
};

type DeadlineOption = {
  label: string;
};

function cleanText(value: unknown, maxLength: number = 500): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function tokenize(value: string): string[] {
  const stopWords = new Set([
    'oraz', 'albo', 'czy', 'jak', 'dla', 'the', 'and', 'with', 'what', 'how', 'can', 'you', 'ile', 'jaka', 'jaki',
    'jest', 'are', 'appcrates', 'moze', 'mozesz', 'chce', 'need', 'want',
  ]);

  return Array.from(new Set(
    normalizeForSearch(value)
      .split(/[^a-z0-9ąćęłńóśźż]+/i)
      .map((word) => word.trim())
      .filter((word) => word.length >= 3 && !stopWords.has(word))
  ));
}

function portableTextToText(value: unknown, maxLength: number = 700): string {
  if (typeof value === 'string') return cleanText(value, maxLength);
  if (!Array.isArray(value)) return '';

  const text = value
    .flatMap((block: PortableTextBlock) => Array.isArray(block?.children) ? block.children : [])
    .map((child) => typeof child?.text === 'string' ? child.text : '')
    .filter(Boolean)
    .join(' ');

  return cleanText(text, maxLength);
}

function makeChunk(input: Omit<ContextChunk, 'keywords'> & { keywords?: string[] }): ContextChunk {
  return {
    ...input,
    keywords: input.keywords || tokenize(`${input.title} ${input.content}`),
  };
}

async function getChatKnowledge(): Promise<string> {
  try {
    const [{ readFile }, { join }] = await Promise.all([
      import('fs/promises'),
      import('path'),
    ]);
    const filePath = join(process.cwd(), 'src', 'content', 'chat-knowledge.md');
    const raw = (await readFile(filePath, 'utf-8')).trim();
    return cleanText(raw, 6000);
  } catch {
    return '';
  }
}

function buildKnowledgeChunks(raw: string): ContextChunk[] {
  return raw
    .split(/\n(?=#{1,3}\s+)/)
    .map((section, index) => {
      const title = cleanText(section.match(/^#+\s+(.+)$/m)?.[1] || `Knowledge ${index + 1}`, 120);
      const content = cleanText(section.replace(/^#+\s+.+$/m, ''), 900);
      return content
        ? makeChunk({ id: `knowledge-${index}`, title, content, category: 'knowledge' })
        : null;
    })
    .filter((chunk): chunk is ContextChunk => Boolean(chunk));
}

function buildPricingChunks(language: Language): ContextChunk[] {
  const copy = pricingCopy[language];
  const services = pricingConfig.services as Record<string, PricingService>;

  const serviceChunks = Object.entries(services).map(([serviceKey, service]) => {
    const copyService = copy.services[serviceKey];
    const ranges = ['base', 'cms', 'features']
      .flatMap((group) => Object.values(service[group as keyof Pick<PricingService, 'base' | 'cms' | 'features'>] || {}))
      .filter((option) => option.min || option.max)
      .map((option) => `${option.label}: ${option.min.toLocaleString('pl-PL')}–${option.max.toLocaleString('pl-PL')} zł`)
      .slice(0, 8)
      .join('; ');

    const deadlines = Object.values(pricingConfig.multipliers.deadline?.[serviceKey as keyof typeof pricingConfig.multipliers.deadline] || {})
      .map((deadline) => (deadline as DeadlineOption).label)
      .join(', ');

    const noPrice = service.noPrice
      ? language === 'pl'
        ? 'Ten typ projektu wymaga indywidualnej konsultacji zamiast automatycznej wyceny.'
        : 'This type of project requires an individual consultation instead of automatic pricing.'
      : '';

    return makeChunk({
      id: `pricing-${serviceKey}`,
      title: copyService?.label || service.label,
      content: cleanText(`${copyService?.description || ''} ${ranges ? `Orientacyjne elementy wyceny: ${ranges}.` : ''} ${deadlines ? `Typowe terminy: ${deadlines}.` : ''} ${noPrice}`, 1200),
      category: 'pricing',
      priority: 2,
      keywords: tokenize(`${serviceKey} ${copyService?.label || service.label} ${copyService?.description || ''} ${ranges}`),
    });
  });

  return [
    makeChunk({
      id: 'pricing-general',
      title: language === 'pl' ? 'Zasady wyceny' : 'Pricing rules',
      content: language === 'pl'
        ? `${pricingConfig.disclaimer} ${copy.disclaimer} Czat może podawać orientacyjne widełki i czynniki wpływające na budżet, ale nie może traktować ich jako finalnej oferty.`
        : `${copy.disclaimer} The chat may provide rough ranges and pricing factors, but must not present them as a final offer.`,
      category: 'pricing',
      priority: 4,
    }),
    ...serviceChunks,
  ];
}

export async function buildAIContextIndex(language: Language = 'pl'): Promise<ContextChunk[]> {
  const [services, projects, posts, aboutMe, chatKnowledge] = await Promise.all([
    getServiceLandings(),
    getProjects(),
    getPosts().catch(() => []),
    getAboutMe().catch(() => null),
    getChatKnowledge(),
  ]);

  const chunks: ContextChunk[] = [];
  const appCratesDescription = language === 'pl'
    ? 'AppCrates projektuje i wdraża nowoczesne strony internetowe, aplikacje webowe, rozwiązania AI/RAG, platformy e-commerce, marketplace, migracje Next.js/TanStack oraz audyty WCAG/GDPR.'
    : 'AppCrates designs and builds modern websites, web applications, AI/RAG solutions, e-commerce platforms, marketplaces, Next.js/TanStack migrations, and WCAG/GDPR audits.';

  chunks.push(makeChunk({
    id: 'core-appcrates',
    title: 'AppCrates',
    content: appCratesDescription,
    category: 'core',
    priority: 10,
  }));

  if (aboutMe) {
    const intro = getLocalizedText(aboutMe.intro, language);
    const highlights = getLocalizedArray<string>(aboutMe.highlights, language).join(', ');
    const story = portableTextToText(getLocalizedArray<PortableTextBlock>(aboutMe.story, language), 600);

    chunks.push(makeChunk({
      id: 'about-me',
      title: language === 'pl' ? 'O AppCrates' : 'About AppCrates',
      content: cleanText(`${intro} ${highlights} ${story}`, 1000),
      category: 'about',
      priority: 3,
    }));
  }

  faqContent[language].faqs.forEach((faq, index) => {
    chunks.push(makeChunk({
      id: `faq-${index}`,
      title: cleanText(faq.question, 140),
      content: `Q: ${cleanText(faq.question, 160)}\nA: ${cleanText(faq.answer, 420)}`,
      category: 'faq',
      priority: 1,
    }));
  });

  privacyPolicyContent[language].sections.forEach((section, index) => {
    chunks.push(makeChunk({
      id: `privacy-${index}`,
      title: section.title,
      content: `${cleanText(section.title, 140)}: ${cleanText(section.paragraphs.join(' '), 650)}`,
      category: 'privacy',
      keywords: tokenize(`${section.title} ${section.paragraphs.join(' ')} rodo gdpr privacy prywatnosc dane cookies newsletter`),
    }));
  });

  chunks.push(...buildKnowledgeChunks(chatKnowledge));
  chunks.push(...buildPricingChunks(language));

  services.forEach((service: ServiceContextItem) => {
    const title = getLocalizedText(service.title, language);
    const intro = getLocalizedText(service.intro, language);
    if (!title && !intro) return;

    chunks.push(makeChunk({
      id: `service-${service.slug?.current || title}`,
      title: cleanText(title, 140),
      content: cleanText(`${title}. ${intro}`, 700),
      category: 'service',
      priority: 1,
    }));
  });

  projects.forEach((project: ProjectContextItem) => {
    const title = getLocalizedText(project.title, language);
    const description = getLocalizedText(project.description, language);
    const technologies = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
    if (!title && !description) return;

    chunks.push(makeChunk({
      id: `project-${project.slug?.current || title}`,
      title: cleanText(title, 140),
      content: cleanText(`${title}. ${description} ${technologies ? `Technologie: ${technologies}.` : ''}`, 700),
      category: 'project',
      priority: 1,
    }));
  });

  (posts as PostContextItem[]).forEach((post) => {
    const title = getLocalizedText(post.title, language);
    const excerpt = getLocalizedText(post.excerpt, language);
    const tags = Array.isArray(post.tags) ? post.tags.join(', ') : '';
    if (!title && !excerpt) return;

    chunks.push(makeChunk({
      id: `blog-${post.slug?.current || title}`,
      title: cleanText(title, 140),
      content: cleanText(`${title}. ${excerpt} ${tags ? `Tagi: ${tags}.` : ''}`, 650),
      category: 'blog',
      keywords: tokenize(`${title} ${excerpt} ${tags} blog artykul article wiedza poradnik case study`),
    }));
  });

  return chunks.filter((chunk) => chunk.content);
}

function getIntentBoosts(query: string): Partial<Record<ContextChunk['category'], number>> {
  const normalized = normalizeForSearch(query);
  return {
    pricing: /\b(cena|koszt|wycena|budzet|ile|price|pricing|cost|budget|quote)\b/.test(normalized) ? 8 : 0,
    privacy: /\b(rodo|gdpr|privacy|prywatnosc|dane|cookies|newsletter|zgoda)\b/.test(normalized) ? 8 : 0,
    blog: /\b(blog|artykul|article|wpis|poradnik|case study|wiedza|know)\b/.test(normalized) ? 5 : 0,
    service: /\b(usluga|oferta|service|offer|strona|sklep|ecommerce|marketplace|ai|saas)\b/.test(normalized) ? 4 : 0,
    project: /\b(projekt|realizacja|portfolio|case|project|realization)\b/.test(normalized) ? 5 : 0,
    faq: /\b(jak|czy|what|how|can|proces|process|czas|termin)\b/.test(normalized) ? 2 : 0,
  };
}

function scoreChunk(chunk: ContextChunk, queryTerms: string[], boosts: Partial<Record<ContextChunk['category'], number>>): number {
  if (chunk.category === 'core') return 100;

  const haystack = normalizeForSearch(`${chunk.title} ${chunk.content} ${chunk.keywords.join(' ')}`);
  const lexicalScore = queryTerms.reduce((score, term) => (
    haystack.includes(term) ? score + (chunk.title.toLowerCase().includes(term) ? 4 : 2) : score
  ), 0);

  return lexicalScore + (boosts[chunk.category] || 0) + (chunk.priority || 0);
}

export function selectAIContext(chunks: ContextChunk[], query: string, language: Language = 'pl'): string {
  const queryTerms = tokenize(query);
  const boosts = getIntentBoosts(query);
  const labels = language === 'pl'
    ? { core: 'RDZEŃ', selected: 'WYBRANE ŹRÓDŁA' }
    : { core: 'CORE', selected: 'SELECTED SOURCES' };

  const coreChunks = chunks.filter((chunk) => chunk.category === 'core');
  const selectedChunks = chunks
    .filter((chunk) => chunk.category !== 'core')
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTerms, boosts) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map((entry) => entry.chunk);

  const fallbackChunks = selectedChunks.length
    ? selectedChunks
    : chunks.filter((chunk) => chunk.category === 'about' || chunk.category === 'faq' || chunk.category === 'pricing').slice(0, 5);

  return [
    `=== ${labels.core} ===`,
    ...coreChunks.map((chunk) => `${chunk.title}: ${chunk.content}`),
    '',
    `=== ${labels.selected} ===`,
    ...fallbackChunks.map((chunk) => `[${chunk.category.toUpperCase()}] ${chunk.title}\n${chunk.content}`),
  ].join('\n').slice(0, 5200).trim();
}

export async function buildAIContext(language: Language = 'pl', query: string = ''): Promise<string> {
  const chunks = await buildAIContextIndex(language);
  return selectAIContext(chunks, query, language);
}

import 'server-only';

import { faqContent } from '@/content/faq';
import { privacyPolicyContent } from '@/content/privacy-policy';
import { getAboutMe, getPosts, getProjects, getServiceLandings } from '@/lib/sanity.server';
import { getLocalizedText } from '@/lib/localize';
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

interface PostContextItem {
  title?: LocalizedString;
  excerpt?: LocalizedString;
  slug?: SlugValue;
}

interface ProjectContextItem {
  title?: LocalizedString;
  description?: LocalizedString;
  technologies?: string[];
  slug?: SlugValue;
}

function cleanText(value: unknown, maxLength: number = 500): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function formatFaqContext(language: Language) {
  return faqContent[language].faqs
    .map((faq) => `Q: ${cleanText(faq.question, 240)}\nA: ${cleanText(faq.answer, 600)}`)
    .join('\n\n');
}

function formatPrivacyPolicyContext(language: Language) {
  return privacyPolicyContent[language].sections
    .map((section) => {
      const paragraphs = section.paragraphs
        .map((paragraph) => cleanText(paragraph, 700))
        .join(' ');
      return `${cleanText(section.title, 180)}: ${paragraphs}`;
    })
    .join('\n\n');
}

async function getChatKnowledge(): Promise<string> {
  try {
    const [{ readFile }, { join }] = await Promise.all([
      import('fs/promises'),
      import('path'),
    ]);
    const filePath = join(process.cwd(), 'src', 'content', 'chat-knowledge.md');
    return (await readFile(filePath, 'utf-8')).trim();
  } catch {
    return '';
  }
}

export async function buildAIContext(language: Language = 'pl'): Promise<string> {
  const [services, posts, projects, aboutMe, chatKnowledge] = await Promise.all([
    getServiceLandings(),
    getPosts(),
    getProjects(),
    getAboutMe().catch(() => null),
    getChatKnowledge(),
  ]);

  const serviceContext = services
    .slice(0, 20)
    .map((service: ServiceContextItem) => {
      const title = getLocalizedText(service.title, language);
      const intro = getLocalizedText(service.intro, language);
      const slug = service.slug?.current ? `/uslugi/${service.slug.current}` : '';
      return `- ${cleanText(title, 180)}${slug ? ` (${slug})` : ''}: ${cleanText(intro, 450)}`;
    })
    .filter(Boolean)
    .join('\n');

  const postContext = posts
    .slice(0, 10)
    .map((post: PostContextItem) => {
      const title = getLocalizedText(post.title, language);
      const excerpt = getLocalizedText(post.excerpt, language);
      const slug = post.slug?.current ? `/blog/${post.slug.current}` : '';
      return `- ${cleanText(title, 180)}${slug ? ` (${slug})` : ''}: ${cleanText(excerpt, 350)}`;
    })
    .filter(Boolean)
    .join('\n');

  const projectContext = projects
    .slice(0, 10)
    .map((project: ProjectContextItem) => {
      const title = getLocalizedText(project.title, language);
      const description = getLocalizedText(project.description, language);
      const technologies = Array.isArray(project.technologies) ? project.technologies.join(', ') : '';
      const slug = project.slug?.current ? `/project/${project.slug.current}` : '';
      return `- ${cleanText(title, 180)}${slug ? ` (${slug})` : ''}: ${cleanText(description, 350)}${technologies ? ` Technologie: ${cleanText(technologies, 200)}` : ''}`;
    })
    .filter(Boolean)
    .join('\n');

  const aboutContext = aboutMe
    ? `${cleanText(getLocalizedText(aboutMe.title, language), 180)}: ${cleanText(getLocalizedText(aboutMe.intro, language), 500)}`
    : '';
  const appCratesDescription = language === 'pl'
    ? 'AppCrates projektuje i wdraża nowoczesne strony internetowe, aplikacje webowe, rozwiązania AI/RAG, platformy e-commerce, marketplace, migracje Next.js/TanStack oraz audyty WCAG/GDPR.'
    : 'AppCrates designs and builds modern websites, web applications, AI/RAG solutions, e-commerce platforms, marketplaces, Next.js/TanStack migrations, and WCAG/GDPR audits.';
  const labels = language === 'pl'
    ? {
      about: 'O MNIE',
      privacy: 'POLITYKA PRYWATNOŚCI',
      knowledge: 'DODATKOWA WIEDZA: USŁUGI I WYCENA',
      services: 'USŁUGI',
      projects: 'PROJEKTY',
      posts: 'OSTATNIE WPISY BLOGOWE',
    }
    : {
      about: 'ABOUT',
      privacy: 'PRIVACY POLICY',
      knowledge: 'ADDITIONAL KNOWLEDGE: APPCRATES, PERSON, SERVICES AND PRICING',
      services: 'SERVICES',
      projects: 'PROJECTS',
      posts: 'LATEST BLOG POSTS',
    };

  return `
=== APPCRATES ===
${appCratesDescription}

=== ${labels.about} ===
${aboutContext}

=== FAQ ===
${formatFaqContext(language)}

=== ${labels.privacy} ===
${formatPrivacyPolicyContext(language)}

=== ${labels.knowledge} ===
${chatKnowledge}

=== ${labels.services} ===
${serviceContext}

=== ${labels.projects} ===
${projectContext}

=== ${labels.posts} ===
${postContext}
`.trim();
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowUpRight, Feather, Github, Globe } from 'lucide-react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getProject, getProjects, urlFor } from '@/lib/sanity.server';
import { getRequestLanguage } from '@/lib/request-language';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { translations } from '@/translations/translations';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getRequestLanguage();
  const project = await getProject(slug);

  if (!project?._id) {
    return {
      title: translations[language].projectDetails.backToProjects,
      alternates: { canonical: absoluteUrl('/') },
    };
  }

  const title = getLocalizedText(project.title, language);
  const description = getLocalizedText(project.description, language);
  const metaTitle = getLocalizedText(project.seo?.metaTitle, language, title);
  const metaDescription = getLocalizedText(project.seo?.metaDescription, language, description);
  const canonical = project.seo?.canonicalUrl || absoluteUrl(`/project/${project.slug.current}`);
  const ogImage = project.seo?.ogImage
    ? urlFor(project.seo.ogImage).width(1200).height(630).fit('crop').auto('format').url()
    : project.mainImage
      ? urlFor(project.mainImage).width(1200).height(630).fit('crop').auto('format').url()
      : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: project.seo?.keywords,
    alternates: { canonical },
    robots: project.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const language = await getRequestLanguage();
  const t = translations[language].projectDetails;
  const project = await getProject(slug);

  if (!project?._id) {
    notFound();
  }

  const title = getLocalizedText(project.title, language);
  const description = getLocalizedText(project.description, language);
  const body = getLocalizedArray<any>(project.body, language);
  const heroImageUrl = project.mainImage ? urlFor(project.mainImage).auto('format').fit('max').url() : '';

  return (
    <>
      <NextHeader />

      <main className="min-h-screen bg-indigo-950 pt-16 lg:pt-24 pb-24">
        {heroImageUrl ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
            <div className="relative h-[38vh] sm:h-[44vh] lg:h-[50vh] overflow-hidden border border-white/10">
              <img
                src={heroImageUrl}
                alt={title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/70 via-indigo-950/20 to-transparent pointer-events-none" />
            </div>
          </div>
        ) : null}

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a href="/#services" className="inline-flex items-center text-white/60 hover:text-teal-300 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-jakarta text-sm">{t.backToProjects}</span>
            </a>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight mb-8">
            <BurnSpotlightText as="span" className="font-inherit text-inherit" glowSize={150}>
              {title}
            </BurnSpotlightText>
          </h1>

          {project.technologies?.length ? (
            <div className="flex flex-wrap gap-3 mb-12">
              {project.technologies.map((tech: string) => (
                <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 font-jakarta text-sm">{tech}</span>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 mb-16 pb-12 border-b border-white/10">
            {project.projectUrl ? (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors">
                <Globe className="w-4 h-4" />
                {t.liveDemo}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white font-jakarta hover:border-teal-300 hover:text-teal-300 transition-colors">
                <Github className="w-4 h-4" />
                {t.sourceCode}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : null}
            {project.blogUrl ? (
              <a href={project.blogUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white font-jakarta hover:border-teal-300 hover:text-teal-300 transition-colors">
                <Feather className="w-4 h-4" />
                {t.blogPost}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : null}
          </div>

          <article className="prose prose-lg prose-invert max-w-none font-jakarta prose-headings:font-jakarta prose-headings:font-light prose-headings:text-white prose-h1:text-teal-300 prose-h2:text-teal-300 prose-h3:text-white prose-h4:text-white prose-p:text-white/60 prose-p:leading-relaxed prose-a:text-teal-300 prose-a:no-underline hover:prose-a:text-teal-200 prose-strong:text-white prose-strong:font-medium prose-li:text-white/60 prose-li:marker:text-teal-300 prose-ul:text-white/60 prose-ol:text-white/60 prose-code:text-teal-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-teal-300 prose-blockquote:text-white/50 prose-img:rounded-lg prose-img:border prose-img:border-white/10">
            {body.length ? <PortableText value={body} components={portableTextComponentsServer} /> : <p>{description}</p>}
          </article>
        </section>
      </main>

      <NextFooter />
    </>
  );
}

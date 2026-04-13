import { AIGeneratorInput } from '../../components/AIGeneratorInput';
import { AIWholePostGenerator } from '../../components/AIWholePostGenerator';

export default {
  name: 'serviceLanding',
  title: 'Service Landing',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    {
      name: 'aiGenerate',
      title: 'AI Generator',
      type: 'text',
      group: 'content',
      components: { input: AIWholePostGenerator },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Title',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a high-converting service landing page title in {{language}} for "{{title}}". Keep it clear and specific. Max 60 characters.' },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish Title',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a high-converting service landing page title in {{language}} for "{{title}}". Keep it clear and specific. Max 60 characters.' },
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Website Development', value: 'website-development' },
          { title: 'E-commerce Development', value: 'ecommerce-development' },
          { title: 'Automation & Backend', value: 'automation-backend' },
          { title: 'WCAG Accessibility', value: 'wcag-accessibility' },
          { title: 'SEO & Optimization', value: 'seo-optimization' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'city',
      title: 'City (optional)',
      type: 'string',
      group: 'content',
      description: 'Leave empty for non-local landing pages. Fill when page targets a specific city.',
    },
    {
      name: 'isLocalLanding',
      title: 'Local landing page',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
    {
      name: 'eyebrow',
      title: 'Section Label (Eyebrow)',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
    },
    {
      name: 'intro',
      title: 'Intro / Subtitle',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a concise, persuasive intro for a service landing page titled "{{title}}" in {{language}}. 2-3 sentences.' },
          rows: 3,
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a concise, persuasive intro for a service landing page titled "{{title}}" in {{language}}. 2-3 sentences.' },
          rows: 3,
        },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      name: 'problems',
      title: 'Problems You Solve',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
      ],
    },
    {
      name: 'deliverables',
      title: 'What Client Gets',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(8),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(8),
        },
      ],
    },
    {
      name: 'processSteps',
      title: 'Process Steps',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
      ],
    },
    {
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English FAQ',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
        },
        {
          name: 'pl',
          title: 'Polish FAQ',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      title: 'Additional Rich Content',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Content',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
        },
        {
          name: 'pl',
          title: 'Polish Content',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
        },
      ],
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short CTA button label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short CTA button label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
      ],
    },
    {
      name: 'ctaSecondaryLabel',
      title: 'Secondary CTA Label',
      type: 'object',
      group: 'content',
      description: 'Label for the secondary (outline) CTA button. Falls back to "View projects".',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
    },
    {
      name: 'stats',
      title: 'Key Stats',
      type: 'object',
      group: 'content',
      description: 'Optional highlight numbers shown below the hero (e.g. "50+" → "projects completed"). Max 4.',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Number / Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
          validation: (Rule: any) => Rule.max(4),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Number / Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
          validation: (Rule: any) => Rule.max(4),
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta title in {{language}} for service page "{{title}}". Max 60 characters.' },
              validation: (Rule: any) => Rule.max(60),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta title in {{language}} for service page "{{title}}". Max 60 characters.' },
              validation: (Rule: any) => Rule.max(60),
            },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta description in {{language}} for service page "{{title}}". Include a clear value proposition. Max 160 characters.' },
              rows: 3,
              validation: (Rule: any) => Rule.max(160),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta description in {{language}} for service page "{{title}}". Include a clear value proposition. Max 160 characters.' },
              rows: 3,
              validation: (Rule: any) => Rule.max(160),
            },
          ],
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } },
        { name: 'noIndex', title: 'Noindex', type: 'boolean', initialValue: false },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    },
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titlePl: 'title.pl',
      slug: 'slug.current',
      city: 'city',
    },
    prepare(selection: any) {
      const { titleEn, titlePl, slug, city } = selection;
      return {
        title: titleEn || titlePl || 'Untitled Service Landing',
        subtitle: `${slug ? `/${slug}` : 'No slug'}${city ? ` • ${city}` : ''}`,
      };
    },
  },
};

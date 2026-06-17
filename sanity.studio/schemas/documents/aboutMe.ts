const localizedString = (name: string, title: string, required = false) => ({
  name,
  title,
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'string',
      validation: required ? (Rule: any) => Rule.required() : undefined,
    },
    {
      name: 'pl',
      title: 'Polish',
      type: 'string',
      validation: required ? (Rule: any) => Rule.required() : undefined,
    },
  ],
});

const localizedText = (name: string, title: string, rows = 3, required = false) => ({
  name,
  title,
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'text',
      rows,
      validation: required ? (Rule: any) => Rule.required() : undefined,
    },
    {
      name: 'pl',
      title: 'Polish',
      type: 'text',
      rows,
      validation: required ? (Rule: any) => Rule.required() : undefined,
    },
  ],
});

const localizedStringArray = (name: string, title: string) => ({
  name,
  title,
  type: 'object',
  fields: [
    { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
    { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'string' }] },
  ],
});

const localizedCardArray = (name: string, title: string, extraFields: any[] = []) => ({
  name,
  title,
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            ...extraFields,
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    },
    {
      name: 'pl',
      title: 'Polish',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            ...extraFields,
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    },
  ],
});

const localizedHighlightArray = (name = 'highlights', title = 'Highlights') => ({
  name,
  title,
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    },
    {
      name: 'pl',
      title: 'Polish',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    },
  ],
});

export default {
  name: 'aboutMe',
  title: 'About Me Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'sections', title: 'Page Sections' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    { ...localizedString('title', 'Title / SEO fallback', true), group: 'content' },
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
    { ...localizedText('intro', 'Intro / SEO fallback', 3), group: 'content' },
    {
      name: 'heroImage',
      title: 'Hero Image / SEO fallback',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedString('eyebrow', 'Eyebrow'),
        localizedString('title', 'Title prefix'),
        localizedString('accent', 'Title accent'),
        localizedString('subtitle', 'Subtitle'),
        localizedString('question', 'Question'),
        {
          name: 'portrait',
          title: 'Portrait image',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
        localizedStringArray('mindLabels', 'Mind map labels'),
      ],
    },
    {
      name: 'founderStatement',
      title: 'Founder Statement',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedString('headline', 'Headline'),
        localizedString('accent', 'Accent line'),
        localizedStringArray('paragraphs', 'Paragraphs'),
      ],
    },
    {
      name: 'principlesSection',
      title: 'Operating Principles',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedString('eyebrow', 'Eyebrow'),
        localizedString('title', 'Title prefix'),
        localizedString('accent', 'Title accent'),
        localizedCardArray('cards', 'Cards'),
      ],
    },
    {
      name: 'processSection',
      title: 'Process',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedString('eyebrow', 'Eyebrow'),
        localizedString('title', 'Title prefix'),
        localizedString('accent', 'Title accent'),
        {
          name: 'steps',
          title: 'Steps',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'step', title: 'Number', type: 'string' },
                    { name: 'verb', title: 'Verb / Eyebrow', type: 'string' },
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'detail', title: 'Detail', type: 'text', rows: 3 },
                  ],
                  preview: { select: { title: 'name', subtitle: 'verb' } },
                },
              ],
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'step', title: 'Number', type: 'string' },
                    { name: 'verb', title: 'Verb / Eyebrow', type: 'string' },
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'detail', title: 'Detail', type: 'text', rows: 3 },
                  ],
                  preview: { select: { title: 'name', subtitle: 'verb' } },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'beyondCodeSection',
      title: 'Beyond Code',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedString('eyebrow', 'Eyebrow'),
        localizedString('title', 'Title prefix'),
        localizedString('accent', 'Title accent'),
        localizedCardArray('cards', 'Cards', [
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
          },
        ]),
      ],
    },
    {
      name: 'ctaSection',
      title: 'CTA',
      type: 'object',
      group: 'sections',
      options: { collapsible: true, collapsed: false },
      fields: [
        localizedStringArray('headlineLines', 'Headline lines'),
        localizedString('accent', 'Accent line'),
        localizedHighlightArray('highlights', 'CTA highlights'),
        localizedString('primaryButton', 'Primary button label'),
        localizedString('secondaryButton', 'Secondary button label'),
      ],
    },
    { ...localizedHighlightArray(), group: 'content' },
    { ...localizedString('ctaProjects', 'CTA Label - Projects'), group: 'content' },
    { ...localizedString('ctaContact', 'CTA Label - Contact'), group: 'content' },
    {
      name: 'backgrounds',
      title: 'Background Images',
      type: 'object',
      group: 'media',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'hero', title: 'Hero / Principles / CTA background', type: 'image', options: { hotspot: true } },
        { name: 'process', title: 'Process background', type: 'image', options: { hotspot: true } },
        { name: 'beyondCode', title: 'Beyond Code background', type: 'image', options: { hotspot: true } },
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
            { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.max(60) },
            { name: 'pl', title: 'Polish', type: 'string', validation: (Rule: any) => Rule.max(60) },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            { name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule: any) => Rule.max(160) },
            { name: 'pl', title: 'Polish', type: 'text', rows: 3, validation: (Rule: any) => Rule.max(160) },
          ],
        },
        { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
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
    },
    prepare(selection: any) {
      const { titleEn, titlePl, slug } = selection;
      return {
        title: titleEn || titlePl || 'Untitled About Me',
        subtitle: slug ? `/${slug}` : 'No slug set',
      };
    },
  },
};

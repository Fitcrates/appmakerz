export default {
  name: 'aboutMe',
  title: 'About Me Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'pl', title: 'Polish', type: 'string', validation: (Rule: any) => Rule.required() },
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
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'text', rows: 3 },
        { name: 'pl', title: 'Polish', type: 'text', rows: 3 },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'story',
      title: 'Story (Portable Text)',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Story',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish Story',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
        { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'ctaProjects',
      title: 'CTA Label - Projects',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
      ],
    },
    {
      name: 'ctaContact',
      title: 'CTA Label - Contact',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'pl', title: 'Polish', type: 'string' },
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

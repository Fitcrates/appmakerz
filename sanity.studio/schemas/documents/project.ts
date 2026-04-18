import { AIGeneratorInput } from '../../components/AIGeneratorInput';
import { AIWholePostGenerator } from '../../components/AIWholePostGenerator';

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'links', title: 'Links' },
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
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish Title',
          type: 'string',
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
      name: 'description',
      title: 'Description',
      type: 'object',
      group: 'content',
      description: 'Short project description shown in cards and used as default meta description',
      fields: [
        {
          name: 'en',
          title: 'English Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(300).warning('Keep under 300 chars for SEO'),
        },
        {
          name: 'pl',
          title: 'Polish Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(300).warning('Keep under 300 chars for SEO'),
        },
      ],
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Descriptive alt text for accessibility and SEO',
        },
      ],
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    },
    {
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      group: 'links',
    },
    {
      name: 'blogUrl',
      title: 'Blog URL',
      type: 'url',
      group: 'links',
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'links',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Content',
          type: 'array',
          components: { input: AIGeneratorInput },
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'H4', value: 'h4'},
                {title: 'Quote', value: 'blockquote'}
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                  {title: 'Code', value: 'code'}
                ],
                annotations: [
                  {
                    title: 'URL',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url'
                      }
                    ]
                  }
                ]
              }
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Required for accessibility and SEO',
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string',
                },
              ],
            },
            {
              title: 'Code Block',
              type: 'code',
              options: {
                language: 'javascript',
                languageAlternatives: [
                  {title: 'Javascript', value: 'javascript'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'JSX', value: 'jsx'},
                  {title: 'TSX', value: 'tsx'},
                  {title: 'Python', value: 'python'},
                  {title: 'PHP', value: 'php'},
                  {title: 'JSON', value: 'json'},
                  {title: 'Bash', value: 'bash'},
                  {title: 'formula', value: 'formula'},
                ]
              }
            }
          ],
        },
        {
          name: 'pl',
          title: 'Polish Content',
          type: 'array',
          components: { input: AIGeneratorInput },
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H1', value: 'h1'},
                {title: 'H2', value: 'h2'},
                {title: 'H3', value: 'h3'},
                {title: 'H4', value: 'h4'},
                {title: 'Quote', value: 'blockquote'}
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                  {title: 'Code', value: 'code'}
                ],
                annotations: [
                  {
                    title: 'URL',
                    name: 'link',
                    type: 'object',
                    fields: [
                      {
                        title: 'URL',
                        name: 'href',
                        type: 'url'
                      }
                    ]
                  }
                ]
              }
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Required for accessibility and SEO',
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string',
                },
              ],
            },
            {
              title: 'Code Block',
              type: 'code',
              options: {
                language: 'javascript',
                languageAlternatives: [
                  {title: 'Javascript', value: 'javascript'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'JSX', value: 'jsx'},
                  {title: 'TSX', value: 'tsx'},
                  {title: 'Python', value: 'python'},
                  {title: 'PHP', value: 'php'},
                  {title: 'JSON', value: 'json'},
                  {title: 'Bash', value: 'bash'},
                  {title: 'Formula', value: 'formula'},
                ]
              }
            }
          ],
        },
      ],
    },
    // ─── SEO Fields ───────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'Override defaults for search engine optimization. Leave blank to auto-generate from title/description.',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          description: 'Custom title for search results. Defaults to project title if empty.',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'string',
              validation: (Rule: any) =>
                Rule.max(60).warning('Keep meta titles under 60 characters for best display in search results'),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'string',
              validation: (Rule: any) =>
                Rule.max(60).warning('Keep meta titles under 60 characters'),
            },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          description: 'Custom description for search results. Defaults to description if empty.',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'text',
              rows: 3,
              validation: (Rule: any) =>
                Rule.max(160).warning('Optimal meta descriptions are 120-160 characters'),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'text',
              rows: 3,
              validation: (Rule: any) =>
                Rule.max(160).warning('Optimal meta descriptions are 120-160 characters'),
            },
          ],
        },
        {
          name: 'keywords',
          title: 'Focus Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          description: 'Primary keywords for this project (used in meta keywords tag)',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Override the default canonical URL (use only if content exists elsewhere)',
        },
        {
          name: 'ogImage',
          title: 'Social Share Image Override',
          type: 'image',
          description: 'Custom image for social media sharing. Defaults to main image if empty. Recommended: 1200×630px.',
          options: { hotspot: true },
        },
        {
          name: 'noIndex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          description: 'Enable to prevent this project from being indexed by search engines',
          initialValue: false,
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection: any) {
      const { publishedAt } = selection;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft';
      return {
        ...selection,
        subtitle: date,
      };
    },
  },
}

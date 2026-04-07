import { AIGeneratorInput } from '../../components/AIGeneratorInput';

export default {
  name: 'post',
  title: 'Post',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: {type: 'author'},
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Dev', value: 'Dev' },
              { title: 'No-code', value: 'No-code' },
              { title: 'Wellness', value: 'Wellness' },
            ],
          },
        },
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add relevant tags for categorization and internal linking',
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    },
    {
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      group: 'meta',
      initialValue: 0,
      readOnly: true,
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      group: 'content',
      description: 'Short summary shown in blog cards and used as default meta description',
      fields: [
        {
          name: 'en',
          title: 'English Excerpt',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write an engaging 2-3 sentence blog post summary describing the article titled "{{title}}" in {{language}}.' },
          rows: 4,
          validation: (Rule: any) => Rule.max(300).warning('Keep excerpts under 300 chars for SEO'),
        },
        {
          name: 'pl',
          title: 'Polish Excerpt',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write an engaging 2-3 sentence blog post summary describing the article titled "{{title}}" in {{language}}.' },
          rows: 4,
          validation: (Rule: any) => Rule.max(300).warning('Keep excerpts under 300 chars for SEO'),
        },
      ],
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
                ]
              }
            }
          ],
        },
        {
          name: 'pl',
          title: 'Polish Content',
          type: 'array',
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
      description: 'Override defaults for search engine optimization. Leave blank to auto-generate from title/excerpt.',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          description: 'Custom title for search results. Defaults to post title if empty.',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an optimized SEO meta title for an article titled "{{title}}" in {{language}}. Keep it dramatic but descriptive. Return ONLY the title text, max 60 chars.' },
              validation: (Rule: any) =>
                Rule.max(60).warning('Keep meta titles under 60 characters for best display in search results'),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an optimized SEO meta title for an article titled "{{title}}" in {{language}}. Keep it dramatic but descriptive. Return ONLY the title text, max 60 chars.' },
              validation: (Rule: any) =>
                Rule.max(60).warning('Keep meta titles under 60 characters'),
            },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          description: 'Custom description for search results. Defaults to excerpt if empty.',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write a strong SEO meta description for an article titled "{{title}}" in {{language}}. Max 150 characters, include a call to action. Return ONLY text.' },
              rows: 3,
              validation: (Rule: any) =>
                Rule.max(160).warning('Optimal meta descriptions are 120-160 characters'),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write a strong SEO meta description for an article titled "{{title}}" in {{language}}. Max 150 characters, include a call to action. Return ONLY text.' },
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
          description: 'Primary keywords for this post (used in meta keywords tag)',
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
          description: 'Enable to prevent this post from being indexed by search engines',
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
    {
      title: 'Most Viewed',
      name: 'viewCountDesc',
      by: [{ field: 'viewCount', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection: any) {
      const { author, publishedAt } = selection;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft';
      return {
        ...selection,
        subtitle: `${date}${author ? ` • by ${author}` : ''}`,
      };
    },
  },
}

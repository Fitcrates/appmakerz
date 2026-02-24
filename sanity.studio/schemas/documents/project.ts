export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
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
      fields: [
        {
          name: 'en',
          title: 'English Description',
          type: 'text',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish Description',
          type: 'text',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
    },
    {
      name: 'blogUrl',
      title: 'Blog URL',
      type: 'url',
    },
    {
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'object',
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
              }
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
              }
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
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'mainImage',
    },
  },
}

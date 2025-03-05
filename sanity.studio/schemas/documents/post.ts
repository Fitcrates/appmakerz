import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'pl',
          title: 'Polish Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English Excerpt',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'pl',
          title: 'Polish Excerpt',
          type: 'text',
          rows: 4,
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({
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
                ]
              }
            }
          ],
        }),
        defineField({
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
                ]
              }
            }
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection;
      return {...selection, subtitle: author && `by ${author}`};
    },
  },
})

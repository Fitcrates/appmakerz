export default {
  name: 'post',
  title: 'Post',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Excerpt',
          type: 'text',
          rows: 4,
        },
        {
          name: 'pl',
          title: 'Polish Excerpt',
          type: 'text',
          rows: 4,
        },
      ],
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
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
        {
          name: 'pl',
          title: 'Polish Content',
          type: 'array',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
}

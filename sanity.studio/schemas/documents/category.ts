export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English title',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish title',
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
          title: 'English description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'pl',
          title: 'Polish description',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'color',
      title: 'Accent color',
      type: 'string',
      description: 'Hex color used for category chips, for example #5eead4.',
      initialValue: '#5eead4',
      validation: (Rule: any) =>
        Rule.regex(/^#[0-9a-fA-F]{6}$/).warning('Use a 6-digit hex color, for example #5eead4.'),
    },
    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 100,
      validation: (Rule: any) => Rule.integer().min(0),
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title.en', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'title.pl',
    },
  },
};

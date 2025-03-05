export default {
    name: 'pages',
    title: 'Pages',
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
          source: (doc: any) => doc.title?.en || doc.title?.pl,
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'content',
        title: 'Content',
        type: 'object',
        fields: [
          {
            name: 'en',
            title: 'English Content',
            type: 'array',
            of: [
              { type: 'block' },
              { type: 'image', options: { hotspot: true } },
            ],
            validation: (Rule: any) => Rule.required(),
          },
          {
            name: 'pl',
            title: 'Polish Content',
            type: 'array',
            of: [
              { type: 'block' },
              { type: 'image', options: { hotspot: true } },
            ],
            validation: (Rule: any) => Rule.required(),
          },
        ],
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
          title: titleEn || titlePl || 'Untitled Page',
          subtitle: slug ? `/${slug}` : 'No slug set',
        };
      },
    },
  };
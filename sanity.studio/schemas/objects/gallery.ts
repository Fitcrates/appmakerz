export default {
  name: 'gallery',
  type: 'object',
  title: 'Gallery',
  fields: [
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (Rule: any) => Rule.required().warning('Add alt text for accessibility and image search.'),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        }
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      description: 'Optional video URL (e.g. YouTube, Vimeo, MP4 file link) to display instead of or along with images.',
    },
    {
      name: 'display',
      type: 'string',
      title: 'Display Style',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel (Swipeable)', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    },
    {
      name: 'columns',
      type: 'number',
      title: 'Grid Columns',
      description: 'Number of columns on larger screens (1-4). Defaults to 2.',
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 2,
      hidden: ({ parent }: any) => parent?.display === 'carousel',
    },
    {
      name: 'aspectRatio',
      type: 'string',
      title: 'Aspect Ratio',
      options: {
        list: [
          { title: 'Auto (Original)', value: 'auto' },
          { title: '1:1 (Square)', value: 'square' },
          { title: '4:3 (Standard)', value: '4/3' },
          { title: '16:9 (Widescreen)', value: '16/9' },
          { title: '3:4 (Portrait)', value: '3/4' },
        ],
      },
      initialValue: 'auto',
    },
    {
      name: 'zoom',
      type: 'boolean',
      title: 'Enable Image Zoom',
      description: 'Allow users to click on an image to view it full-screen',
      initialValue: true,
    }
  ],
  preview: {
    select: {
      images: 'images',
      display: 'display',
    },
    prepare(selection: any) {
      const { images, display } = selection;
      const count = images ? images.length : 0;
      return {
        title: `Gallery (${count} image${count === 1 ? '' : 's'})`,
        subtitle: `Display: ${display || 'grid'}`,
        media: images && images[0] ? images[0] : undefined,
      };
    },
  },
};

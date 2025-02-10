export default {
  name: 'subscriber',
  title: 'Newsletter Subscribers',
  type: 'document',
  icon: () => '📧',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'subscribedCategories',
      title: 'Subscribed Categories',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'unsubscribeToken',
      title: 'Unsubscribe Token',
      type: 'string',
      hidden: true,
    },
    {
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
        calendarTodayLabel: 'Today'
      },
      validation: (Rule: any) => Rule.required(),
      initialValue: () => {
        const now = new Date().toISOString();
        console.log('Setting initial subscribedAt:', now);
        return now;
      }
    },
  ],
  preview: {
    select: {
      email: 'email',
      isActive: 'isActive',
      categories: 'subscribedCategories',
      subscribedAt: 'subscribedAt'
    },
    prepare(selection: any) {
      const { email, isActive, categories, subscribedAt } = selection;
      const date = subscribedAt 
        ? new Date(subscribedAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Unknown date';
      return {
        title: email,
        subtitle: `${isActive ? 'Active' : 'Inactive'} • ${date} • Categories: ${categories?.join(', ')}`,
        media: () => '📧'
      };
    },
  },
  orderings: [
    {
      title: 'Subscription Date',
      name: 'subscribedAtDesc',
      by: [
        {field: 'subscribedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Email',
      name: 'emailAsc',
      by: [
        {field: 'email', direction: 'asc'}
      ]
    }
  ]
};

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
      options: {
        list: [
          {title: 'Dev', value: 'Dev'},
          {title: 'No-code', value: 'No-code'},
          {title: 'Wellness', value: 'Wellness'}
        ]
      },
      validation: (Rule: any) => Rule.required(),
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
      initialValue: () => new Date().toISOString()
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
  ],
  preview: {
    select: {
      email: 'email',
      isActive: 'isActive',
      subscribedCategories: 'subscribedCategories',  
      subscribedAt: 'subscribedAt'
    },
    prepare(selection: any) {
      const { email, isActive, subscribedCategories, subscribedAt } = selection;
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
        subtitle: `${isActive ? 'Active' : 'Inactive'} • ${date} • Categories: ${subscribedCategories?.join(', ')}`,
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

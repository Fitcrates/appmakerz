const localizedString = (name: string, title: string, description?: string, required = false) => ({
  name,
  title,
  type: 'object',
  description,
  fields: [
    { name: 'en', title: 'English', type: 'string', validation: required ? (Rule: any) => Rule.required() : undefined },
    { name: 'pl', title: 'Polish', type: 'string', validation: required ? (Rule: any) => Rule.required() : undefined },
  ],
});

const localizedText = (name: string, title: string, description?: string) => ({
  name,
  title,
  type: 'object',
  description,
  fields: [
    { name: 'en', title: 'English', type: 'text', rows: 3 },
    { name: 'pl', title: 'Polish', type: 'text', rows: 3 },
  ],
});

// Graphics usually carry their own lettering, so each language gets its own
// file, and the alt text has to say what the lettering says.
const localizedImage = {
  name: 'image',
  title: 'Graphic',
  type: 'object',
  description: 'One file per language. A graphic with text on it needs alt text that repeats that text.',
  fields: (['en', 'pl'] as const).map((language) => ({
    name: language,
    title: language === 'en' ? 'English' : 'Polish',
    type: 'image',
    fields: [
      {
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: (Rule: any) => Rule.required().warning('Add alt text: it is the only part of the graphic search engines can read.'),
      },
    ],
  })),
};

const PATH_OR_URL = /^(\/[^\s]*|https?:\/\/\S+)$/;

export default {
  name: 'promoPopout',
  title: 'Promo popout',
  type: 'document',
  description:
    'The panel that slides in from the right edge of every page. Only the most recently edited enabled entry is shown; switch older ones off rather than deleting them.',
  fields: [
    {
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description: 'For the Studio list only, never shown on the site.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: false,
    },
    localizedImage,
    localizedString('eyebrow', 'Eyebrow', 'Small label above the title, e.g. "Migration".'),
    localizedString(
      'title',
      'Title',
      'Rendered as real text in the page, so it is what search engines and screen readers get. Keep it close to what the graphic says.',
      true
    ),
    localizedText('body', 'Text', 'Optional. One or two sentences under the title.'),
    localizedString('ctaLabel', 'Button label', 'Leave empty to make only the graphic clickable.'),
    {
      name: 'href',
      title: 'Link',
      type: 'string',
      description:
        'A path without the language prefix, e.g. /uslugi/medusa-js-development#hub-content (the visitor\'s language is added automatically), or a full external URL.',
      validation: (Rule: any) =>
        Rule.required().custom((value: string) =>
          !value || PATH_OR_URL.test(value) ? true : 'Must start with "/" or be a full https:// URL.'
        ),
    },
    localizedString('tabLabel', 'Side tab label', 'The vertical tab left at the edge after the panel is closed. Short, e.g. "PHP → Next.js".', true),
    {
      name: 'hideOn',
      title: 'Hide on pages',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Paths without the language prefix where the panel should not appear at all, typically the page it links to, e.g. /uslugi/medusa-js-development.',
    },
    {
      name: 'delaySeconds',
      title: 'Slide in after (seconds)',
      type: 'number',
      initialValue: 10,
      validation: (Rule: any) => Rule.min(0).max(120),
    },
    {
      name: 'snoozeDays',
      title: 'After closing, stay collapsed for (days)',
      type: 'number',
      description: 'The side tab stays visible meanwhile; this only stops the panel sliding in by itself.',
      initialValue: 14,
      validation: (Rule: any) => Rule.min(0).max(365),
    },
  ],
  preview: {
    select: { title: 'internalName', enabled: 'enabled', media: 'image.pl' },
    prepare({ title, enabled, media }: any) {
      return { title: title || '(no name)', subtitle: enabled ? 'Enabled' : 'Off', media };
    },
  },
};

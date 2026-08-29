/**
 * The section palette for project pages.
 *
 * Every section is optional and repeatable. A small website case study can be
 * hero + one rich text + a CTA and still look like a case study, because the
 * page frame (hero, fact bar, in-page nav, next project) carries the weight.
 */

import {
  headingFields,
  imageField,
  layoutFields,
  layoutFieldset,
  localizedRichText,
  localizedString,
  localizedText,
  sectionPreview,
} from './shared';

type RuleLike = any;

const projectRichText = {
  name: 'projectRichText',
  title: 'Rich Text',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    localizedRichText('body', 'Content'),
    {
      name: 'lead',
      title: 'Lead paragraph',
      type: 'boolean',
      description: 'Render the first paragraph larger, as an intro to the section.',
      initialValue: false,
    },
    ...layoutFields(),
  ],
  preview: sectionPreview('Rich Text'),
};

const projectSplitFeature = {
  name: 'projectSplitFeature',
  title: 'Text + Media (split)',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    localizedRichText('body', 'Content'),
    imageField('media', 'Media'),
    {
      name: 'mediaPosition',
      title: 'Media position',
      type: 'string',
      options: {
        list: [
          { title: 'Right of the text', value: 'right' },
          { title: 'Left of the text', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    },
    {
      name: 'sticky',
      title: 'Keep media in view while scrolling',
      type: 'boolean',
      initialValue: true,
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: sectionPreview('Text + Media'),
};

const projectBulletGrid = {
  name: 'projectBulletGrid',
  title: 'Card Grid',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    localizedText('intro', 'Intro', { rows: 2 }),
    {
      name: 'items',
      title: 'Cards',
      type: 'array',
      validation: (Rule: RuleLike) => Rule.min(1).max(8),
      of: [
        {
          type: 'object',
          fields: [
            localizedString('title', 'Title', { max: 70 }),
            localizedText('description', 'Description', { rows: 3 }),
          ],
          preview: {
            select: { title: 'title.pl', titleEn: 'title.en', subtitle: 'description.pl' },
            prepare: (selection: any) => ({
              title: selection.title || selection.titleEn || 'Card',
              subtitle: selection.subtitle,
            }),
          },
        },
      ],
    },
    {
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4], layout: 'radio', direction: 'horizontal' },
      initialValue: 2,
    },
    {
      name: 'marker',
      title: 'Card marker',
      type: 'string',
      options: {
        list: [
          { title: 'Number (01, 02, 03)', value: 'number' },
          { title: 'Check', value: 'check' },
          { title: 'None', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'number',
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: sectionPreview('Card Grid'),
};

const projectMediaBlock = {
  name: 'projectMediaBlock',
  title: 'Media',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      validation: (Rule: RuleLike) => Rule.min(1).max(6),
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule: RuleLike) => Rule.required().warning('Add alt text for accessibility and image search.'),
            },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional. An MP4/WebM file URL is embedded inline; anything else renders as a link.',
    },
    localizedText('caption', 'Caption', { rows: 2 }),
    {
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [1, 2, 3], layout: 'radio', direction: 'horizontal' },
      initialValue: 1,
    },
    {
      name: 'frame',
      title: 'Frame',
      type: 'string',
      options: {
        list: [
          { title: 'Plain', value: 'plain' },
          { title: 'Browser window', value: 'browser' },
        ],
        layout: 'radio',
      },
      initialValue: 'plain',
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: {
    select: { heading: 'heading.pl', headingEn: 'heading.en', media: 'images.0' },
    prepare: (selection: any) => ({
      title: selection.heading || selection.headingEn || 'Media',
      subtitle: 'Media',
      media: selection.media,
    }),
  },
};

const projectMetricStrip = {
  name: 'projectMetricStrip',
  title: 'Metrics',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    {
      name: 'items',
      title: 'Metrics',
      type: 'array',
      validation: (Rule: RuleLike) => Rule.min(1).max(4),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string', validation: (Rule: RuleLike) => Rule.required() },
            localizedString('label', 'Label', { max: 60 }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label.pl' },
          },
        },
      ],
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: sectionPreview('Metrics'),
};

const projectTimeline = {
  name: 'projectTimeline',
  title: 'Timeline / Process',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    {
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (Rule: RuleLike) => Rule.min(2).max(8),
      of: [
        {
          type: 'object',
          fields: [
            localizedString('title', 'Title', { max: 70 }),
            localizedText('description', 'Description', { rows: 3 }),
            localizedString('meta', 'Meta', { max: 30, description: 'Optional - duration, week number, status' }),
          ],
          preview: {
            select: { title: 'title.pl', titleEn: 'title.en', subtitle: 'description.pl' },
            prepare: (selection: any) => ({
              title: selection.title || selection.titleEn || 'Step',
              subtitle: selection.subtitle,
            }),
          },
        },
      ],
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: sectionPreview('Timeline'),
};

const projectTechStack = {
  name: 'projectTechStack',
  title: 'Tech Stack',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    localizedText('intro', 'Intro', { rows: 2 }),
    {
      name: 'groups',
      title: 'Groups',
      type: 'array',
      description: 'Group the stack (Frontend, Backend, Infrastructure...) instead of dumping 20 tags in one row.',
      validation: (Rule: RuleLike) => Rule.min(1).max(6),
      of: [
        {
          type: 'object',
          fields: [
            localizedString('label', 'Group label', { max: 40 }),
            {
              name: 'items',
              title: 'Technologies',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' },
            },
          ],
          preview: {
            select: { title: 'label.pl', titleEn: 'label.en', items: 'items' },
            prepare: (selection: any) => ({
              title: selection.title || selection.titleEn || 'Group',
              subtitle: (selection.items || []).join(', '),
            }),
          },
        },
      ],
    },
    ...layoutFields({ width: 'wide' }),
  ],
  preview: sectionPreview('Tech Stack'),
};

const projectQuote = {
  name: 'projectQuote',
  title: 'Quote',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    localizedText('quote', 'Quote', { rows: 4 }),
    { name: 'author', title: 'Author', type: 'string' },
    localizedString('role', 'Role / Company', { max: 80 }),
    imageField('avatar', 'Avatar'),
    ...layoutFields({ width: 'wide', tone: 'accent' }),
  ],
  preview: {
    select: { quote: 'quote.pl', quoteEn: 'quote.en', author: 'author', media: 'avatar' },
    prepare: (selection: any) => ({
      title: selection.quote || selection.quoteEn || 'Quote',
      subtitle: selection.author ? `Quote - ${selection.author}` : 'Quote',
      media: selection.media,
    }),
  },
};

const projectFaq = {
  name: 'projectFaq',
  title: 'FAQ',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    ...headingFields(),
    {
      name: 'items',
      title: 'Questions',
      type: 'array',
      validation: (Rule: RuleLike) => Rule.min(1).max(10),
      of: [
        {
          type: 'object',
          fields: [
            localizedString('question', 'Question', { max: 140 }),
            localizedText('answer', 'Answer', { rows: 4 }),
          ],
          preview: {
            select: { title: 'question.pl', titleEn: 'question.en' },
            prepare: (selection: any) => ({ title: selection.title || selection.titleEn || 'Question' }),
          },
        },
      ],
    },
    ...layoutFields({ width: 'narrow' }),
  ],
  preview: sectionPreview('FAQ'),
};

const projectCtaBand = {
  name: 'projectCtaBand',
  title: 'CTA Band',
  type: 'object',
  fieldsets: [layoutFieldset],
  fields: [
    localizedString('heading', 'Heading', { max: 90 }),
    localizedText('text', 'Text', { rows: 2 }),
    localizedString('buttonLabel', 'Button label', { max: 40 }),
    {
      name: 'href',
      title: 'Button link',
      type: 'string',
      description: 'Leave empty to link to the contact section. Use a full URL for external targets.',
    },
    ...layoutFields({ width: 'wide', tone: 'accent' }),
  ],
  preview: {
    select: { heading: 'heading.pl', headingEn: 'heading.en' },
    prepare: (selection: any) => ({
      title: selection.heading || selection.headingEn || 'CTA',
      subtitle: 'CTA Band',
    }),
  },
};

export const projectSectionTypes = [
  projectRichText,
  projectSplitFeature,
  projectBulletGrid,
  projectMediaBlock,
  projectMetricStrip,
  projectTimeline,
  projectTechStack,
  projectQuote,
  projectFaq,
  projectCtaBand,
];

export const projectSectionTypeNames = projectSectionTypes.map((section) => section.name);

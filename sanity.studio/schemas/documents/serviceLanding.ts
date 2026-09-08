import guideManifest from '../../../src/content/marketplace-guide/manifest.json';
import { AIGeneratorInput } from '../../components/AIGeneratorInput';
import { AIWholePostGenerator } from '../../components/AIWholePostGenerator';

export default {
  name: 'serviceLanding',
  title: 'Service Landing',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'links', title: 'Internal Links' },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    {
      name: 'aiGenerate',
      title: 'AI Generator',
      type: 'text',
      group: 'content',
      components: { input: AIWholePostGenerator },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Title',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a high-converting service landing page title in {{language}} for "{{title}}". Keep it clear and specific. Max 60 characters.' },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'pl',
          title: 'Polish Title',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a high-converting service landing page title in {{language}} for "{{title}}". Keep it clear and specific. Max 60 characters.' },
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'layoutVariant',
      title: 'Page layout',
      type: 'string',
      group: 'content',
      description:
        'Service = the standard sales landing. Hub = the MedusaJS overview page: a different section order that routes to the narrower services instead of selling one of them.',
      options: {
        list: [
          { title: 'Service landing (default)', value: 'service' },
          { title: 'Technology hub', value: 'hub' },
        ],
        layout: 'radio',
      },
      initialValue: 'service',
    },
    {
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Website Development', value: 'website-development' },
          { title: 'Shopify Development', value: 'shopify-development' },
          { title: 'E-commerce Development', value: 'ecommerce-development' },
          { title: 'Automation & Backend', value: 'automation-backend' },
          { title: 'WCAG Accessibility', value: 'wcag-accessibility' },
          { title: 'SEO & Optimization', value: 'seo-optimization' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'city',
      title: 'City (optional)',
      type: 'string',
      group: 'content',
      description: 'Leave empty for non-local landing pages. Fill when page targets a specific city.',
    },
    {
      name: 'isLocalLanding',
      title: 'Local landing page',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
    {
      name: 'eyebrow',
      title: 'Section Label (Eyebrow)',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short service section label in {{language}} for "{{title}}". Max 30 characters.' },
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short service section label in {{language}} for "{{title}}". Max 30 characters.' },
        },
      ],
    },
    {
      name: 'intro',
      title: 'Intro / Subtitle',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a concise, persuasive intro for a service landing page titled "{{title}}" in {{language}}. 2-3 sentences.' },
          rows: 3,
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'text',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a concise, persuasive intro for a service landing page titled "{{title}}" in {{language}}. 2-3 sentences.' },
          rows: 3,
        },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule: any) => Rule.required().warning('Add alt text for accessibility and image search.') }],
    },
    {
      name: 'problems',
      title: 'Problems You Solve',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'List 3-6 specific customer problems this service solves in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'List 3-6 specific customer problems this service solves in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
      ],
    },
    {
      name: 'deliverables',
      title: 'What Client Gets',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'List 4-8 concrete deliverables the client receives from this service in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(8),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'List 4-8 concrete deliverables the client receives from this service in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(8),
        },
      ],
    },
    {
      name: 'processSteps',
      title: 'Process Steps',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write 4-6 clear process steps for delivering this service in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write 4-6 clear process steps for delivering this service in {{language}}.', aiOutput: 'array' },
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.min(1).max(6),
        },
      ],
    },
    {
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English FAQ',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate 3-6 concise FAQ entries in {{language}} for service "{{title}}".', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
        },
        {
          name: 'pl',
          title: 'Polish FAQ',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate 3-6 concise FAQ entries in {{language}} for service "{{title}}".', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      title: 'Additional Rich Content',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'blogTable' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule: any) => Rule.required().warning('Add alt text for accessibility and image search.') }],
            },
          ],
        },
        {
          name: 'pl',
          title: 'Polish Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'blogTable' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule: any) => Rule.required().warning('Add alt text for accessibility and image search.') }],
            },
          ],
        },
      ],
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short CTA button label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short CTA button label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
      ],
    },
    {
      name: 'ctaSecondaryLabel',
      title: 'Secondary CTA Label',
      type: 'object',
      group: 'content',
      description: 'Label for the secondary (outline) CTA button. Falls back to "View projects".',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short secondary CTA label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'string',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Write a short secondary CTA label in {{language}} for service page "{{title}}". Max 35 characters.' },
        },
      ],
    },
    {
      name: 'stats',
      title: 'Key Stats',
      type: 'object',
      group: 'content',
      description: 'Optional highlight numbers shown below the hero (e.g. "50+" → "projects completed"). Max 4.',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate up to 4 key stats in {{language}} for service "{{title}}". Each item needs a value and a short label.', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Number / Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
          validation: (Rule: any) => Rule.max(4),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate up to 4 key stats in {{language}} for service "{{title}}". Each item needs a value and a short label.', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Number / Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
            },
          ],
          validation: (Rule: any) => Rule.max(4),
        },
      ],
    },
    {
      name: 'models',
      title: 'Delivery Models (optional fork)',
      type: 'object',
      group: 'content',
      description: 'Optional. Use when one service splits into 2-3 delivery models (e.g. standalone marketplace vs. marketplace as an extra channel). Rendered as compact side-by-side cards. Leave empty to hide the section.',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate 2 delivery models in {{language}} for service "{{title}}". Each needs a short label, a title, a one-line "for who", and 3 short bullet points.', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Small label', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'title', title: 'Model name', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'audience', title: 'For who (one line)', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'points', title: 'Bullet points', type: 'array', of: [{ type: 'string' }], validation: (Rule: any) => Rule.max(4) },
                { name: 'linkLabel', title: 'Link label', type: 'string' },
                { name: 'linkHref', title: 'Link target', type: 'string', description: 'Path without the language prefix. Turns the model into a routing card on the hub.' },
              ],
              preview: { select: { title: 'title', subtitle: 'audience' } },
            },
          ],
          validation: (Rule: any) => Rule.max(3),
        },
        {
          name: 'pl',
          title: 'Polish',
          type: 'array',
          components: { input: AIGeneratorInput },
          options: { aiPrompt: 'Generate 2 delivery models in {{language}} for service "{{title}}". Each needs a short label, a title, a one-line "for who", and 3 short bullet points.', aiOutput: 'array' },
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Small label', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'title', title: 'Model name', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'audience', title: 'For who (one line)', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'points', title: 'Bullet points', type: 'array', of: [{ type: 'string' }], validation: (Rule: any) => Rule.max(4) },
                { name: 'linkLabel', title: 'Link label', type: 'string' },
                { name: 'linkHref', title: 'Link target', type: 'string', description: 'Path without the language prefix. Turns the model into a routing card on the hub.' },
              ],
              preview: { select: { title: 'title', subtitle: 'audience' } },
            },
          ],
          validation: (Rule: any) => Rule.max(3),
        },
      ],
    },
    {
      name: 'capabilities',
      title: 'Capabilities (hub)',
      type: 'object',
      group: 'content',
      description: 'Grouped scope list. Hub layout only. A group without a link is still worth listing.',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'group', title: 'Group', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }], validation: (Rule: any) => Rule.min(1) },
            { name: 'linkLabel', title: 'Link label', type: 'string' },
            { name: 'linkHref', title: 'Link target', type: 'string', description: 'Path without the language prefix, e.g. /uslugi/marketplace-multi-vendor-medusa-js' },
          ],
          preview: { select: { title: 'group', subtitle: 'linkHref' } },
        }] },
        { name: 'pl', title: 'Polish', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'group', title: 'Group', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'items', title: 'Items', type: 'array', of: [{ type: 'string' }], validation: (Rule: any) => Rule.min(1) },
            { name: 'linkLabel', title: 'Link label', type: 'string' },
            { name: 'linkHref', title: 'Link target', type: 'string', description: 'Path without the language prefix, e.g. /uslugi/marketplace-multi-vendor-medusa-js' },
          ],
          preview: { select: { title: 'group', subtitle: 'linkHref' } },
        }] },
      ],
    },
    {
      name: 'fitYes',
      title: 'Good fit when (hub)',
      type: 'object',
      group: 'content',
      description: 'Hub layout only. Rendered beside fitNo.',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
        { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'fitNo',
      title: 'Poor fit when (hub)',
      type: 'object',
      group: 'content',
      description: 'Hub layout only. Saying who this is not for filters out bad leads before they write.',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
        { name: 'pl', title: 'Polish', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'integrations',
      title: 'Integrations (hub)',
      type: 'object',
      group: 'content',
      description: 'Hub layout only. Rows grouped by the group field.',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'group', title: 'Group', type: 'string', description: 'Rows sharing a group are rendered together under one heading.' },
            { name: 'name', title: 'The need', type: 'string', description: 'Phrase it from the buyer side, e.g. "Sprzedajesz juz gdzie indziej". Not a vendor name.', validation: (Rule: any) => Rule.required() },
            { name: 'detail', title: 'What answers it', type: 'string', description: 'What they get, and which tools it runs on.' },
            { name: 'meta', title: 'Small note underneath', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'detail' } },
        }] },
        { name: 'pl', title: 'Polish', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'group', title: 'Group', type: 'string', description: 'Rows sharing a group are rendered together under one heading.' },
            { name: 'name', title: 'The need', type: 'string', description: 'Phrase it from the buyer side, e.g. "Sprzedajesz juz gdzie indziej". Not a vendor name.', validation: (Rule: any) => Rule.required() },
            { name: 'detail', title: 'What answers it', type: 'string', description: 'What they get, and which tools it runs on.' },
            { name: 'meta', title: 'Small note underneath', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'detail' } },
        }] },
      ],
    },
    {
      name: 'technologies',
      title: 'Technology chips (hub)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Hub layout only. Names only — avoid pinning versions, which dates the page and reads as a limit on what you will use.',
    },
    {
      name: 'hubMedia',
      title: 'Images between sections (hub)',
      type: 'array',
      group: 'content',
      description:
        'Hub layout only. Drop a mockup, screenshot or diagram into any slot. Slots left empty simply render nothing, so the page never has a hole where a picture was meant to go.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'placement',
              title: 'Where it goes',
              type: 'string',
              options: {
                list: [
                  { title: 'After the store / marketplace fork', value: 'after-fork' },
                  { title: 'After the scope list', value: 'after-capabilities' },
                  { title: 'After "who is this for"', value: 'after-fit' },
                  { title: 'After the connections list', value: 'after-integrations' },
                  { title: 'After the evidence articles', value: 'after-evidence' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  validation: (Rule: any) => Rule.required().warning('Add alt text for accessibility and image search.'),
                },
              ],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'object',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'pl', title: 'Polish', type: 'string' },
              ],
            },
            {
              name: 'wide',
              title: 'Full width',
              type: 'boolean',
              description: 'Off keeps the image inside the text column. On lets a wide screenshot use the whole band.',
              initialValue: false,
            },
          ],
          preview: { select: { title: 'placement', media: 'image' } },
        },
      ],
    },
    {
      name: 'guideCta',
      title: 'Marketplace guide CTA',
      type: 'object',
      group: 'links',
      description:
        'Shows the “Practical marketplace operations guide” block on this landing. This used to be hardcoded to one slug in the page template, so no other landing could ever surface the guide.',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'enabled',
          title: 'Show the guide CTA',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'chapters',
          title: 'Deep-link these chapters',
          type: 'array',
          of: [{ type: 'string' }],
          // The 24 chapter pages are only reachable from the guide index, so
          // pointing a landing at the two or three that match its intent is
          // worth more than another link to the guide root.
          options: {
            list: guideManifest.chapters.map((chapter: { slug: string }) => ({
              title: chapter.slug,
              value: chapter.slug,
            })),
          },
          validation: (Rule: any) => Rule.max(4).warning('More than four turns the block into a link dump.'),
          description: 'Optional. Leave empty to link to the guide index only.',
        },
      ],
    },
    {
      name: 'relatedServices',
      title: 'Related / Other Services',
      type: 'array',
      group: 'links',
      description: 'Optional manual service links shown in the internal linking section. Leave empty to use automatic fallback.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'serviceLanding' }],
          options: {
            filter: ({ document }: any) => ({
              filter: '!(_id in [$id, $draftId])',
              params: {
                id: document?._id?.replace(/^drafts\./, ''),
                draftId: `drafts.${document?._id?.replace(/^drafts\./, '')}`,
              },
            }),
          },
        },
      ],
      validation: (Rule: any) => Rule.max(8),
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      group: 'links',
      description: 'Optional manual project links shown in the internal linking section. Leave empty to use automatic fallback.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (Rule: any) => Rule.max(3),
    },
    {
      name: 'relatedPosts',
      title: 'Related Blog Posts',
      type: 'array',
      group: 'links',
      description: 'Optional manual blog links shown in the internal linking section. Leave empty to use automatic fallback.',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (Rule: any) => Rule.max(3),
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta title in {{language}} for service page "{{title}}". Max 60 characters.' },
              validation: (Rule: any) => Rule.max(60),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'string',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta title in {{language}} for service page "{{title}}". Max 60 characters.' },
              validation: (Rule: any) => Rule.max(60),
            },
          ],
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta description in {{language}} for service page "{{title}}". Include a clear value proposition. Max 160 characters.' },
              rows: 3,
              validation: (Rule: any) => Rule.max(160),
            },
            {
              name: 'pl',
              title: 'Polish',
              type: 'text',
              components: { input: AIGeneratorInput },
              options: { aiPrompt: 'Write an SEO meta description in {{language}} for service page "{{title}}". Include a clear value proposition. Max 160 characters.' },
              rows: 3,
              validation: (Rule: any) => Rule.max(160),
            },
          ],
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          components: { input: AIGeneratorInput },
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
            aiPrompt: 'Generate 5-10 SEO keywords in {{language}} for service "{{title}}". Return short keyword phrases only.',
            aiOutput: 'array',
          },
        },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
        { name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] },
        { name: 'noIndex', title: 'Noindex', type: 'boolean', initialValue: false },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    },
    {
      name: 'updatedAt',
      title: 'Content updated at',
      type: 'datetime',
      group: 'meta',
      description: 'Optional. Set this only when you make a MEANINGFUL content update worth signalling to search engines. Leave empty and the automatic last-edit timestamp is used instead — but that one also bumps on typo fixes, so a manual date here gives you a truthful dateModified.',
    },
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titlePl: 'title.pl',
      slug: 'slug.current',
      city: 'city',
    },
    prepare(selection: any) {
      const { titleEn, titlePl, slug, city } = selection;
      return {
        title: titleEn || titlePl || 'Untitled Service Landing',
        subtitle: `${slug ? `/${slug}` : 'No slug'}${city ? ` • ${city}` : ''}`,
      };
    },
  },
};

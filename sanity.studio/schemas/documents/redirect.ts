const PATH_PATTERN = /^\/[^\s]*$/;

export default {
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  description:
    'Historical URLs only. This is not a list of the site’s pages — add an entry when a URL actually changes, so the old address keeps resolving instead of 404ing.',
  fields: [
    {
      name: 'source',
      title: 'Old path',
      type: 'string',
      description: 'The URL that no longer exists, e.g. /pl/uslugi/stary-slug. Path only, no domain.',
      validation: (Rule: any) =>
        Rule.required()
          .custom((value: string) =>
            !value || PATH_PATTERN.test(value)
              ? true
              : 'Must be a path starting with "/" and contain no spaces.'
          )
          // Two entries sending the same old URL to different places is
          // ambiguous, and whichever the build emits first silently wins.
          .custom(async (value: string, context: any) => {
            if (!value) return true;
            const id = context.document?._id?.replace(/^drafts\./, '');
            const duplicate = await context.getClient({ apiVersion: '2024-02-20' }).fetch(
              '*[_type == "redirect" && source == $source && !(_id in [$id, "drafts." + $id])][0]._id',
              { source: value, id }
            );
            return duplicate ? 'Another redirect already claims this old path.' : true;
          }),
    },
    {
      name: 'destination',
      title: 'New path',
      type: 'string',
      description: 'Where it should land now, e.g. /pl/uslugi/nowy-slug.',
      validation: (Rule: any) =>
        Rule.required()
          .custom((value: string, context: any) => {
            if (!value) return true;
            if (!PATH_PATTERN.test(value) && !/^https?:\/\//i.test(value)) {
              return 'Must be a path starting with "/", or a full external URL.';
            }
            if (value === context.document?.source) {
              return 'Destination is the same as the old path.';
            }
            return true;
          })
          // A -> B -> C makes Google follow two hops and loses signal at each.
          // When B later moves to C, the A entry must be repointed at C too.
          .custom(async (value: string, context: any) => {
            if (!value || !PATH_PATTERN.test(value)) return true;
            const next = await context.getClient({ apiVersion: '2024-02-20' }).fetch(
              '*[_type == "redirect" && source == $destination][0].destination',
              { destination: value }
            );
            return next
              ? `This creates a redirect chain: the new path is itself redirected to ${next}. Point this entry straight at the final URL.`
              : true;
          }),
    },
    {
      name: 'permanent',
      title: 'Permanent (301/308)',
      type: 'boolean',
      description: 'Leave on unless the move is genuinely temporary. Permanent redirects pass ranking signals.',
      initialValue: true,
    },
    {
      name: 'note',
      title: 'Why',
      type: 'string',
      description:
        'What changed and when. Needed later to decide whether an old entry can be repointed rather than chained.',
    },
  ],
  preview: {
    select: { title: 'source', subtitle: 'destination', permanent: 'permanent' },
    prepare({ title, subtitle, permanent }: any) {
      return {
        title: title || '(no old path)',
        subtitle: `→ ${subtitle || '?'}${permanent === false ? '  (temporary)' : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Old path',
      name: 'sourceAsc',
      by: [{ field: 'source', direction: 'asc' }],
    },
  ],
};

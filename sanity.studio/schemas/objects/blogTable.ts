import { BlogTableInput } from '../../components/BlogTableInput';

export default {
  type: 'object',
  name: 'blogTable',
  title: 'Tabela',
  components: { input: BlogTableInput },
  fields: [
    {
      name: 'caption',
      title: 'Podpis tabeli',
      type: 'string',
      description: 'Opcjonalny podpis wyswietlany nad tabela.',
    },
    {
      name: 'headerRow',
      title: 'Pierwszy wiersz jako naglowek',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'rows',
      title: 'Wiersze',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Wiersz',
          fields: [
            {
              name: 'cells',
              title: 'Komorki',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule: any) => Rule.min(1).error('Dodaj co najmniej jedna komorke'),
            },
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare(selection: any) {
              const cells = Array.isArray(selection.cells) ? selection.cells : []
              return {
                title: cells.filter(Boolean).join(' | ') || 'Pusty wiersz',
                subtitle: `${cells.length} komor${cells.length === 1 ? 'ka' : 'ki'}`,
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1).error('Dodaj co najmniej jeden wiersz'),
    },
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows',
    },
    prepare(selection: any) {
      const rowCount = Array.isArray(selection.rows) ? selection.rows.length : 0
      return {
        title: selection.caption || 'Tabela',
        subtitle: `${rowCount} wiers${rowCount === 1 ? 'z' : 'zy'}`,
      }
    },
  },
};

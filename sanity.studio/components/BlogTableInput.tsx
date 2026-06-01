import { useMemo, useState } from 'react'
import { Button, Card, Checkbox, Flex, Inline, Stack, Text, TextArea, TextInput } from '@sanity/ui'
import { type ObjectInputProps, set } from 'sanity'

type TableRow = {
  _key?: string
  _type?: 'tableRow'
  cells?: string[]
}

type BlogTableValue = {
  _key?: string
  _type?: 'blogTable'
  caption?: string
  headerRow?: boolean
  rows?: TableRow[]
}

const createKey = () => Math.random().toString(36).slice(2, 12)

const normalizeRows = (rows: TableRow[] | undefined): TableRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [
      { _key: createKey(), _type: 'tableRow', cells: ['', '', ''] },
      { _key: createKey(), _type: 'tableRow', cells: ['', '', ''] },
      { _key: createKey(), _type: 'tableRow', cells: ['', '', ''] },
    ]
  }

  return rows.map((row) => ({
    _key: row._key || createKey(),
    _type: 'tableRow',
    cells: Array.isArray(row.cells) ? row.cells.map((cell) => String(cell || '')) : [''],
  }))
}

const decodeHtml = (value: string) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")

const stripHtml = (value: string) =>
  decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
  )

const parseHtmlTable = (source: string) => {
  const rowMatches = source.match(/<tr[\s\S]*?<\/tr>/gi)
  if (!rowMatches) {
    return null
  }

  const rows = rowMatches
    .map((row) => {
      const cellMatches = row.match(/<(td|th)[^>]*>[\s\S]*?<\/\1>/gi)
      return cellMatches?.map(stripHtml) || []
    })
    .filter((cells) => cells.some((cell) => cell.length > 0))

  return rows.length > 0 ? rows : null
}

const parsePastedRows = (source: string) => {
  const trimmed = source.trim()
  if (!trimmed) {
    return []
  }

  const htmlRows = parseHtmlTable(trimmed)
  if (htmlRows) {
    return htmlRows
  }

  return trimmed
    .split(/\r?\n/)
    .map((row) => row.split('\t').map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean))
}

export function BlogTableInput(props: ObjectInputProps) {
  const value = (props.value || {}) as BlogTableValue
  const [pasteValue, setPasteValue] = useState('')

  const rows = useMemo(() => normalizeRows(value.rows), [value.rows])
  const columnCount = Math.max(1, ...rows.map((row) => row.cells?.length || 0))

  const updateValue = (nextValue: Partial<BlogTableValue>) => {
    props.onChange(
      set({
        ...value,
        ...nextValue,
        _type: 'blogTable',
      })
    )
  }

  const updateRows = (nextRows: TableRow[]) => {
    updateValue({ rows: nextRows })
  }

  const updateCell = (rowIndex: number, cellIndex: number, nextCellValue: string) => {
    const nextRows = rows.map((row, currentRowIndex) => {
      const cells = [...(row.cells || [])]
      while (cells.length < columnCount) {
        cells.push('')
      }

      if (currentRowIndex === rowIndex) {
        cells[cellIndex] = nextCellValue
      }

      return { ...row, cells }
    })

    updateRows(nextRows)
  }

  const addRow = () => {
    updateRows([
      ...rows,
      {
        _key: createKey(),
        _type: 'tableRow',
        cells: Array.from({ length: columnCount }, () => ''),
      },
    ])
  }

  const removeRow = (rowIndex: number) => {
    updateRows(rows.filter((_, currentRowIndex) => currentRowIndex !== rowIndex))
  }

  const addColumn = () => {
    updateRows(rows.map((row) => ({ ...row, cells: [...(row.cells || []), ''] })))
  }

  const removeColumn = (cellIndex: number) => {
    updateRows(
      rows.map((row) => ({
        ...row,
        cells: (row.cells || []).filter((_, currentCellIndex) => currentCellIndex !== cellIndex),
      }))
    )
  }

  const applyPastedTable = () => {
    const parsedRows = parsePastedRows(pasteValue)
    if (parsedRows.length === 0) {
      return
    }

    const maxColumns = Math.max(...parsedRows.map((row) => row.length))
    updateRows(
      parsedRows.map((cells) => ({
        _key: createKey(),
        _type: 'tableRow',
        cells: Array.from({ length: maxColumns }, (_, index) => cells[index] || ''),
      }))
    )
    setPasteValue('')
  }

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Podpis tabeli
          </Text>
          <TextInput
            value={value.caption || ''}
            onChange={(event) => updateValue({ caption: event.currentTarget.value })}
            placeholder="Opcjonalny podpis nad tabelą"
          />
        </Stack>

        <Card padding={3} border radius={2}>
          <Flex align="center" gap={3}>
            <Checkbox
              checked={value.headerRow !== false}
              onChange={(event) => updateValue({ headerRow: event.currentTarget.checked })}
            />
            <Text size={1}>Pierwszy wiersz jako nagłówek</Text>
          </Flex>
        </Card>
      </Stack>

      <Card padding={3} border radius={2} tone="transparent">
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Text size={1} weight="semibold">
              Edytor tabeli
            </Text>
            <Inline space={2}>
              <Button mode="ghost" text="Dodaj wiersz" onClick={addRow} />
              <Button mode="ghost" text="Dodaj kolumnę" onClick={addColumn} />
            </Inline>
          </Flex>

          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <table style={{ borderCollapse: 'collapse', minWidth: Math.max(620, columnCount * 180) }}>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row._key || rowIndex}>
                    {Array.from({ length: columnCount }).map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          border: '1px solid var(--card-border-color)',
                          minWidth: 180,
                          padding: 6,
                          verticalAlign: 'top',
                        }}
                      >
                        <TextArea
                          rows={2}
                          value={row.cells?.[cellIndex] || ''}
                          onChange={(event) =>
                            updateCell(rowIndex, cellIndex, event.currentTarget.value)
                          }
                          placeholder={rowIndex === 0 ? `Nagłówek ${cellIndex + 1}` : `Komórka ${cellIndex + 1}`}
                        />
                      </td>
                    ))}
                    <td style={{ paddingLeft: 8, verticalAlign: 'top' }}>
                      <Button
                        mode="ghost"
                        tone="critical"
                        text="Usuń"
                        onClick={() => removeRow(rowIndex)}
                        disabled={rows.length <= 1}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  {Array.from({ length: columnCount }).map((_, cellIndex) => (
                    <td key={cellIndex} style={{ padding: 6, textAlign: 'center' }}>
                      <Button
                        mode="bleed"
                        tone="critical"
                        text="Usuń kolumnę"
                        onClick={() => removeColumn(cellIndex)}
                        disabled={columnCount <= 1}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Stack>
      </Card>

      <Card padding={3} border radius={2} tone="caution">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Wklej z arkusza albo HTML
          </Text>
          <Text size={1} muted>
            Możesz wkleić zakres komórek z Excela/Google Sheets albo prostą tabelę HTML. Zastąpi to obecną zawartość tabeli.
          </Text>
          <TextArea
            rows={5}
            value={pasteValue}
            onChange={(event) => setPasteValue(event.currentTarget.value)}
            placeholder={'Technika\tEfekt wizualny\tTrwałość\nOlej\tGłęboki\tBardzo wysoka'}
          />
          <Inline space={2}>
            <Button
              tone="primary"
              text="Wstaw wklejoną tabelę"
              onClick={applyPastedTable}
              disabled={!pasteValue.trim()}
            />
            <Button mode="ghost" text="Wyczyść pole" onClick={() => setPasteValue('')} />
          </Inline>
        </Stack>
      </Card>
    </Stack>
  )
}

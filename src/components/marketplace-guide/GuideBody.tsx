import GuideChecklistTable from '@/components/marketplace-guide/GuideChecklistTable';
import { guideHeadingId } from '@/lib/marketplace-guide-shared';
import type { GuideBlock, GuideSegment } from '@/lib/marketplace-guide';
import type { Language } from '@/lib/language';
import styles from './MarketplaceGuide.module.css';

function InlineText({ segments }: { segments: GuideSegment[] }) {
  return segments.map((segment, index) => segment.href ? (
    <a key={index} href={segment.href} target={segment.href.startsWith('http') ? '_blank' : undefined} rel={segment.href.startsWith('http') ? 'noreferrer' : undefined}>
      {segment.text}
    </a>
  ) : <span key={index}>{segment.text}</span>);
}

function StandardTable({ rows }: { rows: string[][] }) {
  if (!rows.length) return null;
  return (
    <div className={styles.tableScroll}>
      <table className={styles.contentTable}>
        <thead><tr>{rows[0].map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export default function GuideBody({ blocks, language, slug }: { blocks: GuideBlock[]; language: Language; slug: string }) {
  const rendered: React.ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type === 'list-item') {
      const items = [block];
      while (true) {
        const nextBlock = blocks[index + 1];
        if (nextBlock?.type !== 'list-item' || nextBlock.ordered !== block.ordered) break;
        items.push(nextBlock);
        index += 1;
      }
      const List = block.ordered ? 'ol' : 'ul';
      rendered.push(<List key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}><InlineText segments={item.segments} /></li>)}</List>);
      continue;
    }

    if (block.type === 'heading') {
      const id = guideHeadingId(block.text);
      rendered.push(block.level === 2
        ? <h2 key={index} id={id}>{block.text}<a href={`#${id}`} aria-label={language === 'pl' ? 'Link do sekcji' : 'Link to section'}>#</a></h2>
        : <h3 key={index} id={id}>{block.text}<a href={`#${id}`} aria-label={language === 'pl' ? 'Link do sekcji' : 'Link to section'}>#</a></h3>);
    } else if (block.type === 'paragraph') {
      rendered.push(<p key={index}><InlineText segments={block.segments} /></p>);
    } else if (block.type === 'callout') {
      rendered.push(
        <aside key={index} className={`${styles.callout} ${styles[`callout_${block.variant}`]}`}>
          {block.label ? <strong>{block.label}</strong> : null}
          <p>{block.text}</p>
        </aside>
      );
    } else if (block.type === 'table') {
      const isChecklist = slug === 'launch-checklist' && block.rows[0]?.length === 3;
      rendered.push(isChecklist
        ? <GuideChecklistTable key={index} language={language} rows={block.rows} />
        : <StandardTable key={index} rows={block.rows} />);
    }
  }

  return <div className={styles.body}>{rendered}</div>;
}

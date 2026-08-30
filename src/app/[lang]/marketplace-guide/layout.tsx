import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import styles from '@/components/marketplace-guide/MarketplaceGuide.module.css';

export default function MarketplaceGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.guidePage}>
      <NextHeader />
      <main className={styles.guideMain}>{children}</main>
      <NextFooter />
    </div>
  );
}

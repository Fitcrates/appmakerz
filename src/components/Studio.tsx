import { Studio } from 'sanity'
import { config } from '../../sanity.studio/sanity.config'
import { useEffect } from 'react'

const studioStyles = {
  height: '100vh',
  width: '100vw',
  '--studio-container-width': '100ch',
  '--studio-text-width': '100ch',
  '--studio-max-width': '100ch',
} as React.CSSProperties;

export default function StudioPage() {
  useEffect(() => {
    document.body.classList.add('sanity-studio');
    return () => {
      document.body.classList.remove('sanity-studio');
    }
  }, []);

  return (
    <div style={studioStyles}>
      <Studio config={config} />
    </div>
  )
}

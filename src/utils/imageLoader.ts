export const preloadHeroImage = () => {
  // First ensure the placeholder is loaded
  const placeholder = new Image();
  placeholder.src = '/media/placeholderHero.webp';
  
  placeholder.onload = () => {
    // After placeholder is loaded, start loading the main image
    const mainImage = new Image();
    mainImage.src = '/media/tinypng-cropedbackground-min.webp';
    
    mainImage.onload = () => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.classList.add('loaded');
      }
    };
  };
};

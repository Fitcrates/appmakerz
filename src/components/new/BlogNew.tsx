import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BlogPostNew from './BlogPostNew';
import type { Post } from '../../types/sanity.types';

interface BlogNewProps {
  posts: Post[];
}

const BlogNew: React.FC<BlogNewProps> = ({ posts }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="blog"
      ref={containerRef}
      className="relative py-32 lg:py-48 bg-indigo-950 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
            [ Blog ]
          </span>
        </motion.div>

        {/* Header */}
        <div className="mb-16">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-7xl font-light text-white font-jakarta"
            >
              From the <span className="text-teal-300">Blog</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 font-jakarta font-light mt-6 max-w-xl"
          >
            Discover our latest insights, updates, and stories
          </motion.p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <BlogPostNew key={post._id || index} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogNew;

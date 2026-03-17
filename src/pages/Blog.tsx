import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  video?: string;
  tags: string[];
  createdAt: string;
}

export const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blogs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-900"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif mb-6"
          >
            The Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-500 max-w-2xl mx-auto"
          >
            Stories about radical transparency, ethical manufacturing, and the people behind our products.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                {blog.video ? (
                  <div className="relative w-full h-full">
                    <video 
                      src={blog.video} 
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => e.currentTarget.pause()}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={blog.image || 'https://picsum.photos/seed/blog/800/500'} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-brand-400 uppercase tracking-widest font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                </div>
                <h2 className="text-2xl font-serif group-hover:text-brand-600 transition-colors leading-tight">
                  {blog.title}
                </h2>
                <p className="text-brand-500 line-clamp-3 text-sm leading-relaxed">
                  {blog.content}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold group-hover:gap-4 transition-all">
                    Read Story <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20 bg-brand-50 rounded-3xl">
            <p className="text-brand-500">No stories published yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

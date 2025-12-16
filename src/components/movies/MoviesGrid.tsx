"use client";

import { useState, useMemo, useTransition } from 'react';
import type { Movie } from '@/lib/types';
import MovieCard, { MovieCardSkeleton } from './MovieCard';
import { AnimatePresence, motion } from 'framer-motion';

interface MoviesGridProps {
  initialMovies: Movie[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
  }
};


export default function MoviesGrid({ initialMovies }: MoviesGridProps) {
  const [movies, setMovies] = useState(initialMovies);
  
  return (
    <div className="space-y-8">
        {/* Filter and sort controls can be added back here later */}
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <AnimatePresence>
            {movies.map(movie => (
                <motion.div key={movie.id} variants={itemVariants} layout>
                    <MovieCard movie={movie} />
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {movies.length === 0 && (
            <div className='text-center py-16'>
                <p className='text-2xl font-bold'>No movies found</p>
                <p className='text-muted-foreground mt-2'>Please try again later.</p>
            </div>
        )}
    </div>
  );
}

export const MoviesGridSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
};

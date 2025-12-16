"use client";

import { useState, useMemo } from 'react';
import type { Movie } from '@/lib/types';
import MovieCard from './MovieCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';

interface MoviesGridProps {
  movies: Movie[];
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


export default function MoviesGrid({ movies }: MoviesGridProps) {
  const [genre, setGenre] = useState('all');
  const [country, setCountry] = useState('all');
  const [sort, setSort] = useState('avgRating-desc');

  const genres = useMemo(() => ['all', ...Array.from(new Set(movies.flatMap(m => m.genres)))], [movies]);
  const countries = useMemo(() => ['all', ...Array.from(new Set(movies.map(m => m.country)))], [movies]);

  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    if (genre !== 'all') {
      result = result.filter(m => m.genres.includes(genre));
    }

    if (country !== 'all') {
      result = result.filter(m => m.country === country);
    }
    
    const [sortKey, sortDir] = sort.split('-');
    
    result.sort((a, b) => {
        let valA, valB;
        if(sortKey === 'title') {
            valA = a.title;
            valB = b.title;
        } else if (sortKey === 'releaseYear') {
            valA = a.releaseYear;
            valB = b.releaseYear;
        } else {
            valA = a.avgRating;
            valB = b.avgRating;
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });


    return result;
  }, [movies, genre, country, sort]);

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 rounded-lg bg-card/80 border">
            <div className='flex flex-wrap gap-4 w-full md:w-auto'>
                <FilterSelect
                    label="Genre"
                    value={genre}
                    onValueChange={setGenre}
                    items={genres}
                />
                <FilterSelect
                    label="Country"
                    value={country}
                    onValueChange={setCountry}
                    items={countries}
                />
            </div>
             <div className='w-full md:w-auto'>
                <SortSelect value={sort} onValueChange={setSort} />
            </div>
        </div>

        <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <AnimatePresence>
            {filteredAndSortedMovies.map(movie => (
                <motion.div key={movie.id} variants={itemVariants} layout>
                    <MovieCard movie={movie} />
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredAndSortedMovies.length === 0 && (
            <div className='text-center py-16'>
                <p className='text-2xl font-bold'>No movies found</p>
                <p className='text-muted-foreground mt-2'>Try adjusting your filters.</p>
            </div>
        )}
    </div>
  );
}


const FilterSelect = ({ label, value, onValueChange, items }: { label: string; value: string; onValueChange: (val: string) => void; items: string[] }) => (
    <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full md:w-[180px] bg-background">
            <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
            {items.map(item => (
                <SelectItem key={item} value={item} className="capitalize">{item === 'all' ? `All ${label}s` : item}</SelectItem>
            ))}
        </SelectContent>
    </Select>
)

const SortSelect = ({ value, onValueChange }: { value: string; onValueChange: (val: string) => void; }) => (
     <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full md:w-[200px] bg-background">
            <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="avgRating-desc">Rating: High to Low</SelectItem>
            <SelectItem value="avgRating-asc">Rating: Low to High</SelectItem>
            <SelectItem value="releaseYear-desc">Newest First</SelectItem>
            <SelectItem value="releaseYear-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title: A-Z</SelectItem>
            <SelectItem value="title-desc">Title: Z-A</SelectItem>
        </SelectContent>
    </Select>
)

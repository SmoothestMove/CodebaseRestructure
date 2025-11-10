import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBox, FaDollarSign, FaUser, FaTimes, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { shouldReduceMotion } from '@/lib/animations';
import Button from '@/components/common/Button';

/**
 * @interface SearchResult
 * @description Defines the properties for a search result.
 */
interface SearchResult {
  /** The unique identifier for the search result. */
  id: string;
  /** The type of the search result. */
  type: 'box' | 'expense' | 'owner' | 'category';
  /** The title of the search result. */
  title: string;
  /** An optional subtitle for the search result. */
  subtitle?: string;
  /** An optional description for the search result. */
  description?: string;
  /** The URL for the search result. */
  url: string;
  /** The icon for the search result. */
  icon: React.ReactNode;
  /** Optional metadata for the search result. */
  metadata?: Record<string, any>;
}

/**
 * @interface GlobalSearchProps
 * @description Defines the properties for the GlobalSearch component.
 */
interface GlobalSearchProps {
  /** Whether the search modal is open. */
  isOpen: boolean;
  /** A callback function to be called when the search modal is closed. */
  onClose: () => void;
  /** An optional placeholder text for the search input. */
  placeholder?: string;
  /** The maximum number of results to be displayed per category. */
  maxResultsPerCategory?: number;
}

/**
 * A component that provides cross-feature search functionality.
 * It searches across boxes, expenses, owners, and categories.
 * @param {GlobalSearchProps} props - The properties for the GlobalSearch component.
 * @returns {JSX.Element | null} The rendered GlobalSearch component or null if it's not open.
 */
const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  placeholder = "Search boxes, expenses, owners...",
  maxResultsPerCategory = 5,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from your data sources
  const mockBoxes = [
    { id: '1', name: 'Kitchen Essentials', owner: 'John', room: 'Kitchen', status: 'packed' },
    { id: '2', name: 'Living Room Books', owner: 'Jane', room: 'Living Room', status: 'delivered' },
    { id: '3', name: 'Bedroom Clothes', owner: 'John', room: 'Bedroom', status: 'unpacked' },
  ];

  const mockExpenses = [
    { id: '1', merchant: 'U-Haul', amount: 299.99, category: 'Moving Truck', date: '2024-01-15' },
    { id: '2', merchant: 'Home Depot', amount: 45.67, category: 'Packing Supplies', date: '2024-01-16' },
    { id: '3', merchant: 'Pizza Palace', amount: 28.50, category: 'Food', date: '2024-01-17' },
  ];

  const mockOwners = [
    { id: '1', name: 'John Doe', type: 'person', boxCount: 15 },
    { id: '2', name: 'Jane Smith', type: 'person', boxCount: 12 },
    { id: '3', name: 'Kitchen', type: 'space', boxCount: 8 },
  ];

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('globalSearchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query]);

  // Perform search with debouncing
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search boxes
    const boxMatches = mockBoxes.filter(box => 
      box.name.toLowerCase().includes(normalizedQuery) ||
      box.owner.toLowerCase().includes(normalizedQuery) ||
      box.room.toLowerCase().includes(normalizedQuery) ||
      box.status.toLowerCase().includes(normalizedQuery)
    ).slice(0, maxResultsPerCategory).map(box => ({
      id: box.id,
      type: 'box' as const,
      title: box.name,
      subtitle: `${box.owner} • ${box.room}`,
      description: `Status: ${box.status}`,
      url: `/app/boxes/${box.id}`,
      icon: <FaBox className="w-4 h-4 text-blue-500" />,
      metadata: box,
    }));

    // Search expenses
    const expenseMatches = mockExpenses.filter(expense =>
      expense.merchant.toLowerCase().includes(normalizedQuery) ||
      expense.category.toLowerCase().includes(normalizedQuery) ||
      expense.amount.toString().includes(normalizedQuery)
    ).slice(0, maxResultsPerCategory).map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      title: expense.merchant,
      subtitle: expense.category,
      description: `$${expense.amount} • ${expense.date}`,
      url: `/app/budget?expense=${expense.id}`,
      icon: <FaDollarSign className="w-4 h-4 text-green-500" />,
      metadata: expense,
    }));

    // Search owners
    const ownerMatches = mockOwners.filter(owner =>
      owner.name.toLowerCase().includes(normalizedQuery) ||
      owner.type.toLowerCase().includes(normalizedQuery)
    ).slice(0, maxResultsPerCategory).map(owner => ({
      id: owner.id,
      type: 'owner' as const,
      title: owner.name,
      subtitle: owner.type === 'person' ? 'Person' : 'Space',
      description: `${owner.boxCount} boxes`,
      url: `/app/owners/${owner.id}`,
      icon: <FaUser className="w-4 h-4 text-purple-500" />,
      metadata: owner,
    }));

    return [...boxMatches, ...expenseMatches, ...ownerMatches];
  }, [query, maxResultsPerCategory]);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timeout = setTimeout(() => {
        setResults(searchResults);
        setIsSearching(false);
        setSelectedIndex(-1);
      }, 200);

      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
    }
  }, [query, searchResults]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Add to search history
    const newHistory = [trimmed, ...searchHistory.filter(item => item !== trimmed)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('globalSearchHistory', JSON.stringify(newHistory));

    // Perform search
    setQuery(trimmed);
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(query);
    navigate(result.url);
    onClose();
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    handleSearch(historyItem);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('globalSearchHistory');
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });
    return groups;
  }, [results]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }
    },
  };

  const resultVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.2,
      }
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
        variants={shouldReduceMotion() ? undefined : overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Search Modal */}
        <motion.div
          className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
          variants={shouldReduceMotion() ? undefined : modalVariants}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <FaSearch className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2 min-w-[32px] min-h-[32px]"
            >
              <FaTimes className="w-4 h-4" />
            </Button>
          </div>

          {/* Results Container */}
          <div 
            ref={resultsRef}
            className="max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-brand-tertiary border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-slate-600 dark:text-slate-400">Searching...</span>
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaSearch className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400">No results found for "{query}"</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Try searching for boxes, expenses, or owners
                </p>
              </div>
            ) : query.trim() ? (
              <div className="py-2">
                {Object.entries(groupedResults).map(([type, typeResults]) => (
                  <div key={type} className="mb-4">
                    <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {type === 'box' ? 'Boxes' : type === 'expense' ? 'Expenses' : type === 'owner' ? 'Owners' : 'Categories'}
                    </h3>
                    {typeResults.map((result, index) => (
                      <motion.button
                        key={result.id}
                        variants={shouldReduceMotion() ? undefined : resultVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        onClick={() => handleResultClick(result)}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left ${
                          selectedIndex === results.indexOf(result) 
                            ? 'bg-brand-tertiary/10 dark:bg-orange-500/10' 
                            : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                              {result.subtitle}
                            </p>
                          )}
                          {result.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* Search History */
              searchHistory.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={item}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <FaHistory className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{item}</span>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {!query && searchHistory.length === 0 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Search across boxes, expenses, owners, and more
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
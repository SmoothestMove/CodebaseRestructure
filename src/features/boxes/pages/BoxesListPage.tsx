
import React, { useState, useMemo } from 'react';
import { useBoxes } from '@/features/boxes/hooks/useBoxes'; 
import BoxCard from '@/features/boxes/components/BoxCard'; 
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { ItemStatus } from '@/types';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { IconQrCode, IconListBullet } from '@/lib/config/constants'; 
import { FaPrint } from 'react-icons/fa'; 
import { getItemStatusOptionsForSelect } from '@/utils/statusUtils';


const BoxesListPage: React.FC = () => { 
  const { boxes, isLoading } = useBoxes(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'>('date_desc');

  const statusOptionsForFilter = [
    { value: 'all', label: 'All Moving Stages' },
    ...getItemStatusOptionsForSelect(),
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Last Updated (Newest First)' },
    { value: 'date_asc', label: 'Last Updated (Oldest First)' },
    { value: 'name_asc', label: 'Box Name (A-Z)' }, 
    { value: 'name_desc', label: 'Box Name (Z-A)' }, 
  ];

  const filteredAndSortedBoxes = useMemo(() => { 
    let processedBoxes = [...boxes]; 

    if (statusFilter !== 'all') {
      processedBoxes = processedBoxes.filter(box => box.currentStatus === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      processedBoxes = processedBoxes.filter(box =>
        box.name.toLowerCase().includes(lowerSearchTerm) ||
        box.contents?.toLowerCase().includes(lowerSearchTerm) || 
        box.currentLocation?.toLowerCase().includes(lowerSearchTerm) || 
        box.id.toLowerCase().includes(lowerSearchTerm) ||
        box.destinationRoom?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    switch (sortOrder) {
        case 'name_asc':
            processedBoxes.sort((a,b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            processedBoxes.sort((a,b) => b.name.localeCompare(a.name));
            break;
        case 'date_asc':
            processedBoxes.sort((a,b) => a.updatedAt - b.updatedAt);
            break;
        case 'date_desc':
        default:
            processedBoxes.sort((a,b) => b.updatedAt - a.updatedAt);
            break;
    }

    return processedBoxes;
  }, [boxes, searchTerm, statusFilter, sortOrder]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-brand-secondary dark:text-slate-400">
            <svg className="animate-spin h-10 w-10 text-brand-tertiary dark:text-orange-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl">Loading your packed boxes...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
            <IconListBullet className="w-8 h-8 text-brand-tertiary dark:text-orange-400" /> 
            <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100"> 
                All Tracked Boxes <span className="text-brand-secondary dark:text-slate-400 font-normal">({filteredAndSortedBoxes.length})</span> 
            </h1>
        </div>
        <Link to="/app/owners"> 
            <Button variant="primary" size="md" leftIcon={<FaPrint />}> 
                Print More Labels
            </Button>
        </Link>
      </header>

      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-2 items-end">
          <Input
            label="Search Your Boxes"
            placeholder="Box name, contents, location, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="md:col-span-1"
            id="search-boxes"
          />
          <Select
            label="Filter by Moving Stage"
            options={statusOptionsForFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ItemStatus | 'all')}
            containerClassName="md:col-span-1"
            id="filter-status"
          />
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc')}
            containerClassName="md:col-span-1"
            id="sort-order"
          />
        </div>
      </div>

      {filteredAndSortedBoxes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {filteredAndSortedBoxes.map(box => (
            <BoxCard key={box.id} box={box} /> 
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-xl animate-fade-in">
            <IconQrCode className="mx-auto h-20 w-20 text-brand-secondary/60 dark:text-slate-500/60 mb-6" /> 
            <h3 className="text-2xl font-semibold text-brand-primary dark:text-slate-100">No boxes match your current view.</h3> 
            {boxes.length === 0 && (
                <>
                    <p className="text-brand-secondary dark:text-slate-300 mt-2">It looks like you haven't added any owners or printed labels yet.</p> 
                     <Link to="/app/owners"> 
                        <Button variant="primary" size="lg" className="mt-8" leftIcon={<FaPrint />}> 
                            Add Owner & Print Labels
                        </Button>
                    </Link>
                </>
            )}
            {boxes.length > 0 && (searchTerm || statusFilter !== 'all') && (
                 <p className="text-brand-secondary dark:text-slate-300 mt-2">Try adjusting your search or filter for a different moving stage.</p> 
            )}
        </div>
      )}
    </div>
  );
};

export default BoxesListPage;

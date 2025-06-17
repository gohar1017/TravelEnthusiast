// components/TravelLogSearch.jsx
import React, { useState, useEffect, useCallback } from 'react';

const TravelLogSearch = ({ logs = [], onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Ensure logs is an array
  const logsArray = Array.isArray(logs) ? logs : [];

  // Extract unique tags and locations from logs with null checks
  const allTags = [...new Set(logsArray.flatMap(log => log?.tags || []) || [])];
  const allLocations = [...new Set(logsArray.map(log => log?.location).filter(Boolean) || [])];

  // Memoize the filter function
  const filterLogs = useCallback(() => {
    return logsArray.filter(log => {
      if (!log) return false;
      
      const matchesSearch = searchTerm === '' || 
        (log.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         log.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTag = selectedTag ? log.tags?.includes(selectedTag) : true;
      const matchesLocation = selectedLocation ? log.location === selectedLocation : true;
      return matchesSearch && matchesTag && matchesLocation;
    });
  }, [logsArray, searchTerm, selectedTag, selectedLocation]);

  // Update search results when filters change
  useEffect(() => {
    const filteredLogs = filterLogs();
    onSearch(filteredLogs);
  }, [filterLogs, onSearch]);

  return (
    <div className="travel-log-search">
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Filter by Tag:</label>
          <select 
            value={selectedTag} 
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by Location:</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {allLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TravelLogSearch;
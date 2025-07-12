import React, { useEffect, useCallback } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConnections, 
  fetchConnectionRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  setConnectionsSearchQuery,
  setConnectionsFilter,
  setConnectionsPage
} from '../../store/slices/profileSlice';
import Connections from './Connections';

const ConnectionsContainer = ({ isOwnProfile = false }) => {
  const dispatch = useDispatch();
  
  // Get connections data from Redux store
  const { 
    connections,
    connectionRequests,
    connectionSuggestions,
    loading,
    error
  } = useSelector((state) => ({
    connections: state.profile.connections,
    connectionRequests: state.profile.connectionRequests,
    connectionSuggestions: state.profile.connectionSuggestions,
    loading: state.profile.connections.loading,
    error: state.profile.connections.error
  }));
  
  // Fetch connections and connection requests when component mounts
  useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchConnections({ 
        page: connections.page, 
        limit: connections.limit,
        search: connections.searchQuery,
        filter: connections.currentFilter
      }));
      
      dispatch(fetchConnectionRequests());
      dispatch(fetchConnectionSuggestions());
    }
  }, [dispatch, isOwnProfile]);
  
  // Handle search query change
  const handleSearch = useCallback((query) => {
    dispatch(setConnectionsSearchQuery(query));
    
    // Trigger a new fetch with the updated search query
    dispatch(fetchConnections({ 
      page: 1, // Reset to first page on new search
      limit: connections.limit,
      search: query,
      filter: connections.currentFilter
    }));
  }, [dispatch, connections.limit, connections.currentFilter]);
  
  // Handle filter change
  const handleFilterChange = useCallback((filter) => {
    dispatch(setConnectionsFilter(filter));
    
    // Trigger a new fetch with the updated filter
    dispatch(fetchConnections({ 
      page: 1, // Reset to first page on filter change
      limit: connections.limit,
      search: connections.searchQuery,
      filter
    }));
  }, [dispatch, connections.limit, connections.searchQuery]);
  
  // Handle pagination
  const handleLoadMore = useCallback(() => {
    const nextPage = connections.page + 1;
    dispatch(setConnectionsPage(nextPage));
    
    // Fetch next page of connections
    dispatch(fetchConnections({ 
      page: nextPage,
      limit: connections.limit,
      search: connections.searchQuery,
      filter: connections.currentFilter
    }));
  }, [dispatch, connections.page, connections.limit, connections.searchQuery, connections.currentFilter]);
  
  // Handle connection actions
  const handleSendRequest = useCallback((userId) => {
    dispatch(sendConnectionRequest(userId));
  }, [dispatch]);
  
  const handleAcceptRequest = useCallback((requestId) => {
    dispatch(acceptConnectionRequest(requestId));
  }, [dispatch]);
  
  const handleRejectRequest = useCallback((requestId) => {
    dispatch(rejectConnectionRequest(requestId));
  }, [dispatch]);
  
  const handleRemoveConnection = useCallback((userId) => {
    dispatch(removeConnection(userId));
  }, [dispatch]);
  
  return (
    <Connections 
      connections={connections.data}
      totalConnections={connections.total}
      connectionRequests={connectionRequests}
      connectionSuggestions={connectionSuggestions.data}
      loading={loading}
      error={error}
      searchQuery={connections.searchQuery}
      currentFilter={connections.currentFilter}
      isOwnProfile={isOwnProfile}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onLoadMore={handleLoadMore}
      onSendRequest={handleSendRequest}
      onAcceptRequest={handleAcceptRequest}
      onRejectRequest={handleRejectRequest}
      onRemoveConnection={handleRemoveConnection}
    />
  );
};

export default ConnectionsContainer;

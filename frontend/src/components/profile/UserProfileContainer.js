import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserProfile from './UserProfile';
import { 
  fetchProfile,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  followUser,
  unfollowUser
} from '../../store/slices/profileSlice';

const UserProfileContainer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth and profile data from Redux store
  const { 
    currentUser,
    isAuthenticated 
  } = useSelector((state) => state.auth);
  
  const { 
    profile,
    loading,
    error,
    connections,
    isFollowing,
    connectionStatus
  } = useSelector((state) => ({
    profile: state.profile.profile,
    loading: state.profile.loading,
    error: state.profile.error,
    connections: state.profile.connections,
    isFollowing: state.profile.isFollowing,
    connectionStatus: state.profile.connectionStatus
  }));
  
  // Check if this is the current user's profile
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);
  
  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    } else if (currentUser) {
      // If no userId in URL, fetch current user's profile
      dispatch(fetchProfile(currentUser.id));
    }
  }, [dispatch, userId, currentUser]);
  
  // Handle connect button click
  const handleConnect = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (connectionStatus === 'connected') {
      // Disconnect
      dispatch(removeConnection(profile.id));
    } else if (connectionStatus === 'pending') {
      // Cancel connection request
      // This would depend on your API implementation
      console.log('Cancel connection request');
    } else if (connectionStatus === 'received') {
      // Accept connection request
      dispatch(acceptConnectionRequest(profile.connectionRequestId));
    } else {
      // Send connection request
      dispatch(sendConnectionRequest(profile.id));
    }
  }, [dispatch, isAuthenticated, navigate, profile, connectionStatus]);
  
  // Handle message button click
  const handleMessage = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    navigate('/messages', { state: { userId: profile.id } });
  }, [isAuthenticated, navigate, profile]);
  
  // Handle follow button click
  const handleFollow = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (isFollowing) {
      dispatch(unfollowUser(profile.id));
    } else {
      dispatch(followUser(profile.id));
    }
  }, [dispatch, isAuthenticated, isFollowing, navigate, profile]);
  
  // Handle edit profile button click
  const handleEditProfile = useCallback(() => {
    navigate('/profile/edit');
  }, [navigate]);

  // Handle tab change
  const handleTabChange = useCallback((event, newValue) => {
    // Update URL without page reload
    const tabName = newValue === 0 ? 'activity' : 
                   newValue === 1 ? 'about' : 
                   newValue === 2 ? 'experience' : 
                   newValue === 3 ? 'education' : 'connections';
    
    navigate(`/profile/${userId || ''}?tab=${tabName}`, { replace: true });
  }, [navigate, userId]);

  // Determine active tab from URL
  const getActiveTab = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab') || 'activity';
    
    switch (tab) {
      case 'about':
        return 1;
      case 'experience':
        return 2;
      case 'education':
        return 3;
      case 'connections':
        return 4;
      case 'activity':
      default:
        return 0;
    }
  }, []);

  return (
    <UserProfile 
      profile={profile}
      isOwnProfile={isOwnProfile}
      isConnected={connectionStatus === 'connected'}
      isFollowing={isFollowing}
      loading={loading}
      error={error}
      activeTab={getActiveTab()}
      onTabChange={handleTabChange}
      onConnect={handleConnect}
      onMessage={handleMessage}
      onFollow={handleFollow}
      onEditProfile={handleEditProfile}
    />
  );
};

export default UserProfileContainer;

'use client'
import React, { useEffect, useState } from 'react';

interface UserInfo {
  id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
}

const UserButton: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/current-user');
        const result = await response.json();
        setUser(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Generate initials if no avatar is provided
  const initials = user?.fullname
    ? user.fullname
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    : '';

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-auto p-4 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-500 flex justify-center items-center text-white">
        {user?.avatar ? (
          <img src={user.avatar} alt={`${user.fullname}'s avatar`} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-xl">{initials}</span>
        )}
      </div>
      {user?.fullname && <p className="mt-2 text-sm text-gray-400">{user.fullname}</p>}
      {user?.email && <p className="text-sm text-gray-400">{user.email}</p>}
    </div>
  );
};

export default UserButton;

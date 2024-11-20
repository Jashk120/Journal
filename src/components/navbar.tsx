'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/current-user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Assuming the user object is returned directly
        } else {
          setUser(null); // Handle unauthenticated state
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, []);

  // Logout function to call the API or clear session state
  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'GET',
      credentials: 'include', // Include credentials to send cookies
    });
    setUser(null); // Clear user state after logout
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
         Forex Journal
        </a>
        {loading ? (
          <span>Loading...</span> // Show loading state
        ) : user ? (
          <>
            <span className="mr-4">
              Welcome, {user.data.fullname || user.data.email}
            </span>
            <Button onClick={handleLogout} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

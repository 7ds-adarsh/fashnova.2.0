"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
    name: string;
    email: string;
    mobile?: string;
    address?: string;
    wishlist?: string[];
    userCart?: string[];
}

interface UserContextType {
    userData: UserData | null;
    loading: boolean;
    updateUserData: (data: Partial<UserData>) => Promise<void>;
    fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
        if (!session?.user?.email) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/user/profile?email=${session.user.email}`);
            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = async (data: Partial<UserData>) => {
        if (!session?.user?.email) return;

        try {
            setLoading(true);
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session.user.email,
                    ...data
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setUserData(result.user);
            } else {
                throw new Error('Failed to update user data');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserData();
        } else {
            setUserData(null);
        }
    }, [session?.user?.email]);

    return (
        <UserContext.Provider value={{
            userData,
            loading,
            updateUserData,
            fetchUserData,
        }}>
            {children}
        </UserContext.Provider>
    );
};

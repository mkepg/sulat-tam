import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BASE_URL from '../utilities/dynamicDomain';


type AuthContextType = {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    isTokenMissing: boolean;
    setIsTokenMissing: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserContextType = {
    userProfileUrl: string;
    setUserProfileUrl: React.Dispatch<React.SetStateAction<string>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    bio: string;
    setBio: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserInfoProvider({ children }: { children: React.ReactNode }) {

    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();

    function getDataFromStorage(key: string) {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                return parsed[key] ?? '';
            } catch {
                return '';
            }
        }
        return '';
    };

    const [userProfileUrl, setUserProfileUrl] = useState(() => getDataFromStorage('user_profile_url'));
    const [username, setUsername] = useState(() => getDataFromStorage('username'));
    const [bio, setBio] = useState(() => getDataFromStorage('bio'));
    const [email, setEmail] = useState(() => getDataFromStorage('email'));

    const [isTokenMissing, setIsTokenMissing] = useState(false);

    useEffect(() => {

        async function fetchUserData() {
            try {
                const response = await axios.get(`${BASE_URL}/gets/current_user_info.php`, {
                    withCredentials: true
                });

                const data = response.data.user;
                
                if (data) {
                    localStorage.setItem('user', JSON.stringify(data));
                    setUserProfileUrl(data.user_profile_url ?? '');
                    setUsername(data.username ?? '');
                    setBio(data.bio ?? '');
                    setEmail(data.email ?? '');
                    setIsLogin(true);
                }
            } catch (error) {
                localStorage.removeItem('user');
                setUserProfileUrl('');
                setUsername('');
                setBio('');
                setEmail('');
                setIsLogin(false);
                setIsTokenMissing(true);
                navigate('/login')
            }
        };

        fetchUserData();
    }, []);

    
    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, isTokenMissing, setIsTokenMissing }}>
            <UserContext.Provider
                value={{ 
                    userProfileUrl, 
                    setUserProfileUrl,
                    username, 
                    setUsername, 
                    bio, 
                    setBio, 
                    email, 
                    setEmail}}
            >
                {children}
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthContext.Provider');
    return context;
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within an UserContext.Provider');
    return context;
}

export function useSetUserFromStorage() {
    const { setUserProfileUrl, setUsername, setBio, setEmail } = useUserContext();

    return () => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                setUserProfileUrl(parsed['user_profile_url'] ?? '');
                setUsername(parsed['username'] ?? '');
                setBio(parsed['bio'] ?? '');
                setEmail(parsed['email'] ?? '');
            } catch {
                setUserProfileUrl('');
                setUsername('');
                setBio('');
                setEmail('');
            }
        } else {
            setUserProfileUrl('');
            setUsername('');
            setBio('');
            setEmail('');
        }
    };

}


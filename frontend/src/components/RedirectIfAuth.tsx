import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../context/UserInfoProvider';


export default function RedirectIfAuth({ children }: { children: React.ReactNode }) {
    const { isTokenMissing } = useAuthContext();

    if (!isTokenMissing) {
        return <Navigate to="/" replace />;
    }

    return children;
}
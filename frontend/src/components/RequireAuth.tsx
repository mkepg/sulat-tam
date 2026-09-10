import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../context/UserInfoProvider';


export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isTokenMissing } = useAuthContext();

    if (isTokenMissing) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
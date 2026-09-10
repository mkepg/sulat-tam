import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../context/UserInfoProvider';


export default function RedirectIfInvalid() {
    const { isTokenMissing } = useAuthContext();

    if (isTokenMissing) {
        return <Navigate to="/login" replace />;
    } else {
        return <Navigate to="/" replace />;
    }

}
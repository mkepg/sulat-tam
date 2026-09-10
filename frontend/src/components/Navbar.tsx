import { NavLink, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/UserInfoProvider';

import '../css/navbar.scss';
    
export default function Navbar() {
    const { isLogin } = useAuthContext();
    const navigate = useNavigate();

    return (
        <nav>
            <span 
                className='navBrand'
                onClick={()=> navigate('/')}
            >
                SulatTAM
            </span>
            { isLogin ?
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/editor'>New Article</NavLink></li>
                    <li><NavLink to='settings'>Settings</NavLink></li>
                    <li><NavLink to='/my-profile'>Profile</NavLink></li>
                </ul> :
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='login'>Sign in</NavLink></li>
                    <li><NavLink to='register'>Sign up</NavLink></li>
                </ul>
            }
        </nav>
        
    )
}
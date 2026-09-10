import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthContext, useSetUserFromStorage } from '../context/UserInfoProvider';
import { useFavoriteArticlesContext } from '../context/ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import styles from '../css/form-page.module.scss';


export default function SignIn() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { setIsLogin, setIsTokenMissing } = useAuthContext();
    const refreshUserData = useSetUserFromStorage();
    
    const { setRefreshAll } = useFavoriteArticlesContext();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            
            const response = await axios.post(
                `${BASE_URL}/auths/login.php`,
                new URLSearchParams(formData).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: true
                }
            );

            const data = response.data;

            console.log('Server response:', data);
            localStorage.setItem('user', JSON.stringify(data['user']));
            setRefreshAll(prev => !prev)
            setSuccess(data['message'])
            refreshUserData()
            setTimeout(()=> {
                setFormData({
                    email: '',
                    password: ''
                });
                setIsLogin(true)
                setIsTokenMissing(false)
                navigate('/')
            }, 1200)

        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error.response.data['error']) {
                setError(error.response.data['error']);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.header}>Sign in</h1>
            <NavLink to='/register' className={styles.link}>Need an account?</NavLink>

            <form className={styles.form} onSubmit={handleSubmit}>

                
                {error &&
                <>
                    <p id="errorMessage" className={styles.srOnly}>Error: {error}</p>
                    <ul className={styles.errorMessage}><li>{error}</li></ul>
                </>
                }
                {success &&
                <>
                    <p id="successMessage" className={styles.srOnly}>Status: {success}</p>
                    <ul className={styles.successMessage}><li>{success}</li></ul>
                </>
                }

                <label htmlFor="email" className={styles.srOnly}>Email</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    className={styles.input}
                    placeholder='Email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <label htmlFor="password" className={styles.srOnly}>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    className={styles.input}
                    placeholder='Password'
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                

                <button type='submit' className={styles.button}>Sign in</button>
            </form>
        </main>
    );
}
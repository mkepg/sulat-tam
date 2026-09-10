import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

import BASE_URL from '../utilities/dynamicDomain';

import styles from '../css/form-page.module.scss';


export default function SignIn() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                `${BASE_URL}/auths/register.php`,
                new URLSearchParams(formData).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );

            const data = response.data;
            
            console.log('Server response:', data);
            setSuccess(data['message'])

            setTimeout(()=> {
                setFormData({
                    username: '',
                    email: '',
                    password: ''
                });
                navigate('/login')
            }, 5000)
            
        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error.response.data['error']) {
                setError(error.response.data['error']);
            } else {
                setError('An unexpected error occurred.');
            }
        }

    };

    return (
        <main className={styles.main}>
            <h1 className={styles.header}>Sign up</h1>
            <NavLink to='/login' className={styles.link}>Have an account?</NavLink>

            <form onSubmit={handleSubmit} className={styles.form}>

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

                <label htmlFor="username" className={styles.srOnly}>Username</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    value={formData.username}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder='Username'
                    required
                />

                <label htmlFor="email" className={styles.srOnly}>Email</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder='Email'
                    required
                />

                <label htmlFor="password" className={styles.srOnly}>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder='Password'
                    required
                />

                <button type='submit' className={styles.button}>Sign up</button>
            </form>
        </main>
    );
}

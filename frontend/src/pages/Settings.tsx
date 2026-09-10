import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthContext, useSetUserFromStorage, useUserContext } from '../context/UserInfoProvider';
import { useCurrentUserArticleContext, useGlobalArticleContext } from '../context/ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import styles from '../css/form-page.module.scss';

export default function Settings() {
    const navigate = useNavigate();
    const { setIsLogin, setIsTokenMissing } = useAuthContext();
    const refreshUserData = useSetUserFromStorage();
    const { username: storedUsername, bio: storedBio, email: storedEmail } = useUserContext();
    const { setRefreshCurrentUserArticles } = useCurrentUserArticleContext();
    const { setRefreshGlobalArticles } = useGlobalArticleContext();

    const [formData, setFormData] = useState({
        username: storedUsername || '',
        bio: storedBio || '',
        email: storedEmail || '',
        password: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleLogout() {
        const response = await axios.post(
            `${BASE_URL}/auths/logout.php`, {} ,
            { 
                withCredentials: true 
            }
        )

        const data = response.data;
        console.log('Server response:', data['message']);

        localStorage.removeItem('user');
        
        setIsLogin(false);
        refreshUserData();
        setIsTokenMissing(true);
        navigate('/login');
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
    }

    async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        if (formData.password.trim()) form.append('password', formData.password);
        if (formData.bio.trim()) form.append('bio', formData.bio);
        if (selectedFile) form.append('image', selectedFile);

        try {
            const response = await axios.post(
                `${BASE_URL}/updates/user_info.php`,
                form,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            localStorage.setItem('user', JSON.stringify(response.data['user']));
            setSuccess(response.data['message']);
            refreshUserData();
            setRefreshCurrentUserArticles(prev => !prev);
            setRefreshGlobalArticles(prev => !prev);

            setTimeout(() => {
                navigate('/my-profile');
            }, 1000);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            setError(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.header}>Profile Settings</h1>
            <form className={`${styles.form} ${styles.formModified}`} onSubmit={handleUpdate}>

                {error &&
                    <>
                        <p id="errorMessage" className={styles.srOnly}>Error: {error}</p>
                        <ul className={styles.errorMessage}><li>{error}</li></ul>
                    </>
                }
                {success &&
                    <>
                        <p id="successMessage" className={styles.srOnly}>Success: {success}</p>
                        <ul className={styles.successMessage}><li>{success}</li></ul>
                    </>
                }

                <div className={styles.fileInputWrapper}>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="image"
                        className={`${styles.customFileInput} ${selectedFile ? styles.customFileInputSelected : ''}`}
                    >
                        {selectedFile ? selectedFile.name : "Choose profile picture..."}
                    </label>
                </div>

                <label htmlFor="username" className={styles.srOnly}>Your Name</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className={`${styles.input} ${styles.inputSmall}`}
                    placeholder="Your Name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="bio" className={styles.srOnly}>Short Bio</label>
                <textarea
                    name="bio"
                    id="bio"
                    rows={7}
                    className={`${styles.input} ${styles.textareaSmall}`}
                    placeholder="Short bio about you"
                    value={formData.bio}
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="email" className={styles.srOnly}>Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className={`${styles.input} ${styles.inputSmall}`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password" className={styles.srOnly}>Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className={`${styles.input} ${styles.inputSmall}`}
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit" className={`${styles.button} ${styles.buttonWider}`}>
                    Update Settings
                </button>

                <hr className={styles.hrSettings} />

                <button type="button" className={styles.logout} onClick={handleLogout}>
                    Or click here to logout.
                </button>

            </form>
        </main>
    );
}

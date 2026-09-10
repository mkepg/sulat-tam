import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useGlobalArticleContext, useCurrentUserArticleContext } from '../context/ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import styles from '../css/form-page.module.scss';


export default function NewArticle() {
    const navigate = useNavigate();
    const { setRefreshGlobalArticles } = useGlobalArticleContext();
    const { setRefreshCurrentUserArticles } = useCurrentUserArticleContext();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        body: '',
        tags: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
                `${BASE_URL}/posts/create_article.php`,
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

            setSuccess(data['message']);
            setRefreshGlobalArticles(prev => !prev)
            setRefreshCurrentUserArticles(prev => !prev)
            
            setTimeout(() => {
                setFormData({
                    title: '',
                    description: '',
                    body: '',
                    tags: ''
                });
                navigate('/');
            }, 1000);

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
            <h1 className={styles.header}>Article editor</h1>

            <form className={`${styles.form} ${styles.formModified}`} onSubmit={handleSubmit}>
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

                <label htmlFor="title" className={styles.srOnly}>Article Title</label>
                <input 
                    type='text' 
                    name='title' 
                    id='title' 
                    className={`${styles.input} ${styles.inputArticle}`} 
                    placeholder='Article title' 
                    required 
                    value={formData.title}
                    onChange={handleChange}
                />

                <label htmlFor="description" className={styles.srOnly}>Article Description</label>
                <input 
                    type='text' 
                    name='description' 
                    id='description' 
                    className={`${styles.input} ${styles.inputArticle}`} 
                    placeholder="What's this article about?" 
                    required 
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="body" className={styles.srOnly}>Article Body</label>
                <textarea 
                    name='body' 
                    id='body' 
                    rows={7} 
                    className={`${styles.input} ${styles.textarea}`} 
                    placeholder='Write your article' 
                    required 
                    value={formData.body}
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="tags" className={styles.srOnly}>Tags</label>
                <input 
                    type='text' 
                    name='tags' 
                    id='tags' 
                    className={`${styles.input} ${styles.inputArticle}`} 
                    placeholder='Enter tags' 
                    value={formData.tags}
                    onChange={handleChange}
                />

                <button 
                    type='submit' 
                    className={`${styles.button} ${styles.buttonWider}`}
                >
                    Publish Article
                </button>
            </form>
        </main>
    );
}

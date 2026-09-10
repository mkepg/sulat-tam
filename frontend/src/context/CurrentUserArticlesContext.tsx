import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import { useFavoriteArticlesContext } from './ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle, CurrentUserArticlesContextType } from './articleTypes';


export const CurrentUserArticlesContext = createContext<CurrentUserArticlesContextType | undefined>(undefined);

export function CurrentUserArticlesProvider({ children }: { children: React.ReactNode }) {
    const [currentUserArticles, setCurrentUserArticles] = useState<PreviewArticle[] | null>(null);
    const [currentUserArticlesLoading, setCurrentUserArticlesLoading] = useState(true);
    const [currentUserArticlesError, setCurrentUserArticlesError] = useState<string | null>(null);
    const [refreshCurrentUserArticles, setRefreshCurrentUserArticles] = useState(false);
    const [currentUserArticlesCount, setCurrentUserArticlesCount] = useState(0);
    const [currentUserCurrentPage, setCurrentUserCurrentPage] = useState(1);
    const currentUserLimit = 8;

    const { refreshAll } = useFavoriteArticlesContext()

    useEffect(() => {
        async function fetchCurrentUserArticles() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/current_user_articles.php`,
                    {
                        params: { limit: currentUserLimit, page: currentUserCurrentPage },
                        withCredentials: true,
                    }
                );
                setCurrentUserArticles(response.data.articles);
                setCurrentUserArticlesLoading(false);
                setCurrentUserArticlesError(null);
            } catch {
                setCurrentUserArticlesError('Failed to load articles...');
                setCurrentUserArticlesLoading(false);
            }
        }

        fetchCurrentUserArticles();
    }, [refreshCurrentUserArticles, currentUserCurrentPage, refreshAll]);

    useEffect(() => {
        async function fetchCurrentUserArticlesCount() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/current_user_articles_count.php`,
                    { withCredentials: true }
                );
                setCurrentUserArticlesCount(response.data.count);
            } catch (err) {
                console.error('Error fetching current user article count:', err);
            }
        }

        fetchCurrentUserArticlesCount();
    }, [refreshCurrentUserArticles]);

    return (
        <CurrentUserArticlesContext.Provider
            value={{
                currentUserArticles,
                setCurrentUserArticles,
                currentUserArticlesLoading,
                setCurrentUserArticlesLoading,
                currentUserArticlesError,
                setCurrentUserArticlesError,
                setRefreshCurrentUserArticles,
                currentUserCurrentPage,
                setCurrentUserCurrentPage,
                currentUserArticlesCount,
                setCurrentUserArticlesCount,
                currentUserLimit,
            }}
        >
            {children}
        </CurrentUserArticlesContext.Provider>
    );
}

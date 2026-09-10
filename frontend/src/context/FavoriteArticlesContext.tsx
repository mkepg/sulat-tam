import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle, FavoriteArticlesContextType } from './articleTypes';


export const FavoriteArticlesContext = createContext<FavoriteArticlesContextType | undefined>(undefined);

export function FavoriteArticlesProvider({ children }: { children: React.ReactNode }) {
    const [favoriteArticles, setFavoriteArticles] = useState<PreviewArticle[] | null>(null);
    const [favoriteArticlesLoading, setFavoriteArticlesLoading] = useState(true);
    const [favoriteArticlesError, setFavoriteArticlesError] = useState<string | null>(null);
    const [refreshAll, setRefreshAll] = useState(false);
    const [favoriteArticlesCount, setFavoriteArticlesCount] = useState(0);
    const [favoriteArticlesCurrentPage, setFavoriteArticlesCurrentPage] = useState(1);
    const favoriteLimit = 8;


    useEffect(() => {
        async function fetchFavoriteArticles() {
            try {
                
                const response = await axios.get(
                    `${BASE_URL}/gets/favorite_articles.php`,
                    {
                        params: { limit: favoriteLimit, page: favoriteArticlesCurrentPage },
                        withCredentials: true,
                    }
                );
                setFavoriteArticles(response.data.articles);
                setFavoriteArticlesLoading(false);
                setFavoriteArticlesError(null)
            } catch {
                setFavoriteArticlesError('Failed to load favorite articles...');
                setFavoriteArticlesLoading(false);
            }
        }

        fetchFavoriteArticles();
    }, [refreshAll, favoriteArticlesCurrentPage]);

    useEffect(() => {
        async function fetchFavoriteArticlesCount() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/favorite_articles_count.php`,
                    { withCredentials: true }
                );
                setFavoriteArticlesCount(response.data.count);
            } catch (err) {
                console.error('Error fetching favorite articles count:', err);
            }
        }

        fetchFavoriteArticlesCount();
    }, [refreshAll]);


    return (
        <FavoriteArticlesContext.Provider
            value={{
                favoriteArticles,
                setFavoriteArticles,
                favoriteArticlesLoading,
                setFavoriteArticlesLoading,
                favoriteArticlesError,
                setFavoriteArticlesError,
                refreshAll,
                setRefreshAll,
                favoriteArticlesCurrentPage,
                setFavoriteArticlesCurrentPage,
                favoriteArticlesCount,
                setFavoriteArticlesCount,
                favoriteLimit,
            }}
        >
            {children}
        </FavoriteArticlesContext.Provider>
    );
}

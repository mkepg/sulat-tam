import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import { useFavoriteArticlesContext } from './ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle, GlobalArticlesContextType } from './articleTypes';


export const GlobalArticlesContext = createContext<GlobalArticlesContextType | undefined>(undefined);

export function GlobalArticlesProvider({ children }: { children: React.ReactNode }) {
    const [globalArticles, setGlobalArticles] = useState<PreviewArticle[] | null>(null);
    const [globalArticlesLoading, setGlobalArticlesLoading] = useState(true);
    const [globalArticlesError, setGlobalArticlesError] = useState<string | null>(null);
    const [refreshGlobalArticles, setRefreshGlobalArticles] = useState(false);
    const [globalArticlesCount, setGlobalArticlesCount] = useState<number>(0);
    const [globalCurrentPage, setGlobalCurrentPage] = useState(1);
    const globalLimit = 10;

    const { refreshAll } = useFavoriteArticlesContext()

    useEffect(() => {
        async function fetchGlobalArticles() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/global_articles.php`,
                    {
                        params: { limit: globalLimit, page: globalCurrentPage },
                        withCredentials: true,
                    }
                );
                setGlobalArticles(response.data.articles);
                setGlobalArticlesLoading(false);
                setGlobalArticlesError(null);
            } catch {
                setGlobalArticlesError('Failed to load articles...');
                setGlobalArticlesLoading(false);
            }
        }

        fetchGlobalArticles();
    }, [refreshGlobalArticles, globalCurrentPage, refreshAll]);

    useEffect(() => {
        async function fetchGlobalArticlesCount() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/global_articles_count.php`,
                    { withCredentials: true }
                );
                setGlobalArticlesCount(response.data.count);
            } catch (err) {
                console.error('Error fetching global article count:', err);
            }
        }

        fetchGlobalArticlesCount();
    }, [refreshGlobalArticles]);

    return (
        <GlobalArticlesContext.Provider
            value={{
                globalArticles,
                setGlobalArticles,
                globalArticlesLoading,
                setGlobalArticlesLoading,
                globalArticlesError,
                setGlobalArticlesError,
                refreshGlobalArticles,
                setRefreshGlobalArticles,
                globalArticlesCount,
                setGlobalArticlesCount,
                globalCurrentPage,
                setGlobalCurrentPage,
                globalLimit,
            }}
        >
            {children}
        </GlobalArticlesContext.Provider>
    );
}

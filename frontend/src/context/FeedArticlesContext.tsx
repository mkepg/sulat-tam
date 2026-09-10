import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import { useFavoriteArticlesContext } from './ArticleInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle, FeedArticlesContextType } from './articleTypes';


export const FeedArticlesContext = createContext<FeedArticlesContextType | undefined>(undefined);

export function FeedArticlesProvider({ children }: { children: React.ReactNode }) {
    const [feedArticles, setFeedArticles] = useState<PreviewArticle[] | null>(null);
    const [feedArticlesLoading, setFeedArticlesLoading] = useState(true);
    const [feedArticlesError, setFeedArticlesError] = useState<string | null>(null);
    const [refreshFeedArticles, setRefreshFeedArticles] = useState(false);
    const [feedArticlesCount, setFeedArticlesCount] = useState<number>(0);
    const [feedCurrentPage, setFeedCurrentPage] = useState(1);
    const feedLimit = 10;

    const { refreshAll } = useFavoriteArticlesContext();

    useEffect(() => {
        async function fetchFeedArticles() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/feed_articles.php`,
                    {
                        params: { limit: feedLimit, page: feedCurrentPage },
                        withCredentials: true,
                    }
                );
                setFeedArticles(response.data.articles);
                setFeedArticlesLoading(false);
                setFeedArticlesError(null)
            } catch {
                setFeedArticlesError('Failed to load feed articles...');
                setFeedArticlesLoading(false);
            }
        }

        fetchFeedArticles();
    }, [refreshFeedArticles, feedCurrentPage, refreshAll]);

    useEffect(() => {
        async function fetchFeedArticlesCount() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/feed_articles_count.php`,
                    { withCredentials: true }
                );
                setFeedArticlesCount(response.data.count);
            } catch (err) {
                console.error('Error fetching feed article count:', err);
            }
        }

        fetchFeedArticlesCount();
    }, [refreshFeedArticles]);

    return (
        <FeedArticlesContext.Provider
            value={{
                feedArticles,
                setFeedArticles,
                feedArticlesLoading,
                setFeedArticlesLoading,
                feedArticlesError,
                setFeedArticlesError,
                setRefreshFeedArticles,
                feedArticlesCount,
                setFeedArticlesCount,
                feedCurrentPage,
                setFeedCurrentPage,
                feedLimit,
            }}
        >
            {children}
        </FeedArticlesContext.Provider>
    );
}
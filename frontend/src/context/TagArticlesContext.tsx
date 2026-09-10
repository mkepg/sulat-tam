import { createContext, useState, useEffect } from "react";
import axios from "axios";

import { useGlobalArticleContext } from "./ArticleInfoProvider";
import BASE_URL from "../utilities/dynamicDomain";

import type { Tag, PreviewArticle, TagArticlesContextType } from "./articleTypes";

export const TagArticlesContext = createContext<TagArticlesContextType | undefined>(undefined);

export function TagArticlesProvider({ children }: { children: React.ReactNode }) {
    const { refreshGlobalArticles } = useGlobalArticleContext();

    const [popularTags, setPopularTags] = useState<Tag[] | null>(null);
    const [popularTagsError, setPopularTagsError] = useState<string | null>(null);
    const [tagArticles, setTagArticles] = useState<PreviewArticle[] | null>(null);
    const [tagArticlesError, setTagArticlesError] = useState<string | null>(null);
    const [tagArticlesLoading, setTagArticlesLoading] = useState<boolean>(false);
    const [refreshTagArticles, setRefreshTagArticles] = useState(false);
    const [currentTag, setCurrentTag] = useState<number | null>(null);
    const [tagArticlesCount, setTagArticlesCount] = useState<number>(0);
    const [tagCurrentPage, setTagCurrentPage] = useState(1);
    const tagLimit = 10;

    useEffect(() => {
        async function fetchPopularTags() {
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/popular_tags.php`,
                    {
                        withCredentials: true,
                    }
                );
                console.log(response)
                setPopularTags(response.data);
                setPopularTagsError(null);
            } catch {
                setPopularTagsError('Could not load tags');
            }
        }

        fetchPopularTags();
    }, [refreshGlobalArticles]);

    useEffect(() => {
        async function fetchTagArticles() {
            if (!currentTag) return;

            setTagArticlesLoading(true);

            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/articles_by_tag.php`,
                    {
                        params: { tag: currentTag, limit: tagLimit, page: tagCurrentPage },
                        withCredentials: true,
                    }
                );
                console.log(response)
                setTagArticles(response.data.articles);
                setTagArticlesError(null);
            } catch {
                setTagArticlesError('Failed to load tag articles...');
            } finally {
                setTagArticlesLoading(false);
            }
        }

        fetchTagArticles();
    }, [currentTag, tagCurrentPage, refreshTagArticles]);

    useEffect(() => {
        async function fetchTagArticlesCount() {
            if (!currentTag) return;

            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/articles_by_tag_count.php`,
                    {
                        params: { tag: currentTag },
                        withCredentials: true,
                    }
                );
                setTagArticlesCount(response.data.count);
            } catch (err) {
                console.error('Error fetching tag articles count:', err);
            }
        }

        fetchTagArticlesCount();
    }, [currentTag, refreshTagArticles]);

    return (
        <TagArticlesContext.Provider
            value={{
                popularTags,
                setPopularTags,
                popularTagsError,
                setPopularTagsError,
                tagArticles,
                setTagArticles,
                tagArticlesLoading,
                setTagArticlesLoading,
                tagArticlesError,
                setTagArticlesError,
                refreshTagArticles,
                setRefreshTagArticles,
                currentTag,
                setCurrentTag,
                tagArticlesCount,
                setTagArticlesCount,
                tagCurrentPage,
                setTagCurrentPage,
                tagLimit,
            }}
        >
            {children}
        </TagArticlesContext.Provider>
    );
}

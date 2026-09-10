import { useGlobalArticleContext } from '../context/ArticleInfoProvider';

import ArticleCard from './ArticleCard';
import pageButtons from '../utilities/PaginationButton';


export default function GlobalArticleElements() {
    const {
        globalArticles,
        globalArticlesLoading,
        globalArticlesError,
        globalArticlesCount,
        globalCurrentPage,
        setGlobalCurrentPage,
        globalLimit
    } = useGlobalArticleContext();

    const totalPage = Math.ceil(globalArticlesCount / globalLimit);
    
    if (globalArticlesLoading) {
        return <p>Loading articles...</p>;
    }
    if (globalArticlesError) {
        return <p>{globalArticlesError}</p>;
    }
    if (!globalArticles || globalArticles.length === 0) {
        return <p>No articles found...</p>;
    }

    return (
        <>
            {globalArticles.map((articleItem, index) => (
                <ArticleCard
                    key={articleItem.id}
                    articleItem={articleItem}
                    articleIndex={index}
                    articleArrayLength={globalArticles.length}
                />
            ))}
            {pageButtons(totalPage, globalCurrentPage, setGlobalCurrentPage)}
        </>
    );
}

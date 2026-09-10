import { useCurrentUserArticleContext } from '../context/ArticleInfoProvider';

import ArticleCard from './ArticleCard';
import pageButtons from '../utilities/PaginationButton';


export default function CurrentUserArticleElements() {
    const {
        currentUserArticles,
        currentUserArticlesLoading,
        currentUserArticlesError,
        currentUserCurrentPage,
        setCurrentUserCurrentPage,
        currentUserArticlesCount,
        currentUserLimit
    } = useCurrentUserArticleContext();

    const totalPage = Math.ceil(currentUserArticlesCount / currentUserLimit);

    if (currentUserArticlesLoading) {
        return <p>Loading articles...</p>;
    }
    if (currentUserArticlesError) {
        return <p>{currentUserArticlesError}</p>;
    }
    if (!currentUserArticles || currentUserArticles.length === 0) {
        return <p>No articles found...</p>;
    }

    return (
        <>
            {currentUserArticles.map((articleItem, index) => (
                <ArticleCard
                    key={articleItem.id}
                    articleItem={articleItem}
                    articleIndex={index}
                    articleArrayLength={currentUserArticles.length}
                />
            ))}
            {pageButtons(totalPage, currentUserCurrentPage, setCurrentUserCurrentPage)}
        </>
    );
}

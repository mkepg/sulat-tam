import { useFeedArticleContext } from '../context/ArticleInfoProvider';

import ArticleCard from './ArticleCard';
import pageButtons from '../utilities/PaginationButton';

export default function FeedArticleElements() {
    const {
        feedArticles,
        feedArticlesLoading,
        feedArticlesError,
        feedArticlesCount,
        feedCurrentPage,
        setFeedCurrentPage,
        feedLimit
    } = useFeedArticleContext();

    const totalPage = Math.ceil(feedArticlesCount / feedLimit);

    if (feedArticlesLoading) {
        return <p>Loading articles...</p>;
    }
    if (feedArticlesError) {
        return <p>{feedArticlesError}</p>;
    }
    if (!feedArticles || feedArticles.length === 0) {
        return <p>No articles found...</p>;
    }

    return (
        <>
            {feedArticles.map((articleItem, index) => (
                <ArticleCard
                    key={articleItem.id}
                    articleItem={articleItem}
                    articleIndex={index}
                    articleArrayLength={feedArticles.length}
                />
            ))}
            {pageButtons(totalPage, feedCurrentPage, setFeedCurrentPage)}
        </>
    );
}

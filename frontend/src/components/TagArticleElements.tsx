import { useTagArticleContext } from '../context/ArticleInfoProvider';

import ArticleCard from './ArticleCard';
import pageButtons from '../utilities/PaginationButton';

export default function TagArticleElements() {
    const {
        tagArticles,
        tagArticlesLoading,
        tagArticlesError,
        tagArticlesCount,
        tagCurrentPage,
        setTagCurrentPage,
        tagLimit
    } = useTagArticleContext();

    const totalPage = Math.ceil(tagArticlesCount / tagLimit);

    if (tagArticlesLoading) {
        return <p>Loading tag-based articles...</p>;
    }
    if (tagArticlesError) {
        return <p>{tagArticlesError}</p>;
    }
    if (!tagArticles || tagArticles.length === 0) {
        return <p>No articles found for this tag...</p>;
    }

    return (
        <>
            {tagArticles.map((articleItem, index) => (
                <ArticleCard
                    key={articleItem.id}
                    articleItem={articleItem}
                    articleIndex={index}
                    articleArrayLength={tagArticles.length}
                />
            ))}
            {pageButtons(totalPage, tagCurrentPage, setTagCurrentPage)}
        </>
    );
}

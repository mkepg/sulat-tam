import { useFavoriteArticlesContext } from '../context/ArticleInfoProvider';

import ArticleCard from './ArticleCard';
import pageButtons from '../utilities/PaginationButton';


export default function FavoriteArticleElements() {
    const {
        favoriteArticles,
        favoriteArticlesLoading,
        favoriteArticlesError,
        favoriteArticlesCurrentPage,
        setFavoriteArticlesCurrentPage,
        favoriteArticlesCount,
        favoriteLimit
    } = useFavoriteArticlesContext();

    const totalPage = Math.ceil(favoriteArticlesCount / favoriteLimit);

    if (favoriteArticlesLoading) {
        return <p>Loading favorite articles...</p>;
    }
    if (favoriteArticlesError) {
        return <p>{favoriteArticlesError}</p>;
    }
    if (!favoriteArticles || favoriteArticles.length === 0) {
        return <p>No favorite articles found...</p>;
    }

    return (
        <>
            {favoriteArticles.map((articleItem, index) => (
                <ArticleCard
                    key={articleItem.id}
                    articleItem={articleItem}
                    articleIndex={index}
                    articleArrayLength={favoriteArticles.length}
                />
            ))}
            {pageButtons(totalPage, favoriteArticlesCurrentPage, setFavoriteArticlesCurrentPage)}
        </>
    );
}

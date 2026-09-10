import {    useEffect,    useState } from 'react';
import {    useNavigate,    useParams } from 'react-router-dom';
import axios from 'axios';

import { useUserContext } from '../context/UserInfoProvider';
import { useFavoriteArticlesContext } from '../context/ArticleInfoProvider';
import { useFeedArticleContext } from '../context/ArticleInfoProvider';

import CommentSection from '../components/CommentSection';
import BASE_URL from '../utilities/dynamicDomain';

import type { NavigateFunction } from 'react-router-dom';
import type { Comment } from '../components/CommentSection';

import articleStyles from '../css/articlepage.module.scss';

type Article = {
    id: number;
    title: string;
    about: string;
    content: string;
    slug: string;
    postDate: string;
    favoritesCount: number;
    tags: string[];
};

type Author = {
    id: number;
    username: string;
    userProfileImageUrl: string;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function handleViewPublicProfile(
    username: string,
    currentUserUsername: string,
    navigate: NavigateFunction
) {
    if (currentUserUsername === username) {
        navigate('/my-profile');
        return;
    }
    navigate('/profile/' + encodeURIComponent(username));
}

export default function ArticlePage() {
    const { username, slug } = useParams();

    const [article, setArticle] = useState<Article | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState<Boolean>(false);
    const [favoritesCount, setFavoritesCount] = useState<number | null>(null);
    const [isFollow, setIsFollow] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const { username: currentUserUsername } = useUserContext();
    const { setRefreshFeedArticles } = useFeedArticleContext();
    const { setRefreshAll } = useFavoriteArticlesContext();
    const navigate = useNavigate();

    const articleId = article?.id ?? null;
    const authorId = author?.id ?? null;

    const formattedDate = article?.postDate
        ? (() => {
            const date = new Date(article.postDate);
            const monthAbbr = months[date.getMonth()].slice(0, 3);
            return `${monthAbbr} ${date.getDate()}, ${date.getFullYear()}`;
        })()
        : '';

    async function fetchFollowStatus(authorId: number) {
        try {
            const response = await axios.get(
                `${BASE_URL}/gets/follow_status.php`,
                {
                    params: { followee_id: authorId },
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setIsFollow(response.data.following);
            setFollowersCount(response.data.followersCount);
        } catch {
            console.error('Failed to fetch follow status...');
        }
    }

    async function fetchFavoriteStatus(articleId: number) {
        try {
            const response = await axios.get(
                `${BASE_URL}/gets/favorite_status.php`,
                {
                    params: { article_id: articleId },
                    withCredentials: true
                }
            );
            setIsFavorite(response.data.favorited);
            setFavoritesCount(response.data.favoritesCount);
        } catch {
            console.error('Failed to fetch favorite status...');
        }
    }

    useEffect(() => {
        async function fetchArticleData() {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(
                    `${BASE_URL}/gets/public_view_article.php`,
                    {
                        params: { username, slug },
                        withCredentials: true
                    }
                );

                setArticle(response.data.article);
                setAuthor(response.data.author);
                setComments(response.data.comments);

                fetchFollowStatus(response.data.author.id);
                fetchFavoriteStatus(response.data.article.id);
            } catch {
                setError('Failed to load article...');
            } finally {
                setLoading(false);
            }
        }

        fetchArticleData();
    }, []);

    async function toggleFollow() {
        if (!authorId) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/updates/follows.php`,
                { followee_id: authorId },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setIsFollow(response.data.following);
            setFollowersCount(response.data.followersCount);
            setRefreshFeedArticles(prev => !prev);
        } catch {
            console.error('Failed to toggle follow status...');
        }
    }

    async function toggleFavorite() {
        if (!articleId) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/updates/favorites.php`,
                { article_id: articleId },
                { withCredentials: true }
            );
            setIsFavorite(response.data.favorited);
            setFavoritesCount(response.data.favoritesCount);
            setRefreshAll(prev => !prev);
        } catch {
            console.error('Failed to toggle favorites...');
        }
    }

    return (
        <>
            <header className={articleStyles.hero}>
                <h1 className={articleStyles.articleTitle}>
                    {
                        loading
                            ? 'Loading article...'
                            : error
                                ? error
                                : !article || !author
                                    ? 'Article not found...'
                                    : article.title
                    }
                </h1>

                {article && author && (
                    <div className={articleStyles.heroLayout}>
                        <div className={articleStyles.articlepostInfoContainer}>
                            <div className={articleStyles.imgFrame}>
                                <img
                                    src={author.userProfileImageUrl}
                                    alt={`${author.username}'s photo`}
                                    onClick={() =>
                                        handleViewPublicProfile(
                                            author.username,
                                            currentUserUsername,
                                            navigate
                                        )
                                    }
                                />
                            </div>
                            <div className={articleStyles.articlepostNameDate}>
                                <span
                                    className={articleStyles.articlepostUsername}
                                    onClick={() =>
                                        handleViewPublicProfile(
                                            author.username,
                                            currentUserUsername,
                                            navigate
                                        )
                                    }
                                >
                                    {author.username}
                                </span>
                                <span className={articleStyles.articlepostDate}>
                                    {formattedDate}
                                </span>
                            </div>
                        </div>

                        {currentUserUsername !== author.username && (
                            <button
                                className={`${articleStyles.btnFollow} ${isFollow ? articleStyles.btnUnfollow : ''}`}
                                onClick={toggleFollow}
                            >
                                {isFollow
                                    ? `Unfollow ${author.username} (${followersCount})`
                                    : `Follow ${author.username} (${followersCount})`}
                            </button>
                        )}

                        <button
                            className={articleStyles.btnFavorite}
                            onClick={toggleFavorite}
                        >
                            {isFavorite
                                ? `Unfavorite Article (${favoritesCount})`
                                : `Favorite Article (${favoritesCount})`}
                        </button>
                    </div>
                )}
            </header>

            <main className={articleStyles.pageLayout}>
                {!article || !author ? (
                    <p></p>
                ) : (
                    <>
                        <p className={articleStyles.text}>{article.content}</p>

                        {article.tags.length > 0 && (
                            <ul className={articleStyles.popularTagsList}>
                                {article.tags.map((tag, index) => (
                                    <li key={index}>
                                        <button>{tag}</button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <hr className={articleStyles.line} />

                        <div className={articleStyles.userInfoLayout}>
                            <div className={articleStyles.articlepostInfoContainer}>
                                <div className={articleStyles.imgFrame}>
                                    <img
                                        src={author.userProfileImageUrl}
                                        alt="author profile"
                                        onClick={() =>
                                            handleViewPublicProfile(
                                                author.username,
                                                currentUserUsername,
                                                navigate
                                            )
                                        }
                                    />
                                </div>
                                <div className={articleStyles.articlepostNameDate}>
                                    <span
                                        className={articleStyles.articlepostUsername}
                                        onClick={() =>
                                            handleViewPublicProfile(
                                                author.username,
                                                currentUserUsername,
                                                navigate
                                            )
                                        }
                                    >
                                        {author.username}
                                    </span>
                                    <span className={articleStyles.articlepostDate}>
                                        {formattedDate}
                                    </span>
                                </div>
                            </div>

                            {currentUserUsername !== author.username && (
                                <button
                                    className={`${articleStyles.btnFollow} ${isFollow ? articleStyles.btnUnfollow : ''}`}
                                    onClick={toggleFollow}
                                >
                                    {isFollow
                                        ? `Unfollow ${author.username} (${followersCount})`
                                        : `Follow ${author.username} (${followersCount})`}
                                </button>
                            )}

                            <button
                                className={articleStyles.btnFavorite}
                                onClick={toggleFavorite}
                            >
                                {isFavorite
                                    ? `Unfavorite Article (${favoritesCount})`
                                    : `Favorite Article (${favoritesCount})`}
                            </button>
                        </div>

                        <CommentSection comments={comments} setComments={setComments} articleId={articleId} />
                    </>
                )}
            </main>
        </>
    );
}

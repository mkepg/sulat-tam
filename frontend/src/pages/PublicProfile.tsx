import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useFavoriteArticlesContext } from '../context/ArticleInfoProvider';
import { useFeedArticleContext } from '../context/ArticleInfoProvider';

import ArticleItem from '../components/ArticleCard';
import FeedList from '../utilities/FeedList';
import pageButtons from '../utilities/PaginationButton';
import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle } from '../context/articleTypes';

import styles from '../css/profile.module.scss';
import shared from '../css/homepage.module.scss';

export default function PublicProfile() {
    const { username } = useParams();

    const [profileId, setProfileId] = useState(null);
    const [userProfileUrl, setUserProfileUrl] = useState('');
    const [bio, setBio] = useState('');
    const [articles, setArticles] = useState<PreviewArticle[] | null>(null);
    const [articlesCount, setArticlesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFeed, setCurrentFeed] = useState<0 | 1 | 2>(0);

    const [isFollow, setIsFollow] = useState(false);
    const [followersCount, setFollowersCount] = useState(null);

    const { refreshAll } = useFavoriteArticlesContext();
    const { setRefreshFeedArticles } = useFeedArticleContext();

    const limit = 8;
    const totalPage = Math.ceil(articlesCount / limit);

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
        } catch (error) {
            console.error('Failed to fetch follow status...');
        }
    }

    useEffect(() => {
        async function fetchPublicProfile() {
            try {
                const response = await axios.get(`${BASE_URL}/gets/public_user_info.php`, {
                    params: { username },
                    withCredentials: true
                });
                setProfileId(response.data.user.user_id);
                setUserProfileUrl(response.data.user.user_profile_url);
                setBio(response.data.user.bio);

                fetchFollowStatus(response.data.user.user_id)
            } catch {
                setError('Failed to load user profile info...');
            }
        }

        fetchPublicProfile();
    }, [username]);

    useEffect(() => {
        async function fetchArticles() {
            setLoading(true);
            setError('');
            try {
                const url =
                    currentFeed === 0
                        ? `${BASE_URL}/gets/public_user_articles.php`
                        : `${BASE_URL}/gets/public_favorite_articles.php`;

                const response = await axios.get(url, {
                    params: { username, page: currentPage, limit },
                    withCredentials: true
                });
                setArticles(response.data.articles);
                setArticlesCount(response.data.count);
            } catch {
                setError('Failed to load articles...');
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, [username, currentFeed, currentPage, refreshAll]);


    async function toggleFollow() {
        try {
            const response = await axios.post(
                `${BASE_URL}/updates/follows.php`,
                { followee_id: profileId },
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
        } catch (error) {
            console.error('Failed to toggle follow status...');
        }
    }

    return (
        <div className={styles.pageLayout}>
            <header className={styles.header}>
                <div className={`${shared.imgFrame} ${styles.imgFrame}`}>
                    <img src={userProfileUrl} alt="user profile picture" />
                </div>
                <span className={styles.username}>{username}</span>
                <span className={styles.bio}>{bio ?? ''}</span>
                <button
                    className={`${styles.edit} ${styles.btnFollow} ${isFollow ? styles.btnUnfollow : ''}`}
                    onClick={() => toggleFollow()}
                >
                    {isFollow
                        ? `Unfollow ${username} (${followersCount})`
                        : `Follow ${username} (${followersCount})`}
                </button>
            </header>

            <main className={`${shared.main} ${styles.main}`}>
                <FeedList
                    currentFeed={currentFeed}
                    setCurrentFeed={setCurrentFeed}
                    feedNames={[(username + "'s Articles"), username + "'s Favorite Articles"]}
                />

                {loading ? (
                    <p>Loading articles...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : articles && articles.length > 0 ? (
                    <>
                        {articles.map((articleItem, index) => (
                            <ArticleItem
                                key={articleItem.id}
                                articleItem={articleItem}
                                articleIndex={index}
                                articleArrayLength={articles.length}
                            />
                        ))}
                        {pageButtons(totalPage, currentPage, setCurrentPage)}
                    </>
                ) : (
                    <p>No articles found...</p>
                )}
            </main>
        </div>
    );
}

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';

import { useFavoriteArticlesContext } from '../context/ArticleInfoProvider';
import { useUserContext, useAuthContext } from '../context/UserInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import type { PreviewArticle } from '../context/articleTypes';


import styles from '../css/homepage.module.scss';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

async function handleFavorites(
    id: number,
    setRefreshFavorites: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    navigate: NavigateFunction,
    isLogin: boolean
) {
    if(!isLogin) {
        navigate('/login');
        return;
    }
    try {
        await axios.post(
            `${BASE_URL}/updates/favorites.php`,
            { article_id: id },
            { withCredentials: true }
        );

        if (setRefreshFavorites) setRefreshFavorites(prev => !prev);

    } catch (err) {
        console.error('Failed to update favorites...');
    }
}

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

function handleViewArticle(
    username: string,
    slug: string,
    navigate: NavigateFunction
){
    navigate('/article/' + encodeURIComponent(username) + '/' + encodeURIComponent(slug))
}

export default function ArticleCard({
    articleItem,
    articleIndex,
    articleArrayLength
}: {
    articleItem: PreviewArticle;
    articleIndex: number;
    articleArrayLength: number;
}) {

    const { setRefreshAll } = useFavoriteArticlesContext();

    const date = new Date(articleItem.postDate);
    const monthAbbr = months[date.getMonth()].slice(0, 3);
    const formattedDate = `${monthAbbr} ${date.getDate()}, ${date.getFullYear()}`;

    const { username: currentUserUsername } = useUserContext();
    const { isLogin } = useAuthContext();
    const navigate = useNavigate();

    return (
        <section className={styles.articlePost}>
            <div className={styles.articlepostInfo}>
                <div className={styles.articlepostInfoContainer}>
                    <div className={styles.imgFrame}>
                        <img
                            src={articleItem.userProfileImageUrl}
                            alt={`${articleItem.username}'s profile`}
                            onClick={() => handleViewPublicProfile(articleItem.username, currentUserUsername, navigate)}
                        />
                    </div>
                    <div className={styles.articlepostNameDate}>
                        <span
                            className={styles.articlepostUsername}
                            onClick={() => handleViewPublicProfile(articleItem.username, currentUserUsername, navigate)}
                        >
                            {articleItem.username}
                        </span>
                        <span className={styles.articlepostDate}>{formattedDate}</span>
                    </div>
                </div>
                <button
                    className={styles.favorites}
                    onClick={() =>
                        handleFavorites(
                            articleItem.id,
                            setRefreshAll,
                            navigate,
                            isLogin
                        )
                    }
                >
                    {articleItem.favorites}
                </button>
            </div>
            <div 
                className={styles.articleContent}
                onClick={()=> handleViewArticle(articleItem.username, articleItem.slug, navigate)}
            >
                <h2>{articleItem.title}</h2>
                <p>{articleItem.about}</p>
                <span>Read more...</span>
            </div>
            {articleIndex !== articleArrayLength - 1 && <hr />}
        </section>
    );
}

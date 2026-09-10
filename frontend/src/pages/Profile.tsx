import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';

import { useUserContext } from '../context/UserInfoProvider';

import CurrentUserArticleElements from '../components/CurrentUserArticleElements';
import FavoriteArticleElements from '../components/FavoriteArticleElements';

import FeedList from '../utilities/FeedList';

import styles from '../css/profile.module.scss';
import shared from '../css/homepage.module.scss';


export default function Profile() {
    
    
    const { userProfileUrl, username, bio } = useUserContext();
    const [currentFeed, setCurrentFeed] = useState<0 | 1  | 2>(0);

    

    return (
        <div className={styles.pageLayout}>
            <header className={styles.header}>
                <div className={`${shared.imgFrame} ${styles.imgFrame}` }>
                    <img src={userProfileUrl} alt='user profile pictures'/>
                </div>
                <span className={styles.username}>{username}</span>
                <span className={styles.bio}>{bio ?? ''}</span>

                <NavLink to='/settings' className={styles.edit}>
                    <IoSettingsOutline className={styles.gear} />
                    <span>Edit Profile Settings</span>
                </NavLink>
            </header>
            <main className={`${shared.main} ${styles.main}`}>
                <FeedList
                    currentFeed={currentFeed}
                    setCurrentFeed={setCurrentFeed}
                    feedNames={["Your Articles", "Your Favorite Articles"]}
                />
                {!currentFeed ? <CurrentUserArticleElements /> : <FavoriteArticleElements />}
                
            </main>
        </div>
    )
}
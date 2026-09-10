import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/UserInfoProvider.tsx';
import { useTagArticleContext } from '../context/ArticleInfoProvider.tsx';

import Header from '../components/Header.tsx';
import FeedArticleElements from '../components/FeedArticleElements.tsx';
import GlobalArticleElements from '../components/GlobalArticleElements.tsx';
import TagArticleElements from '../components/TagArticleElements.tsx';

import FeedList from '../utilities/FeedList.tsx';

import type { Tag } from '../context/articleTypes.ts';

import styles from '../css/homepage.module.scss';

export default function Main() {
    const { isLogin } = useAuthContext();
    const { popularTags, popularTagsError, setCurrentTag } = useTagArticleContext();

    const [currentFeed, setCurrentFeed] = useState<0 | 1 | 2>(1); // 0 = Your, 1 = Global, 2 = Tag
    const [showTagFeed, setShowTagFeed] = useState(false);
    const [currentTag, updateCurrentTag] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleTagClick = (tagId: number, tagName: string) => {
        if(!isLogin) {
            navigate('/login');
            return;
        }
        updateCurrentTag(tagName);
        setCurrentTag(tagId);
        setShowTagFeed(true);
        setCurrentFeed(2);  
    };

    return (
        <>
            <Header />
            <div className={styles.pageLayout}>
                <main className={styles.main}>
                    {isLogin ? (
                        <>
                            <FeedList
                                currentFeed={currentFeed}
                                setCurrentFeed={(feedValue) => {
                                    setCurrentFeed(feedValue);
                                    if (feedValue !== 2) {
                                        setShowTagFeed(false);
                                    }
                                }}
                                feedNames={
                                    showTagFeed && currentTag
                                        ? ['Your Feed', 'Global Feed', `#${currentTag}`]
                                        : ['Your Feed', 'Global Feed']
                                }
                            />

                            {currentFeed === 0 ? (
                                <FeedArticleElements />
                            ) : currentFeed === 1 ? (
                                <GlobalArticleElements />
                            ) : (
                                <TagArticleElements />
                            )}
                        </>
                    ) : (
                        <>
                            <div className={styles.feed}>
                                <ul className={styles.feedList}>
                                    <li className={styles.feedActive}>Global Feed</li>
                                </ul>
                                <hr />
                            </div>
                            <GlobalArticleElements />
                        </>
                    )}
                </main>

                <aside className={styles.aside}>
                    <span className={styles.popularTagsTitle}>Popular Tags</span>
                    <ul className={styles.popularTagsList}>
                        {popularTagsError ? (
                            <li className={styles.tagError}>{popularTagsError}</li>
                        ) : popularTags && popularTags.length > 0 ? (
                            popularTags.map((tag: Tag, index: number) => (
                                <li key={index}>
                                    <button onClick={() => handleTagClick(tag.id, tag.name)}>{tag.name}</button>
                                </li>
                            ))
                        ) : (
                            <li className={styles.tagError}>No tags found.</li>
                        )}
                    </ul>
                </aside>
            </div>
        </>
    );
}

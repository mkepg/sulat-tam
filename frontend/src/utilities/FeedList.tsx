import styles from '../css/homepage.module.scss';
import React from 'react';

type FeedValue = 0 | 1 | 2;

type FeedListProps = {
    currentFeed: FeedValue;
    setCurrentFeed: React.Dispatch<React.SetStateAction<FeedValue>>;
    feedNames: string[];
};

function handleChangeFeed(
    event: React.MouseEvent<HTMLLIElement>,
    currentFeed: FeedValue,
    setCurrentFeed: React.Dispatch<React.SetStateAction<FeedValue>>
) {
    const value = Number(event.currentTarget.dataset.value) as FeedValue;
    if (value === currentFeed) return;
    setCurrentFeed(value);
}

export default function FeedList({
    currentFeed,
    setCurrentFeed,
    feedNames
}: FeedListProps) {

    return (
        <div className={styles.feed}>
            <ul className={styles.feedList}>
                {feedNames.map((feedName, i) => {
                    const isActive = i === currentFeed;
                    return (
                        <li
                            key={i}
                            className={isActive ? styles.feedActive : ''}
                            data-value={i}
                            onClick={(e) => handleChangeFeed(e, currentFeed, setCurrentFeed)}
                        >
                            {feedName}
                        </li>
                    );
                })}
            </ul>
            <hr />
        </div>
    );
}

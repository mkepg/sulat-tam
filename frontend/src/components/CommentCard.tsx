import { FaTrashAlt } from 'react-icons/fa';

import styles from '../css/comment-item.module.scss';

type Comment = {
    id: number;
    body: string;
    date: string;
    username: string;
    userProfileImageUrl: string;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

type Props = {
    comment: Comment;
};

export default function CommentCard({ comment }: Props) {
    const date = new Date(comment.date);
    const monthAbbr = months[date.getMonth()].slice(0, 3);
    const formattedDate = `${monthAbbr} ${date.getDate()}, ${date.getFullYear()}`;

    return (
        <div className={styles.commentItem}>
            <p className={styles.commentText}>{comment.body}</p>
            <div className={styles.commentMetaLayout}>
                <div className={styles.commentMeta}>
                    <img
                        className={styles.imgComment}
                        src={comment.userProfileImageUrl}
                        alt='profile'
                    />
                    <span className={styles.commentUsername}>{comment.username}</span>
                    <span className={styles.commentDate}>{formattedDate}</span>
                    <FaTrashAlt className={styles.deleteIcon} />
                </div>
            </div>
        </div>
    );
}

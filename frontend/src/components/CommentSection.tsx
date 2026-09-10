import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useUserContext } from '../context/UserInfoProvider';
import BASE_URL from '../utilities/dynamicDomain';

import CommentCard from './CommentCard';

import commentStyles from '../css/comments-section.module.scss';

export type Comment = {
    id: number;
    body: string;
    date: string;
    username: string;
    userProfileImageUrl: string;
};

type CommentsSectionProps = {
    comments: Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    articleId: number | null;
};

export default function CommentSection({ comments, setComments, articleId }: CommentsSectionProps) {
    const { username, userProfileUrl } = useUserContext();
    const navigate = useNavigate();

    async function postComment() {
        if (!articleId) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/posts/comment.php`,
                {
                    article_id: articleId,
                    body: commentBody
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setComments(response.data.comments);
            setCommentBody('');
        } catch {
            console.error('Failed to post comment...');
        }
    }

    const [commentBody, setCommentBody] = useState('');

    return (
        <div className={commentStyles.commentsContainer}>
            <div className={commentStyles.commentBox}>
                <textarea
                    className={commentStyles.textarea}
                    placeholder="Write a comment..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                />
                <div className={commentStyles.commentActions}>
                    <img
                        className={commentStyles.imgCommentSection}
                        src={userProfileUrl}
                        alt={`${username}'s photo`}
                        onClick={() => navigate('/my-profile')}
                    />
                    <button
                        className={commentStyles.postButton}
                        onClick={postComment}
                        disabled={!commentBody.trim()}
                    >
                        Post Comment
                    </button>
                </div>
            </div>

            {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
            ))}
        </div>
    );
}

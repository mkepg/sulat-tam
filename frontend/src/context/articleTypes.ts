export type PreviewArticle = {
    id: number;
    username: string;
    userProfileImageUrl: string;
    postDate: string | Date;
    title: string;
    about: string;
    favorites: number;
    slug: string;
};

export type Tag = {
    id: number;
    name: string;
    count: number;
};

export type GlobalArticlesContextType = {
    globalArticles: PreviewArticle[] | null;
    setGlobalArticles: React.Dispatch<React.SetStateAction<PreviewArticle[] | null>>;
    globalArticlesLoading: boolean;
    setGlobalArticlesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    globalArticlesError: string | null;
    setGlobalArticlesError: React.Dispatch<React.SetStateAction<string | null>>;
    refreshGlobalArticles: boolean;
    setRefreshGlobalArticles: React.Dispatch<React.SetStateAction<boolean>>;
    globalArticlesCount: number;
    setGlobalArticlesCount: React.Dispatch<React.SetStateAction<number>>;
    globalCurrentPage: number;
    setGlobalCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    globalLimit: number;
};

export type CurrentUserArticlesContextType = {
    currentUserArticles: PreviewArticle[] | null;
    setCurrentUserArticles: React.Dispatch<React.SetStateAction<PreviewArticle[] | null>>;
    currentUserArticlesLoading: boolean;
    setCurrentUserArticlesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentUserArticlesError: string | null;
    setCurrentUserArticlesError: React.Dispatch<React.SetStateAction<string | null>>;
    setRefreshCurrentUserArticles: React.Dispatch<React.SetStateAction<boolean>>;
    currentUserCurrentPage: number;
    setCurrentUserCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    currentUserArticlesCount: number;
    setCurrentUserArticlesCount: React.Dispatch<React.SetStateAction<number>>;
    currentUserLimit: number;
};

export type FavoriteArticlesContextType = {
    favoriteArticles: PreviewArticle[] | null;
    setFavoriteArticles: React.Dispatch<React.SetStateAction<PreviewArticle[] | null>>;
    favoriteArticlesLoading: boolean;
    setFavoriteArticlesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    favoriteArticlesError: string | null;
    setFavoriteArticlesError: React.Dispatch<React.SetStateAction<string | null>>;
    refreshAll: boolean;
    setRefreshAll: React.Dispatch<React.SetStateAction<boolean>>;
    favoriteArticlesCurrentPage: number;
    setFavoriteArticlesCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    favoriteArticlesCount: number;
    setFavoriteArticlesCount: React.Dispatch<React.SetStateAction<number>>;
    favoriteLimit: number;
};

export type FeedArticlesContextType = {
    feedArticles: PreviewArticle[] | null;
    setFeedArticles: React.Dispatch<React.SetStateAction<PreviewArticle[] | null>>;
    feedArticlesLoading: boolean;
    setFeedArticlesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    feedArticlesError: string | null;
    setFeedArticlesError: React.Dispatch<React.SetStateAction<string | null>>;
    setRefreshFeedArticles: React.Dispatch<React.SetStateAction<boolean>>;
    feedArticlesCount: number;
    setFeedArticlesCount: React.Dispatch<React.SetStateAction<number>>;
    feedCurrentPage: number;
    setFeedCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    feedLimit: number;
};

export interface TagArticlesContextType {
    popularTags: Tag[] | null;
    setPopularTags: React.Dispatch<React.SetStateAction<Tag[] | null>>;
    popularTagsError: string | null;
    setPopularTagsError: React.Dispatch<React.SetStateAction<string | null>>;
    tagArticles: PreviewArticle[] | null;
    setTagArticles: React.Dispatch<React.SetStateAction<PreviewArticle[] | null>>;
    tagArticlesLoading: boolean;
    setTagArticlesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    tagArticlesError: string | null;
    setTagArticlesError: React.Dispatch<React.SetStateAction<string | null>>;
    refreshTagArticles: boolean;
    setRefreshTagArticles: React.Dispatch<React.SetStateAction<boolean>>;
    currentTag: number | null;
    setCurrentTag: React.Dispatch<React.SetStateAction<number | null>>;
    tagArticlesCount: number;
    setTagArticlesCount: React.Dispatch<React.SetStateAction<number>>;
    tagCurrentPage: number;
    setTagCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    tagLimit: number;
}

import { useContext } from 'react';

import { GlobalArticlesProvider, GlobalArticlesContext } from './GlobalArticlesContext';
import { CurrentUserArticlesProvider, CurrentUserArticlesContext } from './CurrentUserArticlesContext';
import { FavoriteArticlesProvider, FavoriteArticlesContext } from './FavoriteArticlesContext';
import { FeedArticlesProvider, FeedArticlesContext } from './FeedArticlesContext';
import { TagArticlesProvider, TagArticlesContext } from './TagArticlesContext';

export function ArticleInfoProvider({ children }: { children: React.ReactNode }) {
    return (
        <FavoriteArticlesProvider>
            <GlobalArticlesProvider>
                <FeedArticlesProvider>
                    <CurrentUserArticlesProvider>
                        <TagArticlesProvider>
                            {children}
                        </TagArticlesProvider>
                    </CurrentUserArticlesProvider>
                </FeedArticlesProvider>
            </GlobalArticlesProvider>
        </FavoriteArticlesProvider>
    );
}

export function useGlobalArticleContext() {
    const context = useContext(GlobalArticlesContext);
    if (!context) {
        throw new Error('useGlobalArticleContext must be used within a GlobalArticleProvider');
    }
    return context;
}

export function useCurrentUserArticleContext() {
    const context = useContext(CurrentUserArticlesContext);
    if (!context) {
        throw new Error('useCurrentUserArticleContext must be used within a CurrentUserArticleProvider');
    }
    return context;
}

export function useFavoriteArticlesContext() {
    const context = useContext(FavoriteArticlesContext);
    if (!context) {
        throw new Error('useFavoriteArticleContext must be used within a FavoriteArticleProvider');
    }
    return context;
}

export function useFeedArticleContext() {
    const context = useContext(FeedArticlesContext);
    if (!context) {
        throw new Error('useFeedArticleContext must be used within a FeedArticlesProvider');
    }
    return context;
}

export function useTagArticleContext() {
    const context = useContext(TagArticlesContext);
    if (!context) {
        throw new Error('useTagArticleContext must be used within a TagArticlesProvider');
    }
    return context;
}

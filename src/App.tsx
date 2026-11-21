/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { WritePostView } from './components/WritePostView';
import { BoardView } from './components/BoardView';
import { AdminSettingsView } from './components/AdminSettingsView';
import {
  AdminLoginModal,
  AlertModal,
  DeleteConfirmModal,
} from './components/Modals';
import { Post, PostType, Screen } from './types';
import { getLocalIsoNow } from './utils/formatters';
import { DEFAULT_CATEGORIES, DEFAULT_HANDOVER_LOCATION } from './utils/storage';
import {
  createPost,
  deletePost,
  ensureInitialSettings,
  saveCategories,
  saveHandoverLocation,
  seedInitialPostsIfEmpty,
  subscribeToPosts,
  subscribeToSettings,
} from './services/firestoreService';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
  const [handoverLocation, setHandoverLocation] = useState<string>(
    DEFAULT_HANDOVER_LOCATION
  );
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  const [boardTab, setBoardTab] = useState<PostType>('lost');
  const [selectedBoardCategory, setSelectedBoardCategory] = useState<string>('전체');

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([seedInitialPostsIfEmpty(), ensureInitialSettings()]).catch(() => {
      if (isMounted) {
        setAlertMessage(
          '데이터베이스 연결 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    });

    const unsubscribePosts = subscribeToPosts(
      (nextPosts) => {
        if (!isMounted) return;
        setPosts(nextPosts);
        setIsPostsLoading(false);
      },
      () => {
        if (!isMounted) return;
        setIsPostsLoading(false);
        setAlertMessage('게시글 목록을 불러오는 데 실패했습니다.');
      }
    );

    const unsubscribeSettings = subscribeToSettings(
      (settings) => {
        if (!isMounted) return;
        setHandoverLocation(settings.handoverLocation);
        setCategories(settings.categories);
      },
      () => {
        if (!isMounted) return;
        setAlertMessage('설정 정보를 불러오는 데 실패했습니다.');
      }
    );

    return () => {
      isMounted = false;
      unsubscribePosts();
      unsubscribeSettings();
    };
  }, []);

  useEffect(() => {
    if (
      selectedBoardCategory !== '전체' &&
      !categories.includes(selectedBoardCategory)
    ) {
      setSelectedBoardCategory('전체');
    }
  }, [categories, selectedBoardCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (alertMessage) {
        setAlertMessage(null);
      } else if (postToDelete) {
        setPostToDelete(null);
      } else if (isAdminModalOpen) {
        setIsAdminModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alertMessage, postToDelete, isAdminModalOpen]);

  const handleGoHome = () => {
    setScreen('home');
  };

  const handleExitAdmin = () => {
    setIsAdmin(false);
    if (screen === 'admin-settings') {
      setScreen('home');
    }
  };

  const handleSubmitPost = async (data: {
    type: PostType;
    category: string;
    title: string;
    location: string;
  }) => {
    await createPost({
      type: data.type,
      category: data.category,
      title: data.title,
      location: data.location,
      handoverLocation,
      createdAt: getLocalIsoNow(),
    });

    setBoardTab(data.type);
    setSelectedBoardCategory('전체');
    setScreen('board');
  };

  const handleConfirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete.id);
      setPostToDelete(null);
    } catch {
      setPostToDelete(null);
      setAlertMessage('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSaveHandoverLocation = async (nextLocation: string) => {
    await saveHandoverLocation(nextLocation);
  };

  const handleAddCategory = async (newCat: string) => {
    const nextCategories = [...categories, newCat];
    await saveCategories(nextCategories);
  };

  const handleDeleteCategory = async (targetCat: string) => {
    if (categories.length <= 1) return;
    const nextCategories = categories.filter((c) => c !== targetCat);
    await saveCategories(nextCategories);
  };

  const lostCount = posts.filter((p) => p.type === 'lost').length;
  const foundCount = posts.filter((p) => p.type === 'found').length;

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Header
        isAdmin={isAdmin}
        onGoHome={handleGoHome}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        onExitAdmin={handleExitAdmin}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {screen === 'home' && (
          <HomeView
            handoverLocation={handoverLocation}
            isAdmin={isAdmin}
            lostCount={lostCount}
            foundCount={foundCount}
            onNavigateWrite={() => setScreen('write')}
            onNavigateBoard={() => {
              setSelectedBoardCategory('전체');
              setScreen('board');
            }}
            onNavigateAdminSettings={() => setScreen('admin-settings')}
          />
        )}

        {screen === 'write' && (
          <WritePostView
            categories={categories}
            handoverLocation={handoverLocation}
            onBack={handleGoHome}
            onSubmitPost={handleSubmitPost}
            onRequireHandoverAlert={() =>
              setAlertMessage(
                `${handoverLocation}에 물품을 먼저 인계한 후 체크해주세요.`
              )
            }
          />
        )}

        {screen === 'board' && (
          <BoardView
            posts={posts}
            categories={categories}
            activeTab={boardTab}
            selectedCategory={selectedBoardCategory}
            isAdmin={isAdmin}
            isLoading={isPostsLoading}
            onBack={handleGoHome}
            onChangeTab={(tab) => {
              setBoardTab(tab);
            }}
            onChangeCategory={setSelectedBoardCategory}
            onGoWrite={() => setScreen('write')}
            onRequestDeletePost={(post) => setPostToDelete(post)}
          />
        )}

        {screen === 'admin-settings' && isAdmin && (
          <AdminSettingsView
            handoverLocation={handoverLocation}
            categories={categories}
            onBack={handleGoHome}
            onSaveHandoverLocation={handleSaveHandoverLocation}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onGoBoard={() => {
              setSelectedBoardCategory('전체');
              setScreen('board');
            }}
          />
        )}
      </main>

      {isAdminModalOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminModalOpen(false)}
          onSuccess={() => {
            setIsAdmin(true);
            setIsAdminModalOpen(false);
          }}
        />
      )}

      {postToDelete && (
        <DeleteConfirmModal
          post={postToDelete}
          onCancel={() => setPostToDelete(null)}
          onConfirm={handleConfirmDeletePost}
        />
      )}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
}

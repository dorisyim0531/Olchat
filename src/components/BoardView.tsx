import { ArrowLeft, PenLine, Trash2 } from 'lucide-react';
import { Post, PostType } from '../types';
import { formatPostDate } from '../utils/formatters';

interface BoardViewProps {
  posts: Post[];
  categories: string[];
  activeTab: PostType;
  selectedCategory: string;
  isAdmin: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onChangeTab: (tab: PostType) => void;
  onChangeCategory: (category: string) => void;
  onGoWrite: () => void;
  onRequestDeletePost: (post: Post) => void;
}

export function BoardView({
  posts,
  categories,
  activeTab,
  selectedCategory,
  isAdmin,
  isLoading = false,
  onBack,
  onChangeTab,
  onChangeCategory,
  onGoWrite,
  onRequestDeletePost,
}: BoardViewProps) {
  const filteredPosts = posts
    .filter((post) => post.type === activeTab)
    .filter((post) =>
      selectedCategory === '전체' ? true : post.category === selectedCategory
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filterOptions = ['전체', ...categories];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-2 -ml-2 rounded-xl text-sm font-semibold text-[#4A554E] hover:text-[#222222] hover:bg-[#F4F7F4] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
          <span>첫 화면으로</span>
        </button>
        <h1 className="text-lg font-extrabold text-[#222222]">게시글 확인</h1>
        <button
          type="button"
          onClick={onGoWrite}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] text-[#1B4332] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0"
        >
          <PenLine className="w-4 h-4" aria-hidden="true" />
          <span>글쓰기</span>
        </button>
      </div>

      {/* 상단 게시판 전환 탭 */}
      <div
        role="tablist"
        aria-label="게시판 전환"
        className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#F3F6F3] border border-[#E5ECE6]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'lost'}
          onClick={() => onChangeTab('lost')}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'lost'
              ? 'bg-[#8CD790] text-[#1B4332] shadow-xs'
              : 'text-[#5C6660] hover:text-[#222222]'
          }`}
        >
          분실물 게시판
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={postTabCheck(activeTab)}
          onClick={() => onChangeTab('found')}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === 'found'
              ? 'bg-[#8CD790] text-[#1B4332] shadow-xs'
              : 'text-[#5C6660] hover:text-[#222222]'
          }`}
        >
          습득물 게시판
        </button>
      </div>

      {/* 카테고리 필터 칩 */}
      <div
        aria-label="카테고리 필터"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {filterOptions.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChangeCategory(cat)}
              aria-pressed={isActive}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-[#8CD790] text-[#1B4332] border-[#75C479] font-bold'
                  : 'bg-white text-[#4A554E] border-[#DCE5DD] hover:bg-[#F5FAF5] font-medium'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 게시글 목록 */}
      {isLoading ? (
        <div className="rounded-2xl border border-[#E5ECE6] bg-[#FAFDFB] p-8 text-center">
          <p className="text-sm sm:text-base font-semibold text-[#5C6660]">
            게시글을 불러오는 중입니다...
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-[#E5ECE6] bg-[#FAFDFB] p-8 text-center flex flex-col items-center gap-3">
          <p className="text-sm sm:text-base font-semibold text-[#5C6660]">
            해당 조건에 등록된 게시글이 없습니다.
          </p>
          {selectedCategory !== '전체' && (
            <button
              type="button"
              onClick={() => onChangeCategory('전체')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-[#D4DFD5] text-xs sm:text-sm font-semibold text-[#222222] hover:bg-[#F4FAF4]"
            >
              전체 카테고리 보기
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between gap-3 rounded-2xl bg-white border border-[#E5ECE6] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <time
                    dateTime={post.createdAt}
                    className="text-xs text-[#5C6660] tabular-nums"
                  >
                    {formatPostDate(post.createdAt)}
                  </time>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onRequestDeletePost(post)}
                      className="inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>삭제</span>
                    </button>
                  )}
                </div>

                <h2 className="text-[16px] sm:text-[17px] font-bold text-[#222222] leading-snug break-keep">
                  {post.title}
                </h2>
              </div>

              <p className="text-xs sm:text-[13px] text-[#5C6660] leading-relaxed break-keep pt-1 border-t border-[#F1F5F2]">
                <span>{post.category}</span>
                <span aria-hidden="true"> · </span>
                <span>
                  {post.type === 'lost' ? '마지막 확인 장소' : '습득 장소'}: {post.location}
                </span>
                <span aria-hidden="true"> · </span>
                <span className="font-semibold text-[#1B4332]">
                  {post.handoverLocation}{' '}
                  {post.type === 'lost' ? '인계 부탁' : '인계 완료'}
                </span>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function postTabCheck(activeTab: PostType): boolean {
  return activeTab === 'found';
}

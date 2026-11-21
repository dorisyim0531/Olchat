import { FormEvent, useState } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { PostType } from '../types';
import { buildPostTitle } from '../utils/formatters';

interface WritePostViewProps {
  categories: string[];
  handoverLocation: string;
  onBack: () => void;
  onSubmitPost: (data: {
    type: PostType;
    category: string;
    title: string;
    location: string;
  }) => Promise<void>;
  onRequireHandoverAlert: () => void;
}

export function WritePostView({
  categories,
  handoverLocation,
  onBack,
  onSubmitPost,
  onRequireHandoverAlert,
}: WritePostViewProps) {
  const [postType, setPostType] = useState<PostType>('lost');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [handoverChecked, setHandoverChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const previewTitle = buildPostTitle(itemName, postType);

  const handleTabChange = (nextType: PostType) => {
    setPostType(nextType);
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');

    if (!selectedCategory) {
      setErrorMessage('물품 카테고리를 선택해주세요.');
      return;
    }

    if (!itemName.trim()) {
      setErrorMessage('물품명을 입력해주세요.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage(
        postType === 'lost'
          ? '마지막 확인 장소를 입력해주세요.'
          : '습득 장소를 입력해주세요.'
      );
      return;
    }

    if (postType === 'found' && !handoverChecked) {
      onRequireHandoverAlert();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitPost({
        type: postType,
        category: selectedCategory,
        title: previewTitle,
        location: location.trim(),
      });
    } catch {
      setErrorMessage('게시글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-2 -ml-2 rounded-xl text-sm font-semibold text-[#4A554E] hover:text-[#222222] hover:bg-[#F4F7F4] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
          <span>첫 화면으로</span>
        </button>
        <h1 className="text-lg font-extrabold text-[#222222]">게시글 작성</h1>
      </div>

      <div
        role="tablist"
        aria-label="글쓰기 유형 선택"
        className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#F3F6F3] border border-[#E5ECE6]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={postType === 'lost'}
          onClick={() => handleTabChange('lost')}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
            postType === 'lost'
              ? 'bg-[#8CD790] text-[#1B4332] shadow-xs'
              : 'text-[#5C6660] hover:text-[#222222]'
          }`}
        >
          분실물을 찾는 글쓰기
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={postType === 'found'}
          onClick={() => handleTabChange('found')}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
            postType === 'found'
              ? 'bg-[#8CD790] text-[#1B4332] shadow-xs'
              : 'text-[#5C6660] hover:text-[#222222]'
          }`}
        >
          습득물을 발견한 글쓰기
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-2xl bg-white border border-[#E5ECE6] p-4 sm:p-6"
      >
        {/* 1. 카테고리 선택 */}
        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-bold text-[#222222]">
            물품 카테고리 <span className="text-[#1B4332] font-semibold">(필수)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setErrorMessage('');
                  }}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-[#8CD790] text-[#1B4332] border-[#75C479] font-bold'
                      : 'bg-white text-[#333333] border-[#DCE5DD] hover:bg-[#F5FAF5] font-medium'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 게시글 제목 (빈칸 채우기 형태) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="item-name-input" className="text-sm font-bold text-[#222222]">
            게시글 제목 <span className="text-[#5C6660] font-normal">(물품명 입력)</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              id="item-name-input"
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setErrorMessage('');
              }}
              placeholder={
                postType === 'lost'
                  ? '예: 검은색에 흰색 땡땡이 무늬 후리스'
                  : '예: 아이폰 16(투명 젤리 케이스)'
              }
              className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D4DFD5] bg-white text-[15px] text-[#222222] placeholder:text-[#9AA59E] focus:border-[#1B4332] focus:outline-none"
            />
            <span className="text-sm sm:text-[15px] font-bold text-[#1B4332] whitespace-nowrap shrink-0 px-1">
              {postType === 'lost' ? '을(를) 찾습니다.' : '을(를) 습득했습니다.'}
            </span>
          </div>
          {previewTitle && (
            <p className="text-xs text-[#4A5A4F] bg-[#F4FAF4] border border-[#DCECDC] rounded-xl px-3 py-2">
              등록될 제목: <strong className="font-bold text-[#1B4332]">{previewTitle}</strong>
            </p>
          )}
        </div>

        {/* 3. 장소 입력 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="location-input" className="text-sm font-bold text-[#222222]">
            {postType === 'lost' ? '마지막 확인 장소' : '습득 장소'}
          </label>
          <input
            id="location-input"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrorMessage('');
            }}
            placeholder={
              postType === 'lost' ? '예: 3층 컴퓨터실' : '예: 운동장 벤치'
            }
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D4DFD5] bg-white text-[15px] text-[#222222] placeholder:text-[#9AA59E] focus:border-[#1B4332] focus:outline-none"
          />
        </div>

        {/* 4. 하단 고정 안내 또는 필수 체크박스 */}
        {postType === 'lost' ? (
          <div className="rounded-xl bg-[#F4FAF4] border border-[#D5EAD6] px-4 py-3.5 text-sm font-semibold text-[#1B4332]">
            {handoverLocation}에 인계 부탁드립니다.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label
              className={`flex items-center gap-3 min-h-[52px] px-4 py-3 rounded-xl border cursor-pointer select-none transition-colors ${
                handoverChecked
                  ? 'bg-[#EDF9EE] border-[#8CD790]'
                  : 'bg-[#F9FBF9] border-[#D4DFD5] hover:bg-[#F3FAF3]'
              }`}
            >
              <input
                type="checkbox"
                checked={handoverChecked}
                onChange={(e) => {
                  setHandoverChecked(e.target.checked);
                  setErrorMessage('');
                }}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                  handoverChecked
                    ? 'bg-[#8CD790] border-[#1B4332] text-[#1B4332]'
                    : 'bg-white border-[#9BB09F] text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <span className="text-sm sm:text-[15px] font-bold text-[#222222]">
                {handoverLocation}에 인계 완료했습니다.
              </span>
            </label>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[50px] px-5 py-3 rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] disabled:opacity-60 text-[#1B4332] font-extrabold text-base transition-all duration-150 active:scale-[0.99]"
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  );
}

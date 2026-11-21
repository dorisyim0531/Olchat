import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Plus, Trash2, AlertCircle, ClipboardList } from 'lucide-react';

interface AdminSettingsViewProps {
  handoverLocation: string;
  categories: string[];
  onBack: () => void;
  onSaveHandoverLocation: (location: string) => Promise<void>;
  onAddCategory: (category: string) => Promise<void>;
  onDeleteCategory: (category: string) => Promise<void>;
  onGoBoard: () => void;
}

export function AdminSettingsView({
  handoverLocation,
  categories,
  onBack,
  onSaveHandoverLocation,
  onAddCategory,
  onDeleteCategory,
  onGoBoard,
}: AdminSettingsViewProps) {
  const [locationInput, setLocationInput] = useState(handoverLocation);
  const [locationSavedMsg, setLocationSavedMsg] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccessMsg, setCategorySuccessMsg] = useState('');
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  useEffect(() => {
    setLocationInput(handoverLocation);
  }, [handoverLocation]);

  const handleSaveLocation = async (e: FormEvent) => {
    e.preventDefault();
    if (isSavingLocation) return;
    setLocationSavedMsg('');
    setLocationError('');

    const trimmed = locationInput.trim();
    if (!trimmed) {
      setLocationError('인계 장소를 입력해주세요.');
      return;
    }

    setIsSavingLocation(true);
    try {
      await onSaveHandoverLocation(trimmed);
      setLocationInput(trimmed);
      setLocationSavedMsg(`"${trimmed}"(으)로 인계 장소가 변경되었습니다.`);
    } catch {
      setLocationError('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSavingLocation(false);
    }
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (isUpdatingCategory) return;
    setCategoryError('');
    setCategorySuccessMsg('');

    const trimmed = newCategory.trim();
    if (!trimmed) {
      setCategoryError('추가할 카테고리 이름을 입력해주세요.');
      return;
    }

    if (categories.includes(trimmed)) {
      setCategoryError('이미 등록된 카테고리입니다.');
      return;
    }

    setIsUpdatingCategory(true);
    try {
      await onAddCategory(trimmed);
      setNewCategory('');
      setCategorySuccessMsg(`"${trimmed}" 카테고리가 추가되었습니다.`);
    } catch {
      setCategoryError('카테고리 추가 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleDeleteCat = async (cat: string) => {
    if (isUpdatingCategory) return;
    setCategoryError('');
    setCategorySuccessMsg('');

    if (categories.length <= 1) {
      setCategoryError('최소 1개 이상의 카테고리는 유지되어야 합니다.');
      return;
    }

    setIsUpdatingCategory(true);
    try {
      await onDeleteCategory(cat);
    } catch {
      setCategoryError('카테고리 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingCategory(false);
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
        <h1 className="text-lg font-extrabold text-[#222222]">관리자 설정</h1>
      </div>

      {/* 1. 인계 장소 변경 */}
      <section className="rounded-2xl bg-white border border-[#E5ECE6] p-4 sm:p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#222222]">인계 장소 변경</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C6660] leading-relaxed">
            습득물을 맡기는 학교 내 기본 인계 장소(예: 교목실, 학생회실, 행정실, 교무실)를 설정합니다.
            저장 즉시 글쓰기 화면과 홈 안내 문구에 반영됩니다.
          </p>
        </div>

        <form onSubmit={handleSaveLocation} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
              setLocationSavedMsg('');
              setLocationError('');
            }}
            aria-label="인계 장소 입력"
            placeholder="예: 학생회실"
            className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D4DFD5] bg-white text-[15px] text-[#222222] focus:border-[#1B4332] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSavingLocation}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] disabled:opacity-60 text-[#1B4332] font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
          >
            {isSavingLocation ? '저장 중...' : '저장'}
          </button>
        </form>

        {locationError && (
          <p role="alert" className="flex items-center gap-1.5 text-xs sm:text-sm text-red-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{locationError}</span>
          </p>
        )}

        {locationSavedMsg && (
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1B4332] bg-[#EDF9EE] border border-[#CBE9CD] rounded-xl px-3.5 py-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{locationSavedMsg}</span>
          </p>
        )}
      </section>

      {/* 2. 물품 카테고리 관리 */}
      <section className="rounded-2xl bg-white border border-[#E5ECE6] p-4 sm:p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#222222]">물품 카테고리 관리</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5C6660] leading-relaxed">
            글쓰기 선택지와 게시판 필터에 노출되는 카테고리를 추가하거나 삭제합니다. (최소 1개 유지)
          </p>
        </div>

        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setCategoryError('');
              setCategorySuccessMsg('');
            }}
            aria-label="새 카테고리 이름"
            placeholder="새 카테고리 입력 (예: 우산, 학용품)"
            className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D4DFD5] bg-white text-[15px] text-[#222222] placeholder:text-[#9AA59E] focus:border-[#1B4332] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isUpdatingCategory}
            className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-5 py-2.5 rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] disabled:opacity-60 text-[#1B4332] font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4.5 h-4.5" aria-hidden="true" />
            <span>추가</span>
          </button>
        </form>

        {categoryError && (
          <p role="alert" className="flex items-center gap-1.5 text-xs sm:text-sm text-red-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{categoryError}</span>
          </p>
        )}

        {categorySuccessMsg && (
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1B4332] bg-[#EDF9EE] border border-[#CBE9CD] rounded-xl px-3.5 py-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{categorySuccessMsg}</span>
          </p>
        )}

        <ul className="divide-y divide-[#EEF3EE] border border-[#E5ECE6] rounded-xl overflow-hidden">
          {categories.map((cat) => {
            const isLastOne = categories.length <= 1;
            return (
              <li
                key={cat}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white"
              >
                <span className="text-sm sm:text-[15px] font-semibold text-[#222222]">
                  {cat}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCat(cat)}
                  disabled={isLastOne || isUpdatingCategory}
                  className={`inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isLastOne || isUpdatingCategory
                      ? 'text-[#9AA59E] bg-[#F5F7F5] border border-[#E5ECE6] cursor-not-allowed'
                      : 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>삭제</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. 게시글 관리 바로가기 */}
      <button
        type="button"
        onClick={onGoBoard}
        className="flex items-center justify-center gap-2 w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#F4FAF4] hover:bg-[#E8F6E9] border border-[#CBE9CD] text-[#1B4332] font-bold text-sm sm:text-base transition-colors"
      >
        <ClipboardList className="w-5 h-5" aria-hidden="true" />
        <span>게시판에서 게시글 관리하기</span>
      </button>
    </div>
  );
}

import { PenLine, ClipboardList, Settings, ChevronRight, Info } from 'lucide-react';

interface HomeViewProps {
  handoverLocation: string;
  isAdmin: boolean;
  lostCount: number;
  foundCount: number;
  onNavigateWrite: () => void;
  onNavigateBoard: () => void;
  onNavigateAdminSettings: () => void;
}

export function HomeView({
  handoverLocation,
  isAdmin,
  lostCount,
  foundCount,
  onNavigateWrite,
  onNavigateBoard,
  onNavigateAdminSettings,
}: HomeViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <section
        aria-label="이용 안내"
        className="rounded-2xl bg-[#F2FBF3] border border-[#CBE9CD] p-4 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-[#1B4332] shrink-0" aria-hidden="true">
            <Info className="w-5 h-5" />
          </span>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#222222] break-keep">
            분실물은 습득물 게시판에서 먼저 확인하고, 습득물은{' '}
            <strong className="font-bold text-[#1B4332] underline decoration-[#8CD790] decoration-2 underline-offset-4">
              {handoverLocation}
            </strong>{' '}
            인계 후 등록해주세요
          </p>
        </div>
      </section>

      <section aria-label="주요 메뉴" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onNavigateWrite}
          className="group relative flex items-center justify-between gap-4 w-full min-h-[124px] sm:min-h-[148px] p-5 sm:p-6 rounded-2xl bg-[#8CD790] hover:bg-[#7FCF84] text-left transition-all duration-150 active:scale-[0.99] shadow-sm shadow-[#8CD790]/25"
        >
          <div className="flex flex-col gap-2">
            <span className="w-11 h-11 rounded-xl bg-white/65 flex items-center justify-center text-[#1B4332]">
              <PenLine className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl sm:text-[22px] font-extrabold text-[#1B4332] tracking-tight">
                게시글 작성
              </h2>
              <p className="mt-0.5 text-sm font-medium text-[#1B4332]/85">
                분실물 또는 습득물 등록
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-6 h-6 text-[#1B4332] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={onNavigateBoard}
          className="group relative flex items-center justify-between gap-4 w-full min-h-[124px] sm:min-h-[148px] p-5 sm:p-6 rounded-2xl bg-white hover:bg-[#F9FCF9] border border-[#DCE7DD] text-left transition-all duration-150 active:scale-[0.99]"
        >
          <div className="flex flex-col gap-2">
            <span className="w-11 h-11 rounded-xl bg-[#EDF9EE] flex items-center justify-center text-[#1B4332]">
              <ClipboardList className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl sm:text-[22px] font-extrabold text-[#222222] tracking-tight">
                게시글 확인
              </h2>
              <p className="mt-0.5 text-sm font-medium text-[#5C6660]">
                분실물 또는 습득물 게시판 열람
              </p>
              <p className="mt-1.5 text-xs text-[#5C6660] tabular-nums">
                분실물 {lostCount}건 · 습득물 {foundCount}건
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-6 h-6 text-[#5C6660] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </section>

      {isAdmin && (
        <section aria-label="관리자 메뉴" className="pt-1">
          <button
            type="button"
            onClick={onNavigateAdminSettings}
            className="flex items-center justify-between gap-3 w-full min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#F4FAF4] hover:bg-[#E8F6E9] border border-[#CBE9CD] text-[#1B4332] font-bold text-sm sm:text-base transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>관리자 설정 (인계 장소 · 카테고리 관리)</span>
            </span>
            <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </section>
      )}
    </div>
  );
}

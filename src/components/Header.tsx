import { ShieldCheck, LogOut, SearchCheck } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onGoHome: () => void;
  onOpenAdminLogin: () => void;
  onExitAdmin: () => void;
}

export function Header({
  isAdmin,
  onGoHome,
  onOpenAdminLogin,
  onExitAdmin,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5ECE6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 min-h-[44px] px-1 -ml-1 rounded-xl text-left group whitespace-nowrap shrink-0"
          aria-label="올찾 첫 화면으로 이동"
        >
          <span className="w-8 h-8 rounded-xl bg-[#8CD790] flex items-center justify-center text-[#1B4332] transition-transform duration-150 group-active:scale-95">
            <SearchCheck className="w-4.5 h-4.5 stroke-[2.4]" aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#222222]">
            올찾
          </span>
        </button>

        {!isAdmin && (
          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#3C4A40] bg-[#F5F8F5] hover:bg-[#EBF5EC] border border-[#DCE7DD] transition-colors whitespace-nowrap shrink-0"
          >
            관리자
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="bg-[#EDF9EE] border-t border-[#CBE9CD]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B4332] whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>관리자 모드 실행 중</span>
            </div>
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1 min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1B4332] bg-white hover:bg-[#F7FCF7] border border-[#B8DFBB] transition-colors whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>일반 모드로 나가기</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

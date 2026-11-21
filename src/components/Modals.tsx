import { FormEvent, useState } from 'react';
import { Lock, Trash2, AlertTriangle, X } from 'lucide-react';
import { Post } from '../types';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onSuccess();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E5ECE6] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#EDF9EE] flex items-center justify-center text-[#1B4332]">
              <Lock className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <h2 id="admin-login-title" className="text-lg font-extrabold text-[#222222]">
              관리자 모드 진입
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-[#5C6660] hover:bg-[#F4F7F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#5C6660] mb-4">
          관리자 비밀번호를 입력해주세요.{' '}
          <span className="font-bold text-[#1B4332]">(초기 비밀번호: 1234)</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoFocus
            placeholder="비밀번호 입력"
            aria-label="관리자 비밀번호"
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-[#D4DFD5] text-base text-[#222222] focus:border-[#1B4332] focus:outline-none"
          />

          {error && (
            <p role="alert" className="text-xs font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[46px] rounded-xl border border-[#DCE5DD] bg-white hover:bg-[#F5F8F5] text-sm font-bold text-[#4A554E] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="min-h-[46px] rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] text-sm font-extrabold text-[#1B4332] transition-colors"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  post: Post;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  post,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E5ECE6] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Trash2 className="w-4.5 h-4.5" aria-hidden="true" />
          </span>
          <h2 id="delete-confirm-title" className="text-lg font-extrabold text-[#222222]">
            게시글 삭제
          </h2>
        </div>

        <p className="text-sm font-medium text-[#222222] mb-3">
          이 게시글을 정말 삭제하시겠습니까?
        </p>

        <div className="rounded-xl bg-[#F7F9F7] border border-[#E5ECE6] px-3.5 py-2.5 mb-5">
          <p className="text-xs font-bold text-[#222222] line-clamp-2">{post.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="min-h-[46px] rounded-xl border border-[#DCE5DD] bg-white hover:bg-[#F5F8F5] disabled:opacity-60 text-sm font-bold text-[#4A554E] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="min-h-[46px] rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-sm font-bold text-white transition-colors"
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

export function AlertModal({ message, onClose }: AlertModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-modal-message"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E5ECE6] p-5 sm:p-6 shadow-xl">
        <div className="flex items-start gap-3 mb-5">
          <span className="w-9 h-9 rounded-xl bg-[#EDF9EE] flex items-center justify-center text-[#1B4332] shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </span>
          <p
            id="alert-modal-message"
            className="text-[15px] font-bold text-[#222222] leading-relaxed break-keep pt-1"
          >
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="w-full min-h-[46px] rounded-xl bg-[#8CD790] hover:bg-[#7DCE82] text-sm font-extrabold text-[#1B4332] transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}

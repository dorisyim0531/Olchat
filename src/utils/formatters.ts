import { PostType } from '../types';

const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function formatPostDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = KOREAN_DAYS[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day}(${dayOfWeek}) ${hours}:${minutes} 게시됨`;
}

export function getLocalIsoNow(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getObjectParticle(text: string): '을' | '를' | '을(를)' {
  const cleaned = text.trim().replace(/[)\]}>"'.,!?~\s]+$/g, '');
  if (!cleaned) return '을(를)';

  const lastChar = cleaned[cleaned.length - 1];
  const code = lastChar.charCodeAt(0);

  // Hangul syllables: AC00–D7A3
  if (code >= 0xac00 && code <= 0xd7a3) {
    const jongseong = (code - 0xac00) % 28;
    return jongseong !== 0 ? '을' : '를';
  }

  // Digits (Korean reading: 0 영, 1 일, 3 삼, 6 육, 7 칠, 8 팔 -> 을; 2 이, 4 사, 5 오, 9 구 -> 를)
  if (/[013678]/.test(lastChar)) return '을';
  if (/[2459]/.test(lastChar)) return '를';

  return '을(를)';
}

export function buildPostTitle(rawItemName: string, type: PostType): string {
  const trimmed = rawItemName.trim();
  if (!trimmed) return '';

  if (type === 'lost') {
    if (/찾습니다[.!]?$/.test(trimmed)) {
      return trimmed.replace(/[.!]+$/, '');
    }
    if (/[을를]$/.test(trimmed)) {
      return `${trimmed} 찾습니다`;
    }
    const particle = getObjectParticle(trimmed);
    return `${trimmed}${particle} 찾습니다`;
  }

  if (/습득했습니다[.!]?$/.test(trimmed)) {
    return trimmed.replace(/[.!]+$/, '');
  }
  if (/[을를]$/.test(trimmed)) {
    return `${trimmed} 습득했습니다`;
  }
  const particle = getObjectParticle(trimmed);
  return `${trimmed}${particle} 습득했습니다`;
}

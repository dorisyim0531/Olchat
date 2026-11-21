import { Post } from '../types';

export const DEFAULT_HANDOVER_LOCATION = '교목실';

export const DEFAULT_CATEGORIES = ['도서', '의류', '전자기기', '지갑/학생증'];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'seed-lost-1',
    type: 'lost',
    category: '의류',
    title: '검은색에 흰색 땡땡이 무늬 후리스를 찾습니다',
    location: '3층 컴퓨터실',
    handoverLocation: '교목실',
    createdAt: '2026-10-23T16:33:00',
  },
  {
    id: 'seed-found-1',
    type: 'found',
    category: '의류',
    title: '뉴발란스 슬리퍼 검정색을 습득했습니다',
    location: '3층 컴퓨터실',
    handoverLocation: '교목실',
    createdAt: '2026-10-23T16:33:00',
  },
  {
    id: 'seed-found-2',
    type: 'found',
    category: '전자기기',
    title: '아이폰 16(투명 젤리 케이스)을 습득했습니다',
    location: '운동장 벤치',
    handoverLocation: '교목실',
    createdAt: '2026-10-21T09:52:00',
  },
  {
    id: 'seed-found-3',
    type: 'found',
    category: '의류',
    title: '동복 체육복 상의 95 사이즈를 습득했습니다',
    location: '농구장',
    handoverLocation: '교목실',
    createdAt: '2026-10-19T12:47:00',
  },
];

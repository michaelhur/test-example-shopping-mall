import { screen } from '@testing-library/react';
import React from 'react';

import ErrorPage from '@/pages/error/components/ErrorPage';
import render from '@/utils/test/render';

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  // 라이브러리의 일부만 모킹하고 다른 기능은 사용하고싶은 경우, vi.importAcutal로 실제 라이브러리를 불러올 수 있음.
  const original = await vi.importActual('react-router-dom');
  return { ...original, useNavigate: () => navigateFn };
});

it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  const { user } = await render(<ErrorPage />);

  const button = await screen.getByRole('button', { name: '뒤로 이동' });

  await user.click(button);

  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});

import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

// 장바구니 데이터는 Zustand Store를 사용하기 때문에, 테스트시 모킹한 Zustand Store를 설정하여야함.
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://user-images.githubusercontent.com/35371660/230712070-afa23da8-1bda-4cc4-9a59-50a263ee629f.png',
          'https://user-images.githubusercontent.com/35371660/230711992-01a1a621-cb3d-44a7-b499-20e8d0e1a4bc.png',
          'https://user-images.githubusercontent.com/35371660/230712056-2c468ef4-45c9-4bad-b379-a9a19d9b79a9.png',
        ],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 442,
        description:
          'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
        images: [
          'https://user-images.githubusercontent.com/35371660/230762100-b119d836-3c5b-4980-9846-b7d32ea4a08f.png',
          'https://user-images.githubusercontent.com/35371660/230762118-46d965ab-7ea8-4e8a-9c0f-3ed90f96e1cd.png',
          'https://user-images.githubusercontent.com/35371660/230762139-002578da-092d-4f34-8cae-2cf3b0dfabe9.png',
        ],
        count: 4,
      },
    },
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);

  const [firstItem, secondItem] = screen.getAllByRole('row');

  // 이름
  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();
  // 수량
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  // 합계
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();

  // 이름
  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  // 수량
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4');
  // 합계
  expect(within(secondItem).getByText('$1,768.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  const { user } = await render(<ProductInfoTable />);

  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '5');

  // 수량이 5로 바뀌었는지 확인
  expect(within(firstItem).getByRole('textbox')).toHaveValue('5');

  // 합계가 2427 + 809 * 2 = 4045가 되었는지 확인
  expect(within(firstItem).getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  const alertSpy = vi.fn();

  // vi.stubGlobal을 이용하여 jsdom내 window 객체에 대한 기본 동작을 변경할 수 있음.
  // alert를 alertSpy로 대체
  vi.stubGlobal('alert', alertSpy);

  const { user } = await render(<ProductInfoTable />);

  const [firstItem] = screen.getAllByRole('row');

  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '1000');

  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);

  const [_, secondItem] = screen.getAllByRole('row');

  const deleteButton = within(secondItem).getByRole('button');

  // 두번째 아이템이 존재하는지 확인
  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  // 수량

  await user.click(deleteButton);

  // 두번째 아이템의 부존재를 확인
  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).not.toBeInTheDocument();
});

import { TableContainer, Table, TableBody, Paper } from '@mui/material';
import React from 'react';

import ProductInfoTableRow from '@/pages/cart/components/ProductInfoTableRow';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';
import { pick } from '@/utils/common';

// ProductInfoTable을 테스트하는 경우, 수량 변경을 버튼을 눌렀을때 스파이 함수의 호출 여부뿐만 아니라,
// cart의 상태 변경에 따른 ui 변경 검증도 가능
// ProductInfoTableRow 컴포넌트의 기능도 모두 검증 가능

// ProductInfoTableRow컴포넌트에서도 state나 액션을 가지고 옴
// 하지만 상태 관리 코드 산재 -> 로직 파악 및 테스트 파악 어려움
// state, api에 대한 제어 코드를 통합 테스트 대상 컴포넌트로 응집 -> 유지보수성 향상, 테스트의 단위 나누기 좋음
const ProductInfoTable = () => {
  // 테스트 실행 전에 zustand 스토어의 state를 원하는 대로 변경 필요
  const { cart, removeCartItem, changeCartItemCount } = useCartStore(state =>
    pick(state, 'cart', 'removeCartItem', 'changeCartItemCount'),
  );
  const { user } = useUserStore(state => pick(state, 'user'));

  return (
    <TableContainer component={Paper} sx={{ wordBreak: 'break-word' }}>
      <Table aria-label="장바구니 리스트">
        <TableBody>
          {Object.values(cart).map(item => (
            <ProductInfoTableRow
              key={item.id}
              item={item}
              user={user}
              removeCartItem={removeCartItem}
              changeCartItemCount={changeCartItemCount}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductInfoTable;

import { Divider } from '@mui/material';
import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import PriceSummary from '@/pages/cart/components/PriceSummary';
import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';

// PageTitle, divider는 단순한 UI 렌더링 -> 테스트 작성 X
// ProductInfoTable, PriceSummary로 나누어서 통합 테스트 작성 -> 장바구니 state를 사용하여 데이터를 렌더링

// CartTable 컴포넌트 전체를 기준으로 통합 테스트를 작성하여도 되지만,
// 큰 범위의 통합 테스트는 모킹해야 하는 정보가 많아지며 변경에도 깨지기 쉬움
const CartTable = () => {
  return (
    <>
      <PageTitle />
      <ProductInfoTable />
      <Divider sx={{ padding: 2 }} />
      <PriceSummary />
    </>
  );
};

export default CartTable;

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grid, Button } from '@mui/material';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { TOAST_ID } from '@/constants';
import ProductCard from '@/pages/home/components/ProductCard';
import useProducts from '@/pages/home/hooks/useProducts';
import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';
import { pick } from '@/utils/common';

const PRODUCT_PAGE_LIMIT = 20;

// 실제 앱에서 사용자와 상호 작용할 로직이 포함되어 있음.
// 1. 상품 리스트 조회 API에 맞게 제대로 렌더링 되는지
// 2. 상품을 클릭했을때 navigate 모킹을 통해 상세화면으로 이동하는지
// 3. 장바구니/구매 버튼을 눌렀을때 제대로 된 페이지로 이동하는지
// 4. 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 이를 통해 데이터를 더 가져올 수 있는지

// ProductList 컴포넌트에 통합테스트를 하면, ProductCard 컴포넌트의 유닛 테스트를 다 커버할 수 있음.
// 유지보수 측면에서, 통합테스트로 한번에 검증하는게 더 효율적

// 프론트엔드의 통합 테스트는...
// 상태나 데이터를 관리하는 특정 컴포넌트를 기준으로 하위 컴포넌트가 제대로 렌더링 되는지 검증하는 테스트
// 앱의 상태를 어디서 어떻게 관리하고 변경할지 구조적인 설계가 중요함

// API 호출 -> 여러 컴포넌트가 조합된 영역에서 발생 -> 통합 테스트 검증 필요
// 테스트에서 API 호출시, 실행 시간 증가 및 서버 이슈로 인한 테스트 실패의 가능성도 큼
// -> API 호출시 데이터가 변할 수 있음.
// -> API 응답을 모킹하여 일관된 테스트 환경 구성
// 모든 API 호출 -> Tanstack Query에서 담당 -> 테스트 설정 필요
const ProductList = ({ limit = PRODUCT_PAGE_LIMIT }) => {
  const navigate = useNavigate();
  const filter = useFilterStore(state =>
    pick(state, 'categoryId', 'title', 'minPrice', 'maxPrice'),
  );
  const { user, isLogin } = useUserStore(state =>
    pick(state, 'user', 'isLogin'),
  );
  const { addCartItem } = useCartStore(state => pick(state, 'addCartItem'));

  const { data, ...productsMethods } = useProducts({
    limit,
    params: filter,
  });

  const products =
    data?.pages.reduce((acc, cur) => [...acc, ...cur.products], []) ?? [];
  const { fetchNextPage, isFetchingNextPage, hasNextPage } = productsMethods;

  const handleClickCart = (ev, product) => {
    ev.stopPropagation();
    if (isLogin) {
      addCartItem(product, user.id, 1);
      toast.success(`${product.title} 장바구니 추가 완료!`, { id: TOAST_ID });
    } else {
      navigate(pageRoutes.login);
    }
  };
  const handleClickPurchase = (ev, product) => {
    ev.stopPropagation();
    if (isLogin) {
      addCartItem(product, user.id, 1);
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  return (
    <Grid container spacing={1} rowSpacing={1} justifyContent="center">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}_${index}`}
          product={product}
          onClickAddCartButton={handleClickCart}
          onClickPurchaseButton={handleClickPurchase}
        />
      ))}
      {hasNextPage && (
        <Grid item>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            Show more
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductList;

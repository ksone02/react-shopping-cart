import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { CartIcon } from '../../assets';
import type { CartItem, Product } from '../../types/types';
import { Text } from '../common/Text/Text';
import InputStepper from '../common/InputStepper/InputStepper';
import { cartListState } from '../../service/atom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import getPriceFormat from '../../utils/getPriceFormat';
import { gsap } from 'gsap';

const ProductItem = ({ product }: { product: Product }) => {
  const { localStorageData } = useLocalStorage<CartItem[]>('cartList', []);

  const [quantity, setQuantity] = useState<number>(
    localStorageData.find((data) => data.product.id === product.id)?.quantity ?? 0,
  );

  const [cartList, setCartList] = useRecoilState(cartListState);

  const [cartState, setCartState] = useState(false);

  const cartIconRef = useRef(null);
  const inputStepperRef = useRef(null);

  useEffect(() => {
    if (quantity > 0) {
      setCartState(true);
      return;
    }
    setTimeout(() => {
      setCartState(false);
    }, 200);
  }, [quantity]);

  useEffect(() => {
    if (quantity > 0) {
      gsap.fromTo(cartIconRef.current, { opacity: 0, delay: 0.3, ease: 'ease' }, { opacity: 1 });
      gsap.fromTo(
        inputStepperRef.current,
        { opacity: 0, delay: 0.3, ease: 'ease' },
        { opacity: 1 },
      );
    }
    if (quantity === 0) {
      gsap.fromTo(
        inputStepperRef.current,
        { opacity: 1, delay: 0.3, ease: 'ease' },
        { opacity: 0 },
      );
      gsap.fromTo(cartIconRef.current, { opacity: 0, delay: 0.3, ease: 'ease' }, { opacity: 1 });
    }
  }, [quantity, cartState]);

  const updateCartList = (existItemIndex: number) => {
    const newCartItem: CartItem = {
      quantity,
      product,
    };

    if (existItemIndex !== -1) {
      setCartList((prev) =>
        prev.map((cartItem, index) =>
          index === existItemIndex ? { ...cartItem, quantity } : cartItem,
        ),
      );
      return;
    }

    setCartList((prev) => [...prev, newCartItem]);
  };

  const deleteCartItem = (existItemIndex: number) => {
    if (existItemIndex !== -1) {
      setCartList((prev) => {
        const newCartList = [...prev];
        newCartList.splice(existItemIndex, 1);
        return newCartList;
      });
    }
  };

  useEffect(() => {
    const existItemIndex = cartList.findIndex((cartItem) => cartItem.product.id === product.id);

    if (quantity !== 0) {
      updateCartList(existItemIndex);
      return;
    }
    deleteCartItem(existItemIndex);
  }, [quantity]);

  return (
    <ProductWrapper>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductInfoWrapper>
        <ProductTextWrapper>
          <Text size="smallest" weight="light" color="#333333">
            {product.name}
          </Text>
          <Text size="small" weight="light" color="#333333" lineHeight="33px">
            {getPriceFormat(product.price)} 원
          </Text>
        </ProductTextWrapper>
        {!cartState ? (
          <CartIcon
            ref={cartIconRef}
            width={25}
            height={22}
            fill="#AAAAAA"
            style={{ transform: 'scaleX(-1)', cursor: 'pointer' }}
            onClick={() => setQuantity(1)}
          />
        ) : (
          <InputStepper
            ref={inputStepperRef}
            size="small"
            quantity={quantity}
            setQuantity={(value: number) => setQuantity(value)}
          />
        )}
      </ProductInfoWrapper>
    </ProductWrapper>
  );
};

export default ProductItem;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 282px;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 282px;
  transition: all 0.32s ease;

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 1px 14px 24px hsla(218, 53%, 10%, 12%);
  }
`;

const ProductInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  padding: 12px;
`;

const ProductTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

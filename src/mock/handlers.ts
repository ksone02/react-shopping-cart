import { rest } from 'msw';
import productsData from './mockData.json';
import type { Product } from '../types/types';

const products = productsData as Product[];

export const handlers = [
  rest.get('/products', async (_, res, ctx) => {
    await delay(200);

    return res(ctx.status(200), ctx.json(products));
  }),

  rest.post('/products', async (req, res, ctx) => {
    const { product } = await req.json<{ product: Product }>();
    products.push(product);

    return res(ctx.status(200), ctx.text('Add Product Success'));
  }),
];

async function delay(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

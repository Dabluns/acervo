import { NextResponse } from 'next/server';
import { getCategories, getProducts } from '@/lib/acervo-db';

export async function GET() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return NextResponse.json({ categories, products });
}

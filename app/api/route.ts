import { jsonOk } from '@/lib/api-utils';

export async function GET() {
  return jsonOk({
    name: 'GeoTradez API',
    version: '1.0',
    status: 'ok',
    docs: {
      auth: '/api/auth/login',
      products: '/api/products',
      bootstrap: '/api/bootstrap',
    },
  });
}

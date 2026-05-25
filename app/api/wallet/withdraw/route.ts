import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { mapTransaction } from '@/lib/mappers';

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(['Bank', 'PayPal', 'Wise']),
});

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const { amount, method } = schema.parse(await req.json());
    const wallet = await prisma.wallet.findUnique({ where: { userId: userId! } });
    if (!wallet || amount > wallet.balance) return jsonError('Invalid withdrawal amount', 400);

    const newBalance = wallet.balance - amount;
    const tx = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: nowTime(),
        description: 'Withdrawal',
        accountMask: method === 'PayPal' ? '•••• 4821' : '•••• 7392',
        type: 'Withdrawal',
        paymentMethod: method,
        amount: -amount,
        status: 'Completed',
        balance: newBalance,
      },
    });
    await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: newBalance } });

    const fee = amount * 0.02;
    return jsonOk({
      balance: newBalance,
      transaction: mapTransaction(tx),
      received: amount - fee,
    });
  } catch {
    return jsonError('Invalid request', 400);
  }
}

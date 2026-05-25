import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

const AI_RESPONSES = [
  "Here's a polished product description tailored for your audience:\n\nTransform your workflow with an all-in-one digital bundle built for modern creators. Clear value, instant access, and global-ready positioning.",
  "I've drafted high-converting ad copy:\n\n**Headline:** Launch faster. Sell smarter.\n**Body:** Geotradez helps you build, market, and scale — without the complexity.",
  "Your store page outline is ready:\n\n1. Hero with social proof\n2. Feature grid\n3. Pricing table\n4. FAQ + guarantee\n5. Strong CTA",
  "Based on your niche, consider: digital templates, AI toolkits, and short courses in the $19–$49 range for highest conversion.",
];

const schema = z.object({ content: z.string().min(1) });

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  try {
    const { content } = schema.parse(await req.json());
    const thread = await prisma.aiThread.findFirst({ where: { id, userId: userId! } });
    if (!thread) return jsonError('Thread not found', 404);

    const title = content.slice(0, 40) + (content.length > 40 ? '…' : '');
    const msgCount = await prisma.aiMessage.count({ where: { threadId: id } });

    const userMsg = await prisma.aiMessage.create({
      data: { threadId: id, role: 'user', content, time: nowTime() },
    });

    await prisma.aiThread.update({
      where: { id },
      data: {
        title: msgCount === 0 ? title : thread.title,
        updatedAt: new Date(),
      },
    });

    const reply =
      AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    const assistantMsg = await prisma.aiMessage.create({
      data: { threadId: id, role: 'assistant', content: reply, time: nowTime() },
    });

    return jsonOk({
      userMessage: {
        id: userMsg.id,
        role: 'user' as const,
        content: userMsg.content,
        time: userMsg.time,
      },
      assistantMessage: {
        id: assistantMsg.id,
        role: 'assistant' as const,
        content: assistantMsg.content,
        time: assistantMsg.time,
      },
      threadTitle: msgCount === 0 ? title : thread.title,
    });
  } catch {
    return jsonError('Invalid request', 400);
  }
}

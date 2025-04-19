import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  const { hash } = params;

  const record = await prisma.urlInfo.findUnique({
    where: { uid: hash },
  });

  if (record?.url) {
    redirect(record.url);
  }

  redirect('/');
}

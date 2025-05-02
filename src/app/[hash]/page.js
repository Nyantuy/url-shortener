import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  const { hash } = params;

  const record = await prisma.urlInfo.findUnique({
    where: { uid: hash },
  });

  if (!record) {
    redirect('/');
  }

  if (record.expiredAt && new Date(record.expiredAt) < new Date()) {
    await prisma.urlInfo.delete({
      where: { uid: hash },
    });
    return (
      <div className="p-8 text-center">
        <h1>Link Expired</h1>
        <p>The link you are trying to access has expired.</p>
      </div>
    );
  }

  if (record.url) {
    redirect(record.url);
  }

  redirect('/');
}

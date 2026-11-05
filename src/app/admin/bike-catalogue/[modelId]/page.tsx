import { BikeModelDetail } from '@/components/admin/BikeModelDetail';

export const dynamic = 'force-dynamic';

export default async function BikeModelDetailPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  return <BikeModelDetail id={modelId} />;
}

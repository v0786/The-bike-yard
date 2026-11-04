import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    const publicSettings = settings
      ? {
          theme: settings.theme,
          primaryColour: settings.primaryColour,
          secondaryColour: settings.secondaryColour,
          fontFamily: settings.fontFamily,
          fontSize: settings.fontSize,
          invoicePrefix: settings.invoicePrefix,
          language: settings.language,
        }
      : null;
    return NextResponse.json({ data: publicSettings });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch public settings' } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAvailableSlots, getOpeningWindow } from "@/lib/availability";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability?date=2026-08-03&service=Férfi%20hajvágás
 * Visszaadja az adott napon szabad kezdési időpontokat.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceName = searchParams.get("service");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Hiányzó vagy hibás dátum." }, { status: 400 });
  }

  const service = site.services.find((s) => s.name === serviceName);
  if (!service) {
    return NextResponse.json({ error: "Ismeretlen szolgáltatás." }, { status: 400 });
  }

  const [slots, window] = await Promise.all([
    getAvailableSlots(date, service.minutes),
    getOpeningWindow(date),
  ]);

  return NextResponse.json({
    date,
    open: window !== null,
    slots,
  });
}

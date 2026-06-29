import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { ArchetypeId } from "@/lib/quizzes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      archetype_id,
      answers,
      scores,
    }: {
      email?: string;
      archetype_id: ArchetypeId;
      answers: unknown;
      scores: unknown;
    } = body;

    const session_id =
      crypto.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const client = getSupabase();
    if (client) {
      try {
        await client.from("quiz_leads").upsert({
          email: email || null,
          archetype_id,
          answers,
          scores,
        });
      } catch {
        // Don't block the user on supabase failure
      }
    }

    return NextResponse.json({ ok: true, archetype_id, session_id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

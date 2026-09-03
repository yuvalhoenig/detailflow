import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export async function logActivity({
  businessId,
  actorId,
  entityType,
  entityId,
  action,
  metadata,
}: {
  businessId: string;
  actorId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, Json>;
}) {
  const supabase = await createClient();
  await supabase.from("activity").insert({
    business_id: businessId,
    actor_id: actorId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata: metadata ?? {},
  });
}

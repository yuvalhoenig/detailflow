// Hand-maintained to match supabase/migrations/0001_init.sql.
// Regenerate with the Supabase CLI once Docker is available:
//   npx supabase gen types typescript --db-url <connection-string> > src/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      businesses: Table<
        {
          id: string;
          name: string;
          owner_id: string;
          phone: string | null;
          address: string | null;
          timezone: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          owner_id: string;
          phone?: string | null;
          address?: string | null;
          timezone?: string;
          stripe_customer_id?: string | null;
        }
      >;
      profiles: Table<
        {
          id: string;
          business_id: string | null;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          role: "owner" | "staff";
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          business_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "staff";
        }
      >;
      customers: Table<
        {
          id: string;
          business_id: string;
          first_name: string;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          first_name: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
        }
      >;
      vehicles: Table<
        {
          id: string;
          business_id: string;
          customer_id: string;
          make: string | null;
          model: string | null;
          year: number | null;
          color: string | null;
          license_plate: string | null;
          vin: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          customer_id: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          color?: string | null;
          license_plate?: string | null;
          vin?: string | null;
          notes?: string | null;
        }
      >;
      services: Table<
        {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          active?: boolean;
        }
      >;
      appointments: Table<
        {
          id: string;
          business_id: string;
          customer_id: string;
          vehicle_id: string | null;
          scheduled_at: string;
          duration_minutes: number;
          status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
          notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          customer_id: string;
          vehicle_id?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          status?: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
          notes?: string | null;
        }
      >;
      jobs: Table<
        {
          id: string;
          business_id: string;
          appointment_id: string | null;
          customer_id: string;
          vehicle_id: string | null;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          total: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          appointment_id?: string | null;
          customer_id: string;
          vehicle_id?: string | null;
          status?: "pending" | "in_progress" | "completed" | "cancelled";
          total?: number;
          started_at?: string | null;
          completed_at?: string | null;
        }
      >;
      job_services: Table<
        {
          id: string;
          job_id: string;
          service_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
        },
        {
          id?: string;
          job_id: string;
          service_id?: string | null;
          description: string;
          quantity?: number;
          unit_price?: number;
        }
      >;
      quotes: Table<
        {
          id: string;
          business_id: string;
          customer_id: string;
          vehicle_id: string | null;
          status: "draft" | "sent" | "accepted" | "declined" | "expired";
          subtotal: number;
          tax: number;
          total: number;
          notes: string | null;
          valid_until: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          customer_id: string;
          vehicle_id?: string | null;
          status?: "draft" | "sent" | "accepted" | "declined" | "expired";
          subtotal?: number;
          tax?: number;
          total?: number;
          notes?: string | null;
          valid_until?: string | null;
        }
      >;
      quote_items: Table<
        {
          id: string;
          quote_id: string;
          service_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
        },
        {
          id?: string;
          quote_id: string;
          service_id?: string | null;
          description: string;
          quantity?: number;
          unit_price?: number;
        }
      >;
      invoices: Table<
        {
          id: string;
          business_id: string;
          customer_id: string;
          job_id: string | null;
          quote_id: string | null;
          status: "draft" | "sent" | "paid" | "overdue" | "void";
          subtotal: number;
          tax: number;
          total: number;
          amount_paid: number;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          customer_id: string;
          job_id?: string | null;
          quote_id?: string | null;
          status?: "draft" | "sent" | "paid" | "overdue" | "void";
          subtotal?: number;
          tax?: number;
          total?: number;
          amount_paid?: number;
          due_date?: string | null;
        }
      >;
      invoice_items: Table<
        {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
        },
        {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price?: number;
        }
      >;
      payments: Table<
        {
          id: string;
          business_id: string;
          invoice_id: string | null;
          customer_id: string;
          amount: number;
          method: "card" | "cash" | "check" | "other";
          stripe_payment_intent_id: string | null;
          status: "pending" | "succeeded" | "failed" | "refunded";
          paid_at: string;
          created_at: string;
        },
        {
          id?: string;
          business_id: string;
          invoice_id?: string | null;
          customer_id: string;
          amount: number;
          method?: "card" | "cash" | "check" | "other";
          stripe_payment_intent_id?: string | null;
          status?: "pending" | "succeeded" | "failed" | "refunded";
          paid_at?: string;
        }
      >;
      photos: Table<
        {
          id: string;
          business_id: string;
          job_id: string | null;
          customer_id: string | null;
          vehicle_id: string | null;
          type: "before" | "after";
          storage_path: string;
          created_at: string;
        },
        {
          id?: string;
          business_id: string;
          job_id?: string | null;
          customer_id?: string | null;
          vehicle_id?: string | null;
          type?: "before" | "after";
          storage_path: string;
        }
      >;
      customer_notes: Table<
        {
          id: string;
          business_id: string;
          customer_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        },
        {
          id?: string;
          business_id: string;
          customer_id: string;
          author_id?: string | null;
          body: string;
        }
      >;
      tasks: Table<
        {
          id: string;
          business_id: string;
          assigned_to: string | null;
          title: string;
          description: string | null;
          status: "open" | "in_progress" | "done";
          due_date: string | null;
          customer_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          assigned_to?: string | null;
          title: string;
          description?: string | null;
          status?: "open" | "in_progress" | "done";
          due_date?: string | null;
          customer_id?: string | null;
        }
      >;
      activity: Table<
        {
          id: string;
          business_id: string;
          actor_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        },
        {
          id?: string;
          business_id: string;
          actor_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action: string;
          metadata?: Json;
        }
      >;
      subscriptions: Table<
        {
          id: string;
          business_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: "free" | "pro";
          status: "active" | "trialing" | "past_due" | "canceled";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          business_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: "free" | "pro";
          status?: "active" | "trialing" | "past_due" | "canceled";
          current_period_end?: string | null;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

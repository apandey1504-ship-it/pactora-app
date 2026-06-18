export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "client" | "contractor" | "admin" | "arbitrator";
export type ProjectStatus = "draft" | "pending_acceptance" | "active" | "paused" | "completed" | "cancelled" | "disputed";
export type MilestoneStatus =
  | "draft"
  | "pending"
  | "funded"
  | "in_progress"
  | "submitted"
  | "approved"
  | "revision_requested"
  | "paid"
  | "disputed";
export type ChangeRequestStatus =
  | "requested"
  | "contractor_review"
  | "client_review"
  | "approved"
  | "rejected"
  | "cancelled";
export type PaymentStatus = "pending" | "funded" | "released" | "refunded" | "disputed" | "failed";
export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected";

export type Database = {
  public: {
    Enums: {
      user_role: UserRole;
      project_status: ProjectStatus;
      milestone_status: MilestoneStatus;
      change_request_status: ChangeRequestStatus;
      payment_status: PaymentStatus;
      dispute_status: DisputeStatus;
    };
    Views: {
      [_ in never]: never;
    };
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          kyc_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          kyc_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          legal_name: string | null;
          business_type: string | null;
          country: string | null;
          registration_number: string | null;
          tax_number: string | null;
          verification_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          legal_name?: string | null;
          business_type?: string | null;
          country?: string | null;
          registration_number?: string | null;
          tax_number?: string | null;
          verification_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [];
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_members"]["Insert"]>;
        Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          monthly_price: number | null;
          transaction_fee_percent: number | null;
          features: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          monthly_price?: number | null;
          transaction_fee_percent?: number | null;
          features?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["plans"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string;
          plan_id: string;
          status: string;
          started_at: string;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          plan_id: string;
          status?: string;
          started_at?: string;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [];
      };
      staff_access_grants: {
        Row: {
          id: string;
          user_id: string;
          access_level: string;
          can_view_all_data: boolean;
          can_manage_projects: boolean;
          can_manage_payments: boolean;
          can_review_disputes: boolean;
          can_verify_companies: boolean;
          can_export_worksheets: boolean;
          granted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_level?: string;
          can_view_all_data?: boolean;
          can_manage_projects?: boolean;
          can_manage_payments?: boolean;
          can_review_disputes?: boolean;
          can_verify_companies?: boolean;
          can_export_worksheets?: boolean;
          granted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_access_grants"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          client_company_id: string;
          contractor_company_id: string | null;
          title: string;
          description: string | null;
          project_value: number;
          currency: string;
          status: ProjectStatus;
          start_date: string | null;
          due_date: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_company_id: string;
          contractor_company_id?: string | null;
          title: string;
          description?: string | null;
          project_value?: number;
          currency?: string;
          status?: ProjectStatus;
          start_date?: string | null;
          due_date?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      project_participants: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_participants"]["Insert"]>;
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          amount: number;
          currency: string;
          due_date: string | null;
          status: MilestoneStatus;
          submitted_at: string | null;
          approved_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          amount?: number;
          currency?: string;
          due_date?: string | null;
          status?: MilestoneStatus;
          submitted_at?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["milestones"]["Insert"]>;
        Relationships: [];
      };
      change_requests: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          requested_by: string;
          title: string;
          description: string | null;
          impact_cost: number;
          impact_days: number;
          status: ChangeRequestStatus;
          approved_by_client: boolean;
          approved_by_contractor: boolean;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          requested_by: string;
          title: string;
          description?: string | null;
          impact_cost?: number;
          impact_days?: number;
          status?: ChangeRequestStatus;
          approved_by_client?: boolean;
          approved_by_contractor?: boolean;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["change_requests"]["Insert"]>;
        Relationships: [];
      };
      change_request_comments: {
        Row: {
          id: string;
          change_request_id: string;
          user_id: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          change_request_id: string;
          user_id: string;
          comment: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["change_request_comments"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          project_id: string;
          sender_id: string;
          message: string;
          message_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          sender_id: string;
          message: string;
          message_type?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          uploaded_by: string;
          file_name: string;
          file_url: string;
          file_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          uploaded_by: string;
          file_name: string;
          file_url: string;
          file_type?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string;
          payer_company_id: string;
          payee_company_id: string;
          amount: number;
          currency: string;
          status: PaymentStatus;
          provider: string | null;
          provider_payment_id: string | null;
          platform_fee_amount: number;
          payment_provider_fee_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id: string;
          payer_company_id: string;
          payee_company_id: string;
          amount: number;
          currency?: string;
          status?: PaymentStatus;
          provider?: string | null;
          provider_payment_id?: string | null;
          platform_fee_amount?: number;
          payment_provider_fee_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      platform_fees: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          company_id: string;
          amount: number;
          fee_percent: number;
          payment_provider_fee_amount: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          company_id: string;
          amount?: number;
          fee_percent?: number;
          payment_provider_fee_amount?: number | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platform_fees"]["Insert"]>;
        Relationships: [];
      };
      payment_provider_events: {
        Row: {
          id: string;
          provider: string;
          event_type: string;
          provider_event_id: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          event_type: string;
          provider_event_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_provider_events"]["Insert"]>;
        Relationships: [];
      };
      disputes: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          raised_by: string;
          reason: string;
          description: string | null;
          status: DisputeStatus;
          resolution: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          raised_by: string;
          reason: string;
          description?: string | null;
          status?: DisputeStatus;
          resolution?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["disputes"]["Insert"]>;
        Relationships: [];
      };
      trust_scores: {
        Row: {
          id: string;
          company_id: string;
          score: number;
          completion_rate: number;
          on_time_rate: number;
          dispute_rate: number;
          payment_reliability: number;
          last_calculated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          score?: number;
          completion_rate?: number;
          on_time_rate?: number;
          dispute_rate?: number;
          payment_reliability?: number;
          last_calculated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trust_scores"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          project_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          project_id?: string | null;
          action: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          read_status: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          read_status?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
    };
    Functions: {
      calculate_basic_trust_score: {
        Args: { company_id: string };
        Returns: number;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"];
export type MilestoneRecord = Database["public"]["Tables"]["milestones"]["Row"];
export type ChangeRequestRecord = Database["public"]["Tables"]["change_requests"]["Row"];
export type MessageRecord = Database["public"]["Tables"]["messages"]["Row"];
export type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];
export type PaymentRecord = Database["public"]["Tables"]["payments"]["Row"];
export type DisputeRecord = Database["public"]["Tables"]["disputes"]["Row"];
export type TrustScoreRecord = Database["public"]["Tables"]["trust_scores"]["Row"];
export type StaffAccessGrantRecord = Database["public"]["Tables"]["staff_access_grants"]["Row"];

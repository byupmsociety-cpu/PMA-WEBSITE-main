export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      faq_items: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_public: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_public?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_public?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      approved_pma_members: {
        Row: {
          added_at: string
          added_by: string | null
          default_role: string
          email: string
          id: string
          is_disabled: boolean
          used_at: string | null
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          default_role?: string
          email: string
          id?: string
          is_disabled?: boolean
          used_at?: string | null
        }
        Update: {
          added_at?: string
          added_by?: string | null
          default_role?: string
          email?: string
          id?: string
          is_disabled?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          is_public: boolean
          location: string | null
          registration_link: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          location?: string | null
          registration_link?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          location?: string | null
          registration_link?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_suggestions: {
        Row: {
          id: string
          title: string
          description: string | null
          submitter_email: string | null
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          submitter_email?: string | null
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          submitter_email?: string | null
          created_at?: string
          read_at?: string | null
        }
        Relationships: []
      }
      asset_reviews: {
        Row: {
          id: string
          user_id: string
          file_url: string
          file_name: string
          status: string
          feedback: string | null
          reviewer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_url: string
          file_name: string
          status?: string
          feedback?: string | null
          reviewer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_url?: string
          file_name?: string
          status?: string
          feedback?: string | null
          reviewer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points_required: number | null
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points_required?: number | null
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points_required?: number | null
        }
        Relationships: []
      }
      pm_journey_steps: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          persona: Database["public"]["Enums"]["user_persona"]
          points: number | null
          step_order: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          persona: Database["public"]["Enums"]["user_persona"]
          points?: number | null
          step_order: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          persona?: Database["public"]["Enums"]["user_persona"]
          points?: number | null
          step_order?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_company: string | null
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_alumni: boolean | null
          is_blocked: boolean
          is_pma_member: boolean | null
          is_visible_in_directory: boolean | null
          linkedin_url: string | null
          membership_verified_at: string | null
          onboarding_completed: boolean | null
          open_to_coffee_chats: boolean | null
          persona: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage: number | null
          recruiting_stage: string | null
          role: string
          school_year: string | null
          target_roles: string[] | null
          updated_at: string
          user_id: string
          last_seen_resume_feedback_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_company?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_alumni?: boolean | null
          is_blocked?: boolean
          is_pma_member?: boolean | null
          is_visible_in_directory?: boolean | null
          linkedin_url?: string | null
          membership_verified_at?: string | null
          onboarding_completed?: boolean | null
          open_to_coffee_chats?: boolean | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage?: number | null
          recruiting_stage?: string | null
          role?: string
          school_year?: string | null
          target_roles?: string[] | null
          updated_at?: string
          user_id: string
          last_seen_resume_feedback_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_company?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_alumni?: boolean | null
          is_blocked?: boolean
          is_pma_member?: boolean | null
          is_visible_in_directory?: boolean | null
          linkedin_url?: string | null
          membership_verified_at?: string | null
          onboarding_completed?: boolean | null
          open_to_coffee_chats?: boolean | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage?: number | null
          recruiting_stage?: string | null
          role?: string
          school_year?: string | null
          target_roles?: string[] | null
          updated_at?: string
          user_id?: string
          last_seen_resume_feedback_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          position: string | null
          priority: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          position?: string | null
          priority?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          position?: string | null
          priority?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      resource_clicks: {
        Row: {
          category_id: string
          clicked_at: string
          id: string
          resource_title: string
        }
        Insert: {
          category_id: string
          clicked_at?: string
          id?: string
          resource_title: string
        }
        Update: {
          category_id?: string
          clicked_at?: string
          id?: string
          resource_title?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          created_at: string | null
          id: string
          is_featured: boolean | null
          outcome: string | null
          persona: Database["public"]["Enums"]["user_persona"] | null
          school_year: string | null
          story_text: string
          student_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          outcome?: string | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          school_year?: string | null
          story_text: string
          student_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          outcome?: string | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          school_year?: string | null
          story_text?: string
          student_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          step_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          step_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "pm_journey_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_scores: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          score: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          score: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          score?: number
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          id: string
          title: string
          company: string
          description: string | null
          url: string
          job_type: string | null
          industry: string | null
          location: string | null
          company_size: string | null
          salary_range: string | null
          deadline: string | null
          is_featured: boolean
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          company: string
          description?: string | null
          url: string
          job_type?: string | null
          industry?: string | null
          location?: string | null
          company_size?: string | null
          salary_range?: string | null
          deadline?: string | null
          is_featured?: boolean
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          company?: string
          description?: string | null
          url?: string
          job_type?: string | null
          industry?: string | null
          location?: string | null
          company_size?: string | null
          salary_range?: string | null
          deadline?: string | null
          is_featured?: boolean
          created_at?: string
          is_active?: boolean
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_posting_id: string | null
          company_name: string | null
          job_title: string | null
          status: string
          notes: string | null
          applied_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_posting_id?: string | null
          company_name?: string | null
          job_title?: string | null
          status: string
          notes?: string | null
          applied_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_posting_id?: string | null
          company_name?: string | null
          job_title?: string | null
          status?: string
          notes?: string | null
          applied_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          }
        ]
      }
      job_notifications: {
        Row: {
          user_id: string
          job_id: string
          viewed_at: string | null
          applied: boolean
          saved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          job_id: string
          viewed_at?: string | null
          applied?: boolean
          saved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          job_id?: string
          viewed_at?: string | null
          applied?: boolean
          saved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      mock_interview_slots: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string
          is_booked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time: string
          is_booked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string
          is_booked?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_interview_slots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      mock_interviews: {
        Row: {
          id: string
          slot_id: string
          interviewer_id: string
          interviewee_id: string
          status: string
          meeting_link: string | null
          feedback_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slot_id: string
          interviewer_id: string
          interviewee_id: string
          status?: string
          meeting_link?: string | null
          feedback_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slot_id?: string
          interviewer_id?: string
          interviewee_id?: string
          status?: string
          meeting_link?: string | null
          feedback_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_interviews_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "mock_interview_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interviews_interviewee_id_fkey"
            columns: ["interviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      resource_categories: {
        Row: {
          color: string
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category_id: string
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string
          is_featured: boolean
          is_paid: boolean
          is_premium: boolean
          subcategory: string | null
          tips: string[] | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string
          is_featured?: boolean
          is_paid?: boolean
          is_premium?: boolean
          subcategory?: string | null
          tips?: string[] | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string
          is_featured?: boolean
          is_paid?: boolean
          is_premium?: boolean
          subcategory?: string | null
          tips?: string[] | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "resource_categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_progress: { Args: { user_uuid: string }; Returns: number }
      is_approved_pma_member: {
        Args: { email_address: string }
        Returns: boolean
      }
      upsert_leaderboard_score: {
        Args: {
          p_email: string
          p_name: string
          p_score: number
        }
        Returns: {
          id: string
          name: string
          email: string
          score: number
          created_at: string
        }
      }
    }
    Enums: {
      badge_type: "milestone" | "social" | "achievement" | "special"
      user_persona: "curious" | "starting" | "recruiting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_type: ["milestone", "social", "achievement", "special"],
      user_persona: ["curious", "starting", "recruiting"],
    },
  },
} as const

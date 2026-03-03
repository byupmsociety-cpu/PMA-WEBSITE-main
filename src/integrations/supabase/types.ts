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
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_blocked: boolean
          is_pma_member: boolean | null
          membership_verified_at: string | null
          onboarding_completed: boolean | null
          persona: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage: number | null
          role: string
          school_year: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean
          is_pma_member?: boolean | null
          membership_verified_at?: string | null
          onboarding_completed?: boolean | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage?: number | null
          role?: string
          school_year?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean
          is_pma_member?: boolean | null
          membership_verified_at?: string | null
          onboarding_completed?: boolean | null
          persona?: Database["public"]["Enums"]["user_persona"] | null
          progress_percentage?: number | null
          role?: string
          school_year?: string | null
          updated_at?: string
          user_id?: string
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

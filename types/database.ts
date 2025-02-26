export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          creator_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          creator_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          creator_id?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          avatar_url?: string | null;
        };
      };
      room_users: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
          expires_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

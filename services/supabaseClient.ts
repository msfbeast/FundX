import { createClient } from '@supabase/supabase-js';

// These will be set from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface SavedVC {
    id?: string;
    user_id?: string;
    vc_name: string;
    firm_type: string;
    check_size?: string;
    thesis?: string;
    notable_portfolio?: string[];
    match_reason?: string;
    email?: string;
    website?: string;
    linkedin?: string;
    detailed_info?: string;
    status?: 'to_contact' | 'contacted' | 'in_discussion' | 'passed' | 'invested';
    notes?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface GeneratedEmail {
    id?: string;
    user_id?: string;
    vc_id: string;
    email_content: string;
    sent_at?: string;
    created_at?: string;
}

// Helper functions for VC operations
export const vcService = {
    // Save a VC to the database
    async saveVC(vc: SavedVC) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('saved_vcs')
            .upsert({
                user_id: user.id,
                vc_name: vc.vc_name,
                firm_type: vc.firm_type,
                check_size: vc.check_size,
                thesis: vc.thesis,
                notable_portfolio: vc.notable_portfolio,
                match_reason: vc.match_reason,
                email: vc.email,
                website: vc.website,
                linkedin: vc.linkedin,
                detailed_info: vc.detailed_info,
                status: vc.status || 'to_contact',
                notes: vc.notes,
                tags: vc.tags,
            }, { onConflict: 'user_id, vc_name' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all saved VCs for the current user
    async getSavedVCs() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('saved_vcs')
            .select('*')
            .eq('user_id', user.id) // Explicit user filter for security
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as SavedVC[];
    },

    // Update VC status
    async updateVCStatus(vcId: string, status: SavedVC['status']) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('saved_vcs')
            .update({ status })
            .eq('id', vcId)
            .eq('user_id', user.id) // Ensure user owns this VC
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Add notes to a VC
    async updateVCNotes(vcId: string, notes: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('saved_vcs')
            .update({ notes })
            .eq('id', vcId)
            .eq('user_id', user.id) // Ensure user owns this VC
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a VC
    async deleteVC(vcId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('saved_vcs')
            .delete()
            .eq('id', vcId)
            .eq('user_id', user.id); // Ensure user owns this VC

        if (error) throw error;
    },

    // Save generated email
    async saveEmail(vcId: string, emailContent: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('generated_emails')
            .insert({
                user_id: user.id,
                vc_id: vcId,
                email_content: emailContent,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get emails for a VC
    async getVCEmails(vcId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('generated_emails')
            .select('*')
            .eq('vc_id', vcId)
            .eq('user_id', user.id) // Ensure user owns these emails
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as GeneratedEmail[];
    },
};

// Auth helper functions
export const authService = {
    // Sign up with email and password
    async signUp(email: string, password: string) {
        // Validate password strength
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error(`Weak password: ${passwordValidation.errors.join(', ')}`);
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) throw error;
        return data;
    },

    // Validate password strength
    validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (password.length < 12) {
            errors.push('Password must be at least 12 characters');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Must contain uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Must contain lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            errors.push('Must contain number');
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Must contain special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Sign in with email and password
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Listen to auth state changes
    onAuthStateChange(callback: (user: any) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user ?? null);
        });
    },
};

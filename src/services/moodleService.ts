import { MOODLE_CONFIG } from '../config/moodleConfig';
import { MoodleEvent } from '../types/moodle';
import { supabase } from '../lib/supabase';

export class MoodleService {
    static async processEvent(event: MoodleEvent) {
        try {
            // Validate event
            await this.validateEvent(event);

            // Process based on type
            switch (event.type) {
                case 'quiz_completed':
                    return this.handleQuizCompletion(event);
                case 'forum_post':
                    return this.handleForumPost(event);
                case 'assignment_submitted':
                    return this.handleAssignmentSubmission(event);
            }
        } catch (error) {
            console.error('Error processing Moodle event:', error);
            throw error;
        }
    }

    private static async handleQuizCompletion(event: MoodleEvent) {
        const { score, maxScore } = event.data;
        const percentage = (score / maxScore) * 100;
        
        // Calculate rewards
        const baseXP = Math.floor(percentage * MOODLE_CONFIG.rewards.quiz.xpBase);
        const bonusXP = percentage >= 90 ? MOODLE_CONFIG.rewards.quiz.xpBonus : 0;
        const totalXP = baseXP + bonusXP;

        const baseCoins = Math.floor(percentage * MOODLE_CONFIG.rewards.quiz.coinBase);
        const bonusCoins = percentage >= 90 ? MOODLE_CONFIG.rewards.quiz.coinBonus : 0;
        const totalCoins = baseCoins + bonusCoins;

        // Update user progress
        await supabase.rpc('update_user_progress', {
            user_id: event.userId,
            xp_gain: totalXP,
            coin_gain: totalCoins,
            activity_type: 'quiz',
            score: percentage
        });

        return {
            xp: totalXP,
            coins: totalCoins,
            achievements: this.checkQuizAchievements(percentage)
        };
    }
} 


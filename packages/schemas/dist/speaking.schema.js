import { z } from 'zod';
export const SpeakingStorySchema = z.object({
    type: z.literal('speaking-story'),
    name: z.string().min(1),
    applicableTopics: z.array(z.string()),
    part2Length: z.number().int().positive(),
    lastPracticed: z.string().datetime().optional(),
});
export const TopicGroupSchema = z.object({
    name: z.string(),
    stories: z.array(z.string()),
    part2Count: z.number().int().default(0),
    part3Count: z.number().int().default(0),
});
export const SpeakingTopicGroupSchema = z.object({
    type: z.literal('speaking-topic-group'),
    lastUpdated: z.string().datetime(),
    groups: z.array(TopicGroupSchema),
});
//# sourceMappingURL=speaking.schema.js.map
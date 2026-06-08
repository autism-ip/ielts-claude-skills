import { z } from 'zod';
export declare const SpeakingStorySchema: z.ZodObject<{
    type: z.ZodLiteral<"speaking-story">;
    name: z.ZodString;
    applicableTopics: z.ZodArray<z.ZodString, "many">;
    part2Length: z.ZodNumber;
    lastPracticed: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "speaking-story";
    name: string;
    applicableTopics: string[];
    part2Length: number;
    lastPracticed?: string | undefined;
}, {
    type: "speaking-story";
    name: string;
    applicableTopics: string[];
    part2Length: number;
    lastPracticed?: string | undefined;
}>;
export type SpeakingStory = z.infer<typeof SpeakingStorySchema>;
export declare const TopicGroupSchema: z.ZodObject<{
    name: z.ZodString;
    stories: z.ZodArray<z.ZodString, "many">;
    part2Count: z.ZodDefault<z.ZodNumber>;
    part3Count: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    stories: string[];
    part2Count: number;
    part3Count: number;
}, {
    name: string;
    stories: string[];
    part2Count?: number | undefined;
    part3Count?: number | undefined;
}>;
export declare const SpeakingTopicGroupSchema: z.ZodObject<{
    type: z.ZodLiteral<"speaking-topic-group">;
    lastUpdated: z.ZodString;
    groups: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        stories: z.ZodArray<z.ZodString, "many">;
        part2Count: z.ZodDefault<z.ZodNumber>;
        part3Count: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        stories: string[];
        part2Count: number;
        part3Count: number;
    }, {
        name: string;
        stories: string[];
        part2Count?: number | undefined;
        part3Count?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "speaking-topic-group";
    lastUpdated: string;
    groups: {
        name: string;
        stories: string[];
        part2Count: number;
        part3Count: number;
    }[];
}, {
    type: "speaking-topic-group";
    lastUpdated: string;
    groups: {
        name: string;
        stories: string[];
        part2Count?: number | undefined;
        part3Count?: number | undefined;
    }[];
}>;
export type SpeakingTopicGroup = z.infer<typeof SpeakingTopicGroupSchema>;
//# sourceMappingURL=speaking.schema.d.ts.map
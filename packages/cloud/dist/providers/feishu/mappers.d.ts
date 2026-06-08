export type FeishuFieldValue = string | number | boolean | null | string[];
export interface MappedRecord {
    fields: Record<string, FeishuFieldValue>;
    stableHash: string;
}
export interface PrivacyConfig {
    syncRawText: boolean;
    syncScores: boolean;
}
export declare function mapProfile(p: Record<string, any>, _privacy?: PrivacyConfig): MappedRecord;
export declare function mapWriting(r: Record<string, any>, p?: PrivacyConfig): MappedRecord;
export declare function mapReading(r: Record<string, any>, p?: PrivacyConfig): MappedRecord;
export declare function mapListening(r: Record<string, any>): MappedRecord;
export declare function mapVocab(r: Record<string, any>): MappedRecord;
export declare function mapSpeaking(r: Record<string, any>, p?: PrivacyConfig): MappedRecord;
export declare function mapPlan(r: Record<string, any>): MappedRecord;
//# sourceMappingURL=mappers.d.ts.map
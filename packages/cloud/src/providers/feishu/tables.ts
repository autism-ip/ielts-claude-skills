/**
 * [INPUT]: 依赖 FeishuClient 的请求方法
 * [OUTPUT]: 对外提供 FeishuTableSchema 定义、FeishuTableManager（初始化/检查/创建表）
 * [POS]: packages/cloud/providers/feishu 的表结构管理，被 cloud init-feishu 命令消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { FeishuClient } from './client.js';

export interface FeishuFieldDef {
  field_name: string;
  type: number;  /* Feishu field type: 1=text, 2=number, 3=select, 4=multiSelect, 5=date, 7=checkbox, 9=url, 11=phone */
  property?: Record<string, any>;
}

export interface FeishuTableDef {
  name: string;
  fields: FeishuFieldDef[];
}

/* Feishu field type constants */
export const FIELD_TYPES = {
  TEXT: 1, NUMBER: 2, SELECT: 3, MULTI_SELECT: 4,
  DATE: 5, CHECKBOX: 7, URL: 9, PHONE: 11,
} as const;

/* ── Table schemas ── */

const PROFILE_TABLE: FeishuTableDef = {
  name: 'Profile',
  fields: [
    { field_name: 'target_overall', type: FIELD_TYPES.NUMBER },
    { field_name: 'target_writing', type: FIELD_TYPES.NUMBER },
    { field_name: 'target_reading', type: FIELD_TYPES.NUMBER },
    { field_name: 'target_listening', type: FIELD_TYPES.NUMBER },
    { field_name: 'target_speaking', type: FIELD_TYPES.NUMBER },
    { field_name: 'exam_date', type: FIELD_TYPES.DATE },
    { field_name: 'daily_goal', type: FIELD_TYPES.NUMBER },
  ],
};

const WRITING_TABLE: FeishuTableDef = {
  name: 'Writing',
  fields: [
    { field_name: 'date', type: FIELD_TYPES.DATE },
    { field_name: 'task_type', type: FIELD_TYPES.TEXT },
    { field_name: 'topic', type: FIELD_TYPES.TEXT },
    { field_name: 'word_count', type: FIELD_TYPES.NUMBER },
    { field_name: 'tr_score', type: FIELD_TYPES.NUMBER },
    { field_name: 'cc_score', type: FIELD_TYPES.NUMBER },
    { field_name: 'lr_score', type: FIELD_TYPES.NUMBER },
    { field_name: 'gra_score', type: FIELD_TYPES.NUMBER },
    { field_name: 'overall', type: FIELD_TYPES.NUMBER },
    { field_name: 'error_tags', type: FIELD_TYPES.MULTI_SELECT },
    { field_name: 'error_count', type: FIELD_TYPES.NUMBER },
  ],
};

const READING_TABLE: FeishuTableDef = {
  name: 'Reading',
  fields: [
    { field_name: 'date', type: FIELD_TYPES.DATE },
    { field_name: 'passage', type: FIELD_TYPES.TEXT },
    { field_name: 'total_questions', type: FIELD_TYPES.NUMBER },
    { field_name: 'correct_count', type: FIELD_TYPES.NUMBER },
    { field_name: 'band_estimate', type: FIELD_TYPES.NUMBER },
    { field_name: 'question_types', type: FIELD_TYPES.MULTI_SELECT },
    { field_name: 'error_tags', type: FIELD_TYPES.MULTI_SELECT },
    { field_name: 'error_count', type: FIELD_TYPES.NUMBER },
  ],
};

const LISTENING_TABLE: FeishuTableDef = {
  name: 'Listening',
  fields: [
    { field_name: 'date', type: FIELD_TYPES.DATE },
    { field_name: 'section', type: FIELD_TYPES.NUMBER },
    { field_name: 'total_questions', type: FIELD_TYPES.NUMBER },
    { field_name: 'correct_count', type: FIELD_TYPES.NUMBER },
    { field_name: 'band_estimate', type: FIELD_TYPES.NUMBER },
    { field_name: 'error_tags', type: FIELD_TYPES.MULTI_SELECT },
    { field_name: 'error_count', type: FIELD_TYPES.NUMBER },
  ],
};

const VOCAB_TABLE: FeishuTableDef = {
  name: 'Vocab',
  fields: [
    { field_name: 'date', type: FIELD_TYPES.DATE },
    { field_name: 'reviewed', type: FIELD_TYPES.NUMBER },
    { field_name: 'new_words', type: FIELD_TYPES.NUMBER },
    { field_name: 'correct', type: FIELD_TYPES.NUMBER },
  ],
};

const SPEAKING_TABLE: FeishuTableDef = {
  name: 'Speaking',
  fields: [
    { field_name: 'story_name', type: FIELD_TYPES.TEXT },
    { field_name: 'applicable_topics', type: FIELD_TYPES.MULTI_SELECT },
    { field_name: 'part2_length', type: FIELD_TYPES.NUMBER },
  ],
};

const PLANS_TABLE: FeishuTableDef = {
  name: 'Plans',
  fields: [
    { field_name: 'date', type: FIELD_TYPES.DATE },
    { field_name: 'total_tasks', type: FIELD_TYPES.NUMBER },
    { field_name: 'completed', type: FIELD_TYPES.NUMBER },
    { field_name: 'skipped', type: FIELD_TYPES.NUMBER },
    { field_name: 'modules', type: FIELD_TYPES.MULTI_SELECT },
  ],
};

const SYNC_LOG_TABLE: FeishuTableDef = {
  name: 'Sync Log',
  fields: [
    { field_name: 'synced_at', type: FIELD_TYPES.DATE },
    { field_name: 'module', type: FIELD_TYPES.TEXT },
    { field_name: 'created', type: FIELD_TYPES.NUMBER },
    { field_name: 'updated', type: FIELD_TYPES.NUMBER },
    { field_name: 'skipped', type: FIELD_TYPES.NUMBER },
    { field_name: 'errors', type: FIELD_TYPES.NUMBER },
  ],
};

const ALL_TABLES: FeishuTableDef[] = [
  PROFILE_TABLE, WRITING_TABLE, READING_TABLE, LISTENING_TABLE,
  VOCAB_TABLE, SPEAKING_TABLE, PLANS_TABLE, SYNC_LOG_TABLE,
];

export function getTableDefs(): FeishuTableDef[] {
  return ALL_TABLES.map(t => ({ ...t, fields: [...t.fields] }));
}

export class FeishuTableManager {
  constructor(private client: FeishuClient) {}

  async initialize(): Promise<{ created: string[]; existing: string[]; fieldsAdded: string[] }> {
    const result = { created: [] as string[], existing: [] as string[], fieldsAdded: [] as string[] };

    for (const def of ALL_TABLES) {
      const tables = await this.client.listTables();
      const existing = tables.find((t: any) => t.name === def.name);

      if (existing) {
        result.existing.push(def.name);
        const existingFields = await this.client.listFields(existing.table_id);
        for (const field of def.fields) {
          const hasField = existingFields.some((f: any) => f.field_name === field.field_name);
          if (!hasField) {
            await this.client.createField(existing.table_id, field);
            result.fieldsAdded.push(`${def.name}.${field.field_name}`);
          }
        }
      } else {
        const tid = await this.client.createTable(def.name);
        for (const field of def.fields) {
          await this.client.createField(tid, field);
        }
        result.created.push(def.name);
      }
    }
    return result;
  }
}

export interface Intervention { module: string; errorTag: string; duration: number; instructions: string; successCriteria: string; }
const LIST: Intervention[] = [];
export function getInterventions(errorTag?: string): Intervention[] {
  return errorTag ? LIST.filter(i => i.errorTag === errorTag) : LIST;
}

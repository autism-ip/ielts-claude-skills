const LIST = [];
export function getInterventions(errorTag) {
    return errorTag ? LIST.filter(i => i.errorTag === errorTag) : LIST;
}
//# sourceMappingURL=interventions.js.map
export type TQuestionOption = {
    id: string;
    label: string;
    value: string;
}
export type TQuestionConfig = {
    options: TQuestionOption[];
    key: string;
    hint: string;
}
export type TQuestion = {
    id: string;
    stem: string;
    type: string;
    strand: string;
    config: TQuestionConfig;
}
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




    
    // input: string;
    // answer: string;
    // mark: string;

    // strand: qItem.strand,
    //                 stem: qItem.stem,
    //                 input: entry.response,
    //                 answer: questions.find(item => item.id === entry.questionId),
    //                 mark: qItem.config.key === entry.response,
    //                 hint: qItem.config.hint
}
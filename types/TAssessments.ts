export type TAssessmentsQuestion = {
    questionId: string;
    position: number;
}

export type TAssessments = {
    id: string;
    name: string;
    questions: TAssessmentsQuestion[]
}
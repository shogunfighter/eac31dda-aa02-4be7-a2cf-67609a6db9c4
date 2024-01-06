import { TStudentResponse } from "./TStudentResponse";

export type TStudentResponseQuestion = {
    strand: string;
    stem: string;
    mark: boolean;
    hint?: string;
    questionId?: string;
    
    input?: string;
    inputValue?: string;

    answer?: string;
    answerValue?: string;
}

export type TStudentResponseSummary = {
    strand: string;
    totalMarks: number;
    correctResponses: number;
    totalQuestions: number;
}

export type TSummary = {
    strand: string;
    count: number;
    correct: number;
    wrong: number;
}

export type TResultStudentQuestionSummary = {
    filteredStudentResponses: TStudentResponse[]; 
    processedStudentResponses: TStudentResponseQuestion[][]; 
    summary: TSummary[][], 
}

export type TDiagnosticReportResult = {
    studentName: string;
    assessmentName: string;
    assessmentDate: string | Date;
    questionCount: number;
    questionCorrectCount: number;
    report: string[]
}

export type TProgressReportResult = {
    studentName: string;
    assessmentName: string;
    assessmentCount: number;
    assessmentDates: string[] | Date[];
    questionCount: number;
    questionCorrectCount: number;
    report: string[]
}

export type TFeedbackReportResult = {
    studentName: string;
    assessmentName: string;
    assessmentCount: number;
    assessmentDates: string[] | Date[];
    questionCount: number;
    questionCorrectCount: number;
    report: string[]
}
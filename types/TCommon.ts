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

type TReport = {
    studentName: string;
    report: string[];
}

export type TDiagnosticReportResult = TReport & {
    assessmentDate: string | Date;
    questionCount: number;
    questionCorrectCount: number;
}

export type TProgressReportResult = TReport & {
    assessmentDates: string[] | Date[];
    questionCount: number;
    questionCorrectCount: number;
}

export type TFeedbackReportResult = TReport;
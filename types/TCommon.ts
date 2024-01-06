import { TStudentResponse } from "./TStudentResponse";

export type TStudentResponseQuestion = {
    strand: string;
    mark: boolean;
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
    // processedStudentResponses: TStudentResponseQuestion[][]; 
    summary: any, 
}

export type TDiagnosticReportResult = {
    studentName: string;
    assessmentName: string;
    assessmentDate: string | Date;
    questionCount: number;
    questionCorrectCount: number;
    report: string[]
}
import { TStudent } from "./TStudent";

export type TStudentResponseItem = {
    questionId: string;
    response: string;
}

export type TStudentResponse = {
    id: string;
    assessmentId: string;
    assigned: string;
    started: string;
    completed: string;
    student: Pick<TStudent, "id" | "yearLevel">;
    responses: TStudentResponseItem[];
    results: {
        rawScore: number;
    };
}
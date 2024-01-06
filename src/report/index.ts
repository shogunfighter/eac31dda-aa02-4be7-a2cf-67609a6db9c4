import fetch from 'node-fetch';
import { TStudent } from '../../types/TStudent';
import { TAssessments } from '../../types/TAssessments';
import { TStudentResponse } from '../../types/TStudentResponse';
import { TQuestion } from '../../types/TQuestion';
import { TDiagnosticReportResult, TResultStudentQuestionSummary, TStudentResponseQuestion, TStudentResponseSummary, TSummary } from '../../types/TCommon';
// const fetch = require('node-fetch');

const urlPath = "http://localhost:3001/data";

const findStudent = async (studentId: string): Promise<TStudent | null> => {
    const url = urlPath + "/students.json";

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Encountered error while fetching student with id: ${studentId}`);

    const result: TStudent[] = await response.json();
    return result.find((student) => student.id === studentId) || null;
}

// need to only request once for the question as bulk since it is quite inefficient if we keep requesting data again and again
// const findQuestion = async (questionid: string) => {
//     const url = urlPath + "/questions.json";

//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`Encountered error while fetching question with id: ${questionid}`);

//     const result: TQuestion[] = await response.json();
//     return result.find((question) => question.id === questionid) || null;
// }




// // assume
// const filterAndSelectQuestionId = (questionArray: TQuestion[], questionName: string, questionNumbers: string[]): TQuestion[] => {
//     const questionId = questionNumbers.map(qNum => (questionName + qNum));
//     return questionArray.filter(question => questionId.includes(question.id));
// }

// // assume
// const findQuestionList = async (questionName: string, questionNumber: string[]) => {
//     const url = urlPath + "/questions.json";

//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`Encountered error while fetching question list`);

//     const result: TQuestion[] = await response.json();
//     return filterAndSelectQuestionId(result, questionName, questionNumber);
// }



async function findStudentQuestionSummary(studentId: string) {
    const result: TResultStudentQuestionSummary = {
        filteredStudentResponses: [],
        // processedStudentResponses: [],
        summary: undefined
    };

    const questionUrl = urlPath + "/questions.json";
    const studentResponsesUrl = urlPath + "/student-responses.json";
    const [questionFetchResponse, studentResponsesFetchResponse] = await Promise.all([
        fetch(questionUrl),
        fetch(studentResponsesUrl)
    ])

    if (!questionFetchResponse.ok) throw new Error(`Encountered error while fetching questions`);
    if (!studentResponsesFetchResponse.ok) throw new Error(`Encountered error while fetching student reponses`);

    const questions: TQuestion[] = await questionFetchResponse.json();
    const studentResponses: TStudentResponse[] = await studentResponsesFetchResponse.json();

    // completed student responses
    result.filteredStudentResponses = studentResponses.filter(item => (item?.completed && item?.student?.id === studentId));
    // console.log("xxxxxxxxxxx result.filteredStudentResponses:", result.filteredStudentResponses);

    // map questions with student responses (strand/mark)
    const processedStudentResponses:TStudentResponseQuestion[][] = result.filteredStudentResponses
        .filter(item => item.completed && item.student.id === studentId)
        .map(item => item.responses.map(entry => {
            const qItem = questions.find(q => q.id === entry.questionId);
            if (qItem) {
                return {
                    strand: qItem.strand,
                    mark: qItem.config.key === entry.response,
                }
            }
            else {
                throw Error(`Unable to handle entry.questionId ${entry.questionId}`);
            }
        }));

    // summarize the data per array (strand=> correct/wrong)
    if (processedStudentResponses?.length > 0) {
        result.summary = processedStudentResponses.map((block) =>
            block.reduce(
                (acc: TSummary[], current) => {
                    const strandIndex = acc.findIndex((entry) => entry.strand === current.strand);
                    if (strandIndex !== -1) {
                        acc[strandIndex].count++;
                        current.mark
                            ? acc[strandIndex].correct++
                            : acc[strandIndex].wrong++;
                    }
                    else {
                        acc.push({
                            strand: current.strand,
                            count: 1,
                            correct: current.mark ? 1 : 0,
                            wrong: current.mark ? 0 : 1
                        });
                    }

                    return acc;
                },
                []
            )
        );
    }
    // console.log("xxxxxxxxxxx result:", JSON.stringify(result, null, 2));

    return result;
}

async function findStudentResponses(studentId: string): Promise<TStudentResponse[]> {
        const url = urlPath + "/student-responses.json";

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Encountered error while fetching student-responses`);

    const result: TStudentResponse[] = await response.json();

    return (result?.length > 0) 
        ? result.filter(item => (!!item?.completed && item?.student?.id === studentId))
        : [];
}

async function diagnosticReport(studentId: string) {
    // # template
    // Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM
    // He got 15 questions right out of 16. Details by strand given below:

    // Numeracy and Algebra: 5 out of 5 correct
    // Measurement and Geometry: 7 out of 7 correct
    // Statistics and Probability: 3 out of 4 correct 

    // student name, assessment name, assessment date, total number of given questions, total number of questions (correct), 

    let result: TDiagnosticReportResult = {
        studentName: '',
        assessmentName: '',
        assessmentDate: '',
        questionCount: 0,
        questionCorrectCount: 0,
        report: []
    };

    const student = await findStudent(studentId); // identify the student details
    if (!student) throw new Error(`[Aborting] Unable to find student record: ${studentId}`);

    result.studentName = [student.firstName, student.lastName].join(" ").trim();

    const resultStudentQuestionSummary = await findStudentQuestionSummary(studentId);

    // console.log("resultStudentQuestionSummary:", resultStudentQuestionSummary);

    resultStudentQuestionSummary.filteredStudentResponses.map((response, id) => {

        result.assessmentDate = response.completed; // todo: use momentjs or any date framework

        const summary: TSummary[] = resultStudentQuestionSummary.summary[id];

        result.questionCount = summary
            .map(item => item.count)
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );

        result.questionCorrectCount = summary
            .map(item => item.correct)
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );

        result.report.push(`${result.studentName} recently completed Numeracy assessment on ${result.assessmentDate}`);
        result.report.push(`He got ${result.questionCorrectCount} questions right out of ${result.questionCount}. Details by strand given below:`);

        console.log("summary:", JSON.stringify(summary, null, 2));

        summary.map(summaryItem => {
            result.report.push(`${summaryItem.strand}: ${summaryItem.correct} out of ${summaryItem.count} correct`);
        })

        result.report.push("\n");
    })

    console.log(result.report.join("\n"));
}

async function progressReport(studentId: string) {

    // # template
    // Tony Stark has completed Numeracy assessment 3 times in total. Date and raw score given below:

    // Date: 14th December 2019, Raw Score: 6 out of 16
    // Date: 14th December 2020, Raw Score: 10 out of 16
    // Date: 14th December 2021, Raw Score: 15 out of 16

    // Tony Stark got 9 more correct in the recent completed assessment than the oldest
}

async function feedbackReport(studentId: string) {

    // # template
    // Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM
    // He got 15 questions right out of 16. Feedback for wrong answers given below

    // Question: What is the 'median' of the following group of numbers 5, 21, 7, 18, 9?
    // Your answer: A with value 7
    // Right answer: B with value 9
    // Hint: You must first arrange the numbers in ascending order. The median is the middle term, which in this case is 9
}

export {
    diagnosticReport,
    progressReport,
    feedbackReport
}
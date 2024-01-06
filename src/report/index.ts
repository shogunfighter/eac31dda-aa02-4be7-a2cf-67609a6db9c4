import fetch from 'node-fetch';
import { TStudent } from '../../types/TStudent';
import { TStudentResponse } from '../../types/TStudentResponse';
import { TQuestion } from '../../types/TQuestion';
import { TDiagnosticReportResult, TFeedbackReportResult, TProgressReportResult, TResultStudentQuestionSummary, TStudentResponseQuestion, TStudentResponseSummary, TSummary } from '../../types/TCommon';
import { dateFormatDisplay, findItemWithLatestCompletedDate, findItemWithOldestCompletedDate } from '../util';

import dotenv from 'dotenv';
dotenv.config();

const urlPath = `http://localhost:${process.env.JSON_SERVER_PORT}/data`;

/**
 * 
 * @param {string} studentId 
 * @returns {Promise<TStudent | null>}
 */
const findStudent = async (studentId: string): Promise<TStudent | null> => {
    try {
        const url = urlPath + "/students.json";

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Encountered error while fetching student with id: ${studentId}`);

        const result: TStudent[] = await response.json();
        return result.find((student) => student.id === studentId) || null;
    }
    catch (error) {
        throw new Error("An error was encountered (findStudent)");
    }
}

/**
 * 
 * @param {string} studentId 
 * @returns {Promise<TResultStudentQuestionSummary>}
 */
async function findStudentQuestionSummary(studentId: string): Promise<TResultStudentQuestionSummary> {
	try {
        const result: TResultStudentQuestionSummary = {
            filteredStudentResponses: [],
            processedStudentResponses: [],
            summary: []
        };
    
        const questionUrl = urlPath + "/questions.json";
        const studentResponsesUrl = urlPath + "/student-responses.json";
        const [questionFetchResponse, studentResponsesFetchResponse] = await Promise.all([
            fetch(questionUrl),
            fetch(studentResponsesUrl)
        ]);
    
        if (!questionFetchResponse.ok) throw new Error(`Encountered error while fetching questions`);
        if (!studentResponsesFetchResponse.ok) throw new Error(`Encountered error while fetching student reponses`);
    
        const questions: TQuestion[] = await questionFetchResponse.json();
        const studentResponses: TStudentResponse[] = await studentResponsesFetchResponse.json();
    
        // completed student responses
        result.filteredStudentResponses = studentResponses.filter(item => (item?.completed && item?.student?.id === studentId));
        // console.log("xxxxxxxxxxx result.filteredStudentResponses:", result.filteredStudentResponses);
    
        // map questions with student responses (strand/mark)
        result.processedStudentResponses = result.filteredStudentResponses
            .filter(item => item.completed && item.student.id === studentId)
            .map(item => item.responses.map(entry => {
                const qItem = questions.find(q => q.id === entry.questionId);
                if (qItem) {

                    const { options, key, hint } = qItem?.config;
                    const questionOption = options.find(item => item.id === key);
                    const inputOption = options.find(item => item.id === entry.response);

                    let result: TStudentResponseQuestion = {
                        questionId: entry.questionId,
                        
                        strand: qItem.strand,
                        stem: qItem.stem,
                        mark: qItem.config.key === entry.response,
                        hint: qItem.config.hint,

                        input: inputOption?.label,
                        inputValue: inputOption?.value,

                        answer: questionOption?.label,
                        answerValue: questionOption?.value,
                    };

                    return result;
                }
                else {
                    throw Error(`Unable to handle entry.questionId ${entry.questionId}`);
                }
            }));
    
        // summarize the data per array (strand=> correct/wrong)
        if (result.processedStudentResponses?.length > 0) {
            result.summary = result.processedStudentResponses.map((block) =>
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
    catch (error) {
        throw new Error("An error was encountered (findStudentQuestionSummary)");
    }
}

/**
 * 
 * @param {string} studentId 
 */
export async function diagnosticReport(studentId: string): Promise<TDiagnosticReportResult> {
    try {
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
    
        const {filteredStudentResponses, summary} = await findStudentQuestionSummary(studentId);
    
        // find the item having the latest completed (date)
        const tItem = findItemWithLatestCompletedDate(filteredStudentResponses);
        const tId = filteredStudentResponses.indexOf(tItem);
    
        if (tItem) {
            result.assessmentDate = tItem.completed; // todo: use momentjs or any date framework
    
            result.questionCount = summary[tId]
                .map(item => item.count)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
            result.questionCorrectCount = summary[tId]
                .map(item => item.correct)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
            result.report.push(`${result.studentName} recently completed Numeracy assessment on ${dateFormatDisplay(result.assessmentDate)}`);
            result.report.push(`${result.studentName} got ${result.questionCorrectCount} questions right out of ${result.questionCount}. Details by strand given below:`); // Assumption: I changed the text - "He" with the real name 
    
            summary[tId].map(summaryItem => {
                result.report.push(`${summaryItem.strand}: ${summaryItem.correct} out of ${summaryItem.count} correct`);
            });
    
            result.report.push("\n");
        }
    
        console.log(result.report.join("\n"));
        return result;
    }
    catch (error) {
        throw new Error("An error was encountered (diagnosticReport)");
    }
}

export async function progressReport(studentId: string): Promise<TProgressReportResult> {
    try {
        let result: TProgressReportResult = {
            studentName: '',
            assessmentCount: 0,
            assessmentName: '',
            assessmentDates: [],
            questionCount: 0,
            questionCorrectCount: 0,
            report: []
        };
    
        const student = await findStudent(studentId); // identify the student details
        if (!student) throw new Error(`[Aborting] Unable to find student record: ${studentId}`);
    
        result.studentName = [student.firstName, student.lastName].join(" ").trim();
    
        const {filteredStudentResponses, summary} = await findStudentQuestionSummary(studentId);
    
        result.report.push(`${result.studentName} has completed Numeracy assessment ${filteredStudentResponses.length} times in total. Date and raw score given below:`);
    
        result.assessmentDates = filteredStudentResponses.map(item => item.completed);
    
        filteredStudentResponses.map((studentResponse, id) => {
            result.questionCount = summary[id]
                .map(item => item.count)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
            result.questionCorrectCount = summary[id]
                .map(item => item.correct)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                
            result.report.push(`Date: ${dateFormatDisplay(studentResponse.completed)}, Raw Score: ${studentResponse.results.rawScore} out of ${result.questionCount}`);
        })
    
        // we only add this desciption when there's more than 1 filtered record
        if (filteredStudentResponses.length > 1) {
            const tItemLatestDate = findItemWithLatestCompletedDate(filteredStudentResponses);
            const tItemOldestDate = findItemWithOldestCompletedDate(filteredStudentResponses);
    
            const latestRawScore = tItemLatestDate.results.rawScore;
            const oldestRawScore = tItemOldestDate.results.rawScore;
    
            if (latestRawScore > oldestRawScore) {
                let str = (latestRawScore > oldestRawScore)
                    ? `${result.studentName} got ${latestRawScore - oldestRawScore} more correct in the recent completed assessment than the oldest` // Assumption: I changed the text - "He" with the real name 
                    : (latestRawScore < oldestRawScore)
                        ? `${result.studentName} got ${oldestRawScore - latestRawScore} less correct in the recent completed assessment than the oldest` // Assumption: I changed the text - "He" with the real name 
                        : `${result.studentName} got equal markings compared to the oldest which is ${latestRawScore}`; // Assumption: I changed the text - "He" with the real name 
                result.report.push(str);
            }
        }
    
        console.log(result.report.join("\n"));
        return result;
    }
    catch (error) {
        throw new Error("An error was encountered (progressReport)");
    }
}

export async function feedbackReport(studentId: string): Promise<TFeedbackReportResult> {
    try {
        let result: TFeedbackReportResult = {
            studentName: '',
            assessmentCount: 0,
            assessmentName: '',
            assessmentDates: [],
            questionCount: 0,
            questionCorrectCount: 0,
            report: []
        };
    
        const student = await findStudent(studentId); // identify the student details
        if (!student) throw new Error(`[Aborting] Unable to find student record: ${studentId}`);
    
        result.studentName = [student.firstName, student.lastName].join(" ").trim();
    
        const {filteredStudentResponses, processedStudentResponses} = await findStudentQuestionSummary(studentId);
    
        const tItemLatestDate = findItemWithLatestCompletedDate(filteredStudentResponses);
        const tIdLatestDate = filteredStudentResponses.indexOf(tItemLatestDate);
    
        result.report.push(`${result.studentName} recently completed Numeracy assessment on ${dateFormatDisplay(tItemLatestDate.completed)}`);
    
        // todo: question count - replace it?
        result.report.push(`${result.studentName} got ${tItemLatestDate.results.rawScore} questions right out of ${tItemLatestDate.responses.length}. Feedback for wrong answers given below`); // Assumption: I changed the text - "He" with the real name 
    
        // console.log("XXXXXXXXXXXXXXXXXX tItemLatestDate:", JSON.stringify(tItemLatestDate, null, 2));
        // console.log("XXXXXXXXXXXXXXXXXX filteredStudentResponses:", JSON.stringify(filteredStudentResponses, null, 2));
        // console.log("XXXXXXXXXXXXXXXXXX filteredStudentResponses processedStudentResponses[tIdLatestDate]:", JSON.stringify(processedStudentResponses[tIdLatestDate], null, 2));
    
        // strand: qItem.strand,
        // stem: qItem.stem,
        // input: entry.response,
        // answer: questions.find(item => item.id === entry.questionId),
        // mark: qItem.config.key === entry.response,
        // hint: qItem.config.hint

        processedStudentResponses[tIdLatestDate]
            .filter(item => item.mark === false)
            .forEach(item => {
                result.report.push(`Question: ${item.stem}`);
                result.report.push(`Your answer: ${item.input} with value ${item.inputValue}`);
                result.report.push(`Right answer: ${item.answer} with value ${item.answerValue}`);
                result.report.push(`Hint: ${item.hint}`);
            })
    
        console.log(result.report.join("\n"));
        return result;
    
        // # template
        // Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM
        // He got 15 questions right out of 16. Feedback for wrong answers given below
    
        // Question: What is the 'median' of the following group of numbers 5, 21, 7, 18, 9?
        // Your answer: A with value 7
        // Right answer: B with value 9
        // Hint: You must first arrange the numbers in ascending order. The median is the middle term, which in this case is 9
    }
    catch (error) {
        throw new Error("An error was encountered (feedbackReport)");
    }
}
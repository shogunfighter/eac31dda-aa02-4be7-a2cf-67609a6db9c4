import { diagnosticReport, feedbackReport, findStudent, findStudentQuestionSummary, progressReport } from ".";
import fetch, { Response } from 'node-fetch';

import studentRecords from "../../server/data/students.json";
import questionRecords from "../../server/data/questions.json";
import studentResponsesRecords from "../../server/data/student-responses.json";

// processed
import findStudentQuestionSummaryResult from "../../__mock__/findStudentQuestionSummaryResult.json";
import { TDiagnosticReportResult, TFeedbackReportResult, TProgressReportResult } from "../../types/TCommon";

jest.mock('node-fetch', () => jest.fn());

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('index', () => {
  describe('findStudent', () => {
    beforeEach(() => {
      // Clear all instances and calls to fetch function before each test
      mockFetch.mockClear();
    });

    it("should `studentId` exist in the list of students, return the student record", async () => {
      const json = jest.fn() as jest.MockedFunction<any>;
      json.mockResolvedValue(studentRecords);
      mockFetch.mockResolvedValue({ ok: true, json } as Response);

      const studentId = "student1";
      const result = await findStudent(studentId);

      expect(result).toEqual(studentRecords.find(i => i.id === studentId));
      expect(json.mock.calls.length).toBe(1);
    })

    it("should throw error when fetch NOT ok", async () => {
      const json = jest.fn() as jest.MockedFunction<any>;
      json.mockResolvedValue(studentRecords);
      mockFetch.mockResolvedValue({ ok: false, json } as Response); // ok=false ; we mock fetch

      const studentId = "student2";
      await expect(findStudent(studentId)).rejects.toThrow(`Encountered error while fetching student with id: ${studentId}`);
    })

    it("should return `undefined` when student record is not found", async () => {
      const json = jest.fn() as jest.MockedFunction<any>;
      json.mockResolvedValue(studentRecords);
      mockFetch.mockResolvedValue({ ok: true, json } as Response);

      const studentId = "studentDUMMY"; // this studentId does not exist in the mocked json
      const result = await findStudent(studentId);
      await expect(result).toBeUndefined();
    })

  })

  describe("findStudentQuestionSummary", () => {
    beforeEach(() => {
      // Clear all instances and calls to fetch function before each test
      mockFetch.mockClear();
    });

    it("should fetch `questions` and `student-responses` and return result", async () => {
      const json1 = jest.fn() as jest.MockedFunction<any>;
      const json2 = jest.fn() as jest.MockedFunction<any>;

      json1.mockResolvedValue(questionRecords);
      json2.mockResolvedValue(studentResponsesRecords);

      mockFetch.mockResolvedValueOnce({ ok: true, json: json1 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json2 } as Response);

      const studentId = "student1";
      const result = await findStudentQuestionSummary(studentId);
      expect(result).toEqual(findStudentQuestionSummaryResult);
    });
  })

  describe("report generation", () => {
    beforeEach(() => {
      // Clear all instances and calls to fetch function before each test
      mockFetch.mockClear();
    });

    it("diagnostic report generation", async () => {
      jest.mock(".", () => ({
        findStudent: jest.fn().mockResolvedValue(studentRecords.find(s => s.id === studentId)),
        findStudentQuestionSummary: jest.fn().mockResolvedValue(findStudentQuestionSummaryResult),
        findItemWithLatestCompletedDate: jest.fn()
      }))

      const json1 = jest.fn() as jest.MockedFunction<any>; // fetch under `findStudent` (students.json)
      const json2 = jest.fn() as jest.MockedFunction<any>; // fetch 1 under `findStudentQuestionSummary` (questions.json)
      const json3 = jest.fn() as jest.MockedFunction<any>; // fetch 2 under `findStudentQuestionSummary` (student-responses.json)

      json1.mockResolvedValue(studentRecords);
      json2.mockResolvedValue(questionRecords);
      json3.mockResolvedValue(studentResponsesRecords);

      mockFetch.mockResolvedValueOnce({ ok: true, json: json1 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json2 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json3 } as Response);

      const studentId = "student1";

      const result:TDiagnosticReportResult = await diagnosticReport(studentId);

      // {
      //    "studentName": "Tony Stark",
      //    "assessmentDate": "16/12/2021 10:46:00",
      //    "questionCount": 16,
      //    "questionCorrectCount": 15,
      //    "report": [
      //      "Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46:00",
      //      "Tony Stark got 15 questions right out of 16. Details by strand given below:",
      //      "Number and Algebra: 5 out of 5 correct",
      //      "Measurement and Geometry: 7 out of 7 correct",
      //      "Statistics and Probability: 3 out of 4 correct"
      //    ]
      // }

      expect(result.studentName).toEqual("Tony Stark");
      expect(result.assessmentDate).toEqual("16/12/2021 10:46:00");
      expect(result.questionCount).toEqual(16);
      expect(result.questionCorrectCount).toEqual(15);
      expect(result.report).toBeInstanceOf(Array);
      expect(result.report.length).toBeGreaterThan(0);
    })

    it("progress report generation", async () => {
      jest.mock(".", () => ({
        findStudent: jest.fn().mockResolvedValue(studentRecords.find(s => s.id === studentId)),
        findStudentQuestionSummary: jest.fn().mockResolvedValue(findStudentQuestionSummaryResult),
        findItemWithLatestCompletedDate: jest.fn()
      }))

      const json1 = jest.fn() as jest.MockedFunction<any>; // fetch under `findStudent` (students.json)
      const json2 = jest.fn() as jest.MockedFunction<any>; // fetch 1 under `findStudentQuestionSummary` (questions.json)
      const json3 = jest.fn() as jest.MockedFunction<any>; // fetch 2 under `findStudentQuestionSummary` (student-responses.json)

      json1.mockResolvedValue(studentRecords);
      json2.mockResolvedValue(questionRecords);
      json3.mockResolvedValue(studentResponsesRecords);

      mockFetch.mockResolvedValueOnce({ ok: true, json: json1 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json2 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json3 } as Response);

      const studentId = "student1";

      const result:TProgressReportResult = await progressReport(studentId);

      // {
      //   "studentName": "Tony Stark",
      //   "assessmentDates": [
      //     "16/12/2019 10:46:00",
      //     "16/12/2020 10:46:00",
      //     "16/12/2021 10:46:00"
      //   ],
      //   "questionCount": 16,
      //   "questionCorrectCount": 15,
      //   "report": [
      //     "Tony Stark has completed Numeracy assessment 3 times in total. Date and raw score given below:",
      //     "Date: 16th December 2019 10:46:00, Raw Score: 6 out of 16",
      //     "Date: 16th December 2020 10:46:00, Raw Score: 10 out of 16",
      //     "Date: 16th December 2021 10:46:00, Raw Score: 15 out of 16",
      //     "Tony Stark got 9 more correct in the recent completed assessment than the oldest"
      //   ]
      // }

      expect(result.studentName).toEqual("Tony Stark");

      expect(result.assessmentDates).toBeInstanceOf(Array);
      expect(result.assessmentDates.length).toBeGreaterThan(0);

      expect(result.questionCount).toEqual(16);
      expect(result.questionCorrectCount).toEqual(15);

      expect(result.report).toBeInstanceOf(Array);
      expect(result.report.length).toBeGreaterThan(0);
    })

    it("feedback report generation", async () => {
      jest.mock(".", () => ({
        findStudent: jest.fn().mockResolvedValue(studentRecords.find(s => s.id === studentId)),
        findStudentQuestionSummary: jest.fn().mockResolvedValue(findStudentQuestionSummaryResult),
        findItemWithLatestCompletedDate: jest.fn()
      }))

      const json1 = jest.fn() as jest.MockedFunction<any>; // fetch under `findStudent` (students.json)
      const json2 = jest.fn() as jest.MockedFunction<any>; // fetch 1 under `findStudentQuestionSummary` (questions.json)
      const json3 = jest.fn() as jest.MockedFunction<any>; // fetch 2 under `findStudentQuestionSummary` (student-responses.json)

      json1.mockResolvedValue(studentRecords);
      json2.mockResolvedValue(questionRecords);
      json3.mockResolvedValue(studentResponsesRecords);

      mockFetch.mockResolvedValueOnce({ ok: true, json: json1 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json2 } as Response);
      mockFetch.mockResolvedValueOnce({ ok: true, json: json3 } as Response);

      const studentId = "student1";

      const result:TFeedbackReportResult = await feedbackReport(studentId);

      // {
      //   "studentName": "Tony Stark",
      //   "report": [
      //     "Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46:00",
      //     "Tony Stark got 15 questions right out of 16. Feedback for wrong answers given below",
      //     "Question: What is the 'median' of the following group of numbers 5, 21, 7, 18, 9?",
      //     "Your answer: A with value 7",
      //     "Right answer: B with value 9",
      //     "Hint: You must first arrange the numbers in ascending order. The median is the middle term, which in this case is 9"
      //   ]
      // }

      expect(result.studentName).toEqual("Tony Stark");
      expect(result.report).toBeInstanceOf(Array);
      expect(result.report.length).toBeGreaterThan(0);
    })

  })

})
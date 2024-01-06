export const diagnosticReport = async () => {

// # template
// Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM
// He got 15 questions right out of 16. Details by strand given below:

// Numeracy and Algebra: 5 out of 5 correct
// Measurement and Geometry: 7 out of 7 correct
// Statistics and Probability: 3 out of 4 correct 

    const studentName = "Tony Stark";
    const assessmentName = "Numeracy";
    const assessmentDate = "16th December 2021 10:46 AM";

    const str = `${studentName} recently completed ${assessmentName} assessment on ${assessmentDate}`;

}

export const progressReport = async () => {

// # template
// Tony Stark has completed Numeracy assessment 3 times in total. Date and raw score given below:

// Date: 14th December 2019, Raw Score: 6 out of 16
// Date: 14th December 2020, Raw Score: 10 out of 16
// Date: 14th December 2021, Raw Score: 15 out of 16

// Tony Stark got 9 more correct in the recent completed assessment than the oldest
}

export const feedbackReport = async () => {

// # template
// Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM
// He got 15 questions right out of 16. Feedback for wrong answers given below

// Question: What is the 'median' of the following group of numbers 5, 21, 7, 18, 9?
// Your answer: A with value 7
// Right answer: B with value 9
// Hint: You must first arrange the numbers in ascending order. The median is the middle term, which in this case is 9
}
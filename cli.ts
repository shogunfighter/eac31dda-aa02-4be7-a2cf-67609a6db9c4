// import yargs, { CommandModule } from "yargs";
// import { generateDiagnostic } from "./cli";

// if they want to separate the cli commands, we need to do like this
// const diagnosticCommand: CommandModule = {
//     command: "diagnostic",
//     describe: "A diagnostic report which tells the student where they might have areas of weakness",
//     builder: {
//         studentId: {
//             demandOption: true,
//             description: "student identifier",
//             type: "string"
//         }
//     },
//     handler: async (args: any) => {
//         await generateDiagnostic(args.studentId);
//     }
// }

import yargs from 'yargs';
import { diagnosticReport } from './src/report';
// import { diagnosticReport, feedbackReport, progressReport } from './src/report';

async function runCLI() {
    const args = await yargs
        .option('studentId', {
            describe: 'Student identifier', // formatting: (i.e., student1, student2)
            demandOption: true,
            type: 'string',
        })
        .option('reportType', {
            describe: 'Type of report to generate: (1=diagnostic, 2=progress, 3=feedback)',
            demandOption: true,
            type: 'number',
        }).argv;

    console.log("studentId:", args.studentId);
    console.log("reportType:", args.reportType);

    const studentId = args.studentId;
    const reportType = args.reportType;

    switch (reportType) {
        // # diagnostic report
        case 1:
            console.log(`running diagnosticReport for ${studentId}`);
            await diagnosticReport(studentId);
        break;
        // # progress report
        case 2:
            console.log(`running progressReport for ${studentId}`);
            // await progressReport(studentId);
            break;
        // # feedback report
        case 3:
            console.log(`running feedbackReport for ${studentId}`);
            // await feedbackReport(studentId);
            break;
        default: throw new Error("Unidentified report type, please only use any of the following: (1=diagnostic, 2=progress, 3=feedback)");
    }
}

runCLI();
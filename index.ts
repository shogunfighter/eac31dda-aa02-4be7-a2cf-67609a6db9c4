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

async function runCLI() {
    const args = await yargs
        .option('studentId', {
            describe: 'Student identifier',
            demandOption: true,
            type: 'number',
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
        // A diagnostic report which tells the student where they might have areas of weakness
        case 1:
            console.log("1x");
            break;
        // A progress report which tells the student how much they have improved over the year
        case 2:
            console.log("2x");
            break;
        // A feedback report providing information about where a student went wrong on individual questions and offers hints on how to answer these questions correctly
        case 3:
            console.log("3x");
            break;
        default: throw new Error("Unidentified report type, please only use any of the following: (1=diagnostic, 2=progress, 3=feedback)");
    }
}

runCLI();
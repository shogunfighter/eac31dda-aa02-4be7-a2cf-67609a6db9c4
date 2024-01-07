### Instructions
```
1. clone the project

2. install packages
$ npm i

3. serve static json files - make sure to run the json server to run the application
$ npm run json-server

4.a generate report using template (targetting `student1`)
$ npm run report-diagnostic-student1
$ npm run report-progress-student1
$ npm run report-feedback-student1

4.b generate report using CLI
$ npm run app -- --reportType 1 --studentId student1    // run `diagnostic` for studentId(student1)
$ npm run app -- --reportType 2 --studentId student1    // run `progress` for studentId(student1)
$ npm run app -- --reportType 3 --studentId student1    // run `feedback` for studentId(student1)

5. when you want to run tests
$ npm run test
```
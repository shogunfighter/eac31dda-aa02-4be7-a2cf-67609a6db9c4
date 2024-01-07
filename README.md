### Instructions
```
// install node_modules packages
$ npm i

// serve static json files - make sure to run the json server to run the application
$ npm run json-server

// run tests
$ npm run test
```

### Run static JSON server
```
$ npm run json-server
```

### Example generating report (student 1)
```
$ npm run report-diagnostic-student1
$ npm run report-progress-student1
$ npm run report-feedback-student1
```

### Example standalone run (change target `studentId`)
```
// run diagnostic for studentId(student1)
$ npm run app -- --reportType 1 --studentId student1

// run progress for studentId(student1)
$ npm run app -- --reportType 2 --studentId student1

// run feedback for studentId(student1)
$ npm run app -- --reportType 3 --studentId student1
```
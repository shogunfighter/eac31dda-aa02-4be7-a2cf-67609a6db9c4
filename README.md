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

### Example run
```
// run diagnostic for studentId(student1)
$ npm run app -- --reportType 1 --studentId student1

// run progress for studentId(student1)
$ npm run app -- --reportType 2 --studentId student1

// run feedback for studentId(student1)
$ npm run app -- --reportType 3 --studentId student1
```
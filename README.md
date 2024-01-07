### Instructions
```
1. clone the project

2. install packages (app)
$ cd ./
$ npm i

3. install packages (json server - to host json files statically in preparation for api requests)
$ cd ./server
$ npm i

4. serve static json files - make sure to run the json server to run the application
$ cd ./server
$ npm run json-server

5. requires to have the json-server running (see step 3-4)

5a. generate report using template (targetting `student1`)
$ npm run report-diagnostic-student1
$ npm run report-progress-student1
$ npm run report-feedback-student1

5b. generate report using CLI
$ npm run app -- --reportType 1 --studentId student1    // run `diagnostic` for studentId(student1)
$ npm run app -- --reportType 2 --studentId student1    // run `progress` for studentId(student1)
$ npm run app -- --reportType 3 --studentId student1    // run `feedback` for studentId(student1)

6. when you want to run tests
$ npm run test

7. if you have issues running this, just call me. :)
```
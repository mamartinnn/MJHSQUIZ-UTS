const { Schema, model } = require('mongoose');
const questionSchema = require('./question'); // or directly use the schema definition

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  questions: [questionSchema] // embed the questions directly
});

const Subject = model('Subject', subjectSchema);
module.exports = Subject;

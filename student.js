const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    application_no: String,
    password: String,

    student_name: String,
    father_name: String,
    mother_name: String,

    date_of_birth: String,
    gender: String,
    nationality: String,
    address: String,

    category: String,

    result_pdf: String
});

module.exports = mongoose.model("Student", studentSchema);
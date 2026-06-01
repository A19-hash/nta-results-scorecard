const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    application_no: String,

    password: String,

    student_name: String,

    result_pdf: String,

    email: String,

    otp: String
});

module.exports = mongoose.model("Student", studentSchema);
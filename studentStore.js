const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "students.json");

function loadStudents() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }

    const raw = fs.readFileSync(dataPath, "utf8").trim();
    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new Error(`Failed to parse student data: ${error.message}`);
    }
}

function saveStudents(students) {
    fs.writeFileSync(dataPath, JSON.stringify(students, null, 2), "utf8");
}

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function listStudents() {
    const students = loadStudents();
    return students.sort((a, b) => {
        const nameCompare = String(a.student_name || "").localeCompare(String(b.student_name || ""), undefined, { sensitivity: "base" });
        if (nameCompare !== 0) {
            return nameCompare;
        }
        return String(a.application_no || "").localeCompare(String(b.application_no || ""), undefined, { sensitivity: "base" });
    });
}

async function findStudent(id) {
    const students = loadStudents();
    return students.find((student) => student._id === id) || null;
}

async function findStudentForLogin(applicationNo, password) {
    const students = loadStudents();
    return students.find(
        (student) => student.application_no === applicationNo && student.password === password
    ) || null;
}

async function createStudent(data) {
    const students = loadStudents();
    const newStudent = {
        _id: generateId(),
        application_no: data.application_no || "",
        password: data.password || "",
        student_name: data.student_name || "",
        father_name: data.father_name || "",
        mother_name: data.mother_name || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        nationality: data.nationality || "",
        address: data.address || "",
        category: data.category || "",
        result_pdf: data.result_pdf || "",
        email: data.email || "",
    };

    students.push(newStudent);
    saveStudents(students);
    return newStudent;
}

async function updateStudent(id, data) {
    const students = loadStudents();
    const index = students.findIndex((student) => student._id === id);
    if (index === -1) {
        return null;
    }

    students[index] = {
        ...students[index],
        ...data,
        _id: students[index]._id,
    };

    saveStudents(students);
    return students[index];
}

async function deleteStudent(id) {
    const students = loadStudents();
    const filtered = students.filter((student) => student._id !== id);
    saveStudents(filtered);
}

module.exports = {
    createStudent,
    deleteStudent,
    findStudent,
    findStudentForLogin,
    listStudents,
    updateStudent,
};

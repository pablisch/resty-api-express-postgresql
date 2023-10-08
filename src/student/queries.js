const getStudents = 'SELECT * FROM students';
const getStudentById = 'SELECT * FROM students WHERE id = $1';
const checkEmailExists = 'SELECT * FROM students WHERE email = $1';
const addStudent = 'INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4)';
const deleteStudent = "DELETE FROM students WHERE id = $1";
// the update query is constructed in the controller using req.body data

module.exports = {
  getStudents,
  getStudentById,
  checkEmailExists,
  addStudent,
  deleteStudent,
};

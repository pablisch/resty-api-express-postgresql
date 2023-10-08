const { raw } = require('express');
const pool = require('../../db');
const queries = require('./queries');

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
}

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getStudentById, [id], (error, results) => {
    console.log(id);
    if (error) throw error;
    res.status(200).json(results.rows);
  });
}

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;

  // check if email exists
  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (error) throw error;
    if (results.rows.length) {
      res.send("That email already exists.");
    } else {
      pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
        console.log(name, email, age, dob);
        if (error) throw error;
        res.status(201).send(`Entry created successfully for ${name}.`);
      });
    }
  });
}

const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);

  // check if ID exists
  pool.query(queries.getStudentById, [id], (error, results) => {
    if (error) throw error;
    if (!results.rows.length) {
      res.send("No student with that ID currently exists.");
    } else {
      pool.query(queries.deleteStudent, [id], (error, results) => {
        if (error) throw error;
        res.status(202).send(`Student ${id} has been deleted from the system.`);
      });
    }
  });
}

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  
  // check if ID exists
  pool.query(queries.getStudentById, [id], (error, results) => {
    if (error) throw error;
    if (!results.rows.length) {
      res.send("No student with that ID currently exists.");
    } else {

      const { name, email, age, dob } = req.body;
      const fieldsToUpdate = [];

      if (name) fieldsToUpdate.push(`name = '${name}'`);
      if (email) fieldsToUpdate.push(`email = '${email}'`);
      if (age) fieldsToUpdate.push(`age = '${age}'`);
      if (dob) fieldsToUpdate.push(`dob = '${dob}'`);

      if (!fieldsToUpdate.length) res.status(400).send("No update data sent.")

      const updateDetails = fieldsToUpdate.join(", ");
      console.log('update details:', updateDetails);
      
      const updateQuery = `UPDATE students SET ${updateDetails} WHERE id = $1`
      console.log(updateQuery);

      pool.query(updateQuery, [id], (error, results) => {
        if (error) throw error;
        res.status(202).send(`Student ${id}'s details have been updated.`);
      });
    }
  });
}

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  deleteStudent,
  updateStudent,
};

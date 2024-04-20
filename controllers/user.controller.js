const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const userHelper = require("../helpers/user.helper");
const FindAll = async (req, res, next) => {
  try {
    const { ageMin, sortBy, sortOrder, page, limit } = req.query;
    console.log("query", ageMin, sortBy, sortOrder, page, limit);
    // Parse query parameters
    const query = ageMin ? { age: { $gte: parseInt(ageMin) } } : {}; // Query users with age greater than or equal to ageMin if provided
    const sort = sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {}; // Sort by the specified field and order
    const pageNumber = parseInt(page) || 1; // Page number, default to 1 if not provided
    const limitNumber = parseInt(limit) || 10; // Number of documents per page, default to 10 if not provided
    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;
    // Execute query with pagination and sorting
    const result = await userModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);
    console.log("result");
    res.json(result);
  } catch (error) {
    console.log("err", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).send({ message: `${field} address is already in use.` });
    } else if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An error occurred while creating the user." });
    }
  }
};
const FindOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instance = await userModel.findOne({ _id: id });
    res.json(instance);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).send({ message: `${field} address is already in use.` });
    } else if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An error occurred while creating the user." });
    }
  }
};
const FindUserByUsername = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await userModel.findOne({ username });
      resolve(instance); // If user is found, resolve the promise with the user object
    } catch (error) {
      reject(error); // If there's an error, reject the promise
    }
  });
};
const FindUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = await userModel.findOne({ _id: id });
      resolve(instance); // If user is found, resolve the promise with the user object
    } catch (error) {
      reject(error); // If there's an error, reject the promise
    }
  });
};
const Create = async (req, res, next) => {
  try {
    const {
      name,
      password,
      email,
      username,
      phoneNumber,
      age,
      gender,
      address,
      bio,
    } = req.body;
    const instance = await userModel.create({
      name,
      password: await userHelper.hashPassword(password),
      email,
      username,
      phoneNumber,
      age,
      gender,
      address,
      bio,
    });
    res.json(instance);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).send({ message: `${field} is already in use.` });
    } else if (error.name === "ValidationError") {
      return res.status(400).send({ message: error.message });
    } else {
      return res
        .status(500)
        .send({ message: "An error occurred while creating the user." });
    }
  }
};
const Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      password,
      email,
      username,
      phoneNumber,
      age,
      gender,
      address,
      bio,
    } = req.body;
    const instance = await userModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        password,
        email,
        username,
        phoneNumber,
        age,
        gender,
        address,
        bio,
      },
      { new: true } // This option returns the updated document
    );
    res.json(instance);
  } catch (error) {
    console.log("errName", error.name);
    console.log("error", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).send({ message: `${field} address is already in use.` });
    } else if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An error occurred while creating the user." });
    }
  }
};
const Destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instance = await userModel.deleteOne({ _id: id });
    res.json(instance);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).send({ message: `${field} address is already in use.` });
    } else if (error.name === "ValidationError") {
      res.status(400).send({ message: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An error occurred while creating the user." });
    }
  }
};
module.exports = {
  FindAll,
  FindOne,
  Create,
  Update,
  Destroy,
  FindUserByUsername,
  FindUserById,
};

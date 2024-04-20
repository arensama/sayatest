const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "null",
      maxlength: [50, "Name must be at most 50 characters long"],
      validate: {
        validator: function (value) {
          return typeof value === "string" && /^[a-zA-Z\s]*$/.test(value); // Ensure value is a string and matches pattern
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    password: {
      type: String,
      default: "null",
      // maxlength: [150, "Password must be at most 150 characters long"],
      // validate: {
      //   validator: function (value) {
      //     // Check if password meets the following criteria:
      //     // - At least 8 characters long
      //     // - Contains at least one lowercase letter
      //     // - Contains at least one uppercase letter
      //     // - Contains at least one digit
      //     // - Contains at least one special character
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(
      //       value
      //     );
      //   },
      //   message: (props) =>
      //     `Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*()_+).`,
      // },
    },
    email: {
      type: String,

      maxlength: [100, "Email must be at most 100 characters long"],
      validate: {
        validator: function (value) {
          return typeof value === "string" && /\S+@\S+\.\S+/.test(value); // Ensure value is a string and matches email pattern
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    username: {
      type: String,
      default: "null",
      required: true,
      unique: true,
      maxlength: [20, "Username must be at most 20 characters long"],
      validate: {
        validator: function (value) {
          return typeof value === "string" && /^[a-zA-Z0-9_]+$/.test(value); // Ensure value is a string and matches pattern
        },
        message: (props) =>
          `Username can only contain letters, numbers, and underscores!`,
      },
    },
    phoneNumber: {
      type: String,
      default: "null",
      maxlength: [15, "Phone number must be at most 15 characters long"],
      validate: {
        validator: function (value) {
          return typeof value === "string" && /^[0-9]+$/.test(value); // Ensure value is a string and contains only digits
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [120, "Age must not exceed 120"],
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} is not a valid age!`,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
      validate: {
        validator: function (value) {
          return ["male", "female", "other"].includes(value.toLowerCase());
        },
        message: (props) => `${props.value} is not a valid gender!`,
      },
    },
    address: {
      type: String,
      maxlength: [200, "Address must be at most 200 characters long"],
      validate: {
        validator: function (value) {
          return typeof value === "string" && value.trim() !== ""; // Ensure value is not empty after trimming whitespace
        },
        message: (props) => `Address cannot be empty!`,
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio must be at most 500 characters long"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z.,\s]*$/.test(value);
          // Explanation of the regex:
          // ^ - Start of string
          // [a-zA-Z.,\s] - Allowed characters (letters, dots, commas, and whitespace)
          // * - Zero or more occurrences of the allowed characters
          // $ - End of string
        },
        message: (props) =>
          `Bio can only contain letters, dots, commas, and spaces.`,
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

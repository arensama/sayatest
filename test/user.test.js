// Import necessary modules
const assert = require("assert");
const supertest = require("supertest");
const app = require("../app"); // Assuming your Express app is exported from app.js

// Describe the test suite
describe("POST /user", function () {
  this.timeout(10000);
  // Test case for successful user creation
  it("should create a new user", function (done) {
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      password: "Pp1@asswotd",
      username: "mohamadali",
      phoneNumber: "09151234567",
      age: 24,
      gender: "male",
      address: "21 jump street",
      bio: "this is my bio",
    };

    supertest(app)
      .post("/user")
      .send(newUser)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        // Check response body
        // Assuming your API returns the created user in the response body
        expect(res.body).to.have.property("_id");
        expect(res.body.name).to.equal(newUser.name);
        expect(res.body.email).to.equal(newUser.email);
        expect(res.body.username).to.equal(newUser.username);
        expect(res.body.phoneNumber).to.equal(newUser.phoneNumber);
        expect(res.body.age).to.equal(newUser.age);
        expect(res.body.gender).to.equal(newUser.gender);
        expect(res.body.address).to.equal(newUser.address);
        expect(res.body.bio).to.equal(newUser.bio);
        done();
      });
  });

  // Test case for missing required fields
  it("should return 400 if required fields are missing", function (done) {
    const invalidUser = {
      // Missing required fields
    };

    supertest(app).post("/user").send(invalidUser).expect(400).end(done);
  });

  // Test case for invalid email
  it("should return 400 if email is invalid", function (done) {
    const invalidEmailUser = {
      name: "Invalid Email User",
      email: "invalid-email", // Invalid email format
      password: "Test1234.",
      // Add other required fields
    };

    supertest(app).post("/user").send(invalidEmailUser).expect(400).end(done);
  });

  // Add more test cases for other error scenarios
});

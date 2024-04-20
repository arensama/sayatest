var app = require("../app"),
  request = require("supertest");
describe("POST /login", function () {
  this.timeout(10000);
  before((done) => {
    setTimeout(() => {
      done();
    }, 5000);
  });
  it("responds with json", function (done) {
    request(app)
      .post("/auth/signin")
      .send({ username: "arensama", password: "Pp1@asswotd" })
      .expect(200)
      .then(function (err, res) {
        if (err) return done(err);
        done();
      })
      .catch(done);
  }).timeout(20000);
});

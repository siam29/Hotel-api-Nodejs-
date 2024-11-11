const request = require("supertest");
const app = require("./server");

// Test GET /hotels
describe("GET /hotels", () => {
  it("should return all hotels", async () => {
    const res = await request(app).get("/hotels");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("hotels");
  });
});

// Test GET /hotels/:id
describe("GET /hotels/:id", () => {
  it("should return a specific hotel by ID", async () => {
    const res = await request(app).get("/hotels/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Hotel Sunshine");
  });
  it("should return 404 if hotel not found", async () => {
    const res = await request(app).get("/hotels/999");
    expect(res.statusCode).toEqual(404);
  });
});

// Test POST /hotels
describe("POST /hotels", () => {
  it("should add a new hotel", async () => {
    const res = await request(app)
      .post("/hotels")
      .send({ name: "Mountain Inn", location: "Denver", rooms: 50, rating: 4.3 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", "Mountain Inn");
  });
});

// Test PUT /hotels/:id
describe("PUT /hotels/:id", () => {
  it("should update an existing hotel", async () => {
    const res = await request(app)
      .put("/hotels/1")
      .send({ rating: 4.8 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("rating", 4.8);
  });
  it("should return 404 if hotel to update is not found", async () => {
    const res = await request(app)
      .put("/hotels/999")
      .send({ rating: 4.2 });
    expect(res.statusCode).toEqual(404);
  });
});

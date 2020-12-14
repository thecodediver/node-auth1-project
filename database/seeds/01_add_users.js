exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users").del()
    .then(() => knex("users").insert([
      { username: "bagelmaker", password: "password" },
      { username: "creamchesse", password: "password" },
      { username: "trogdorthegreat", password: "password" },
    ]))
}

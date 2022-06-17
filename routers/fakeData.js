const userMaker = (name, gender) => {
  return { name, gender };
};

const users = [];

for (let i = 0; i < 10; i++) {
  users.push(userMaker(`use00${i}`, 0));
}

console.log(users);


// 產品 課程 * 100
// user * 10
// favorite_lesson, favorite_product

// const list = ["a","b","c"]
// list[Math.random()]
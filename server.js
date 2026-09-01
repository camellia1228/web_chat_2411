console.log("Hello, World");
console.log(process.version);
console.log(process.cwd());


const fs = require("fs");
console.log(fs.readFileSync(__filename, "utf-8"));
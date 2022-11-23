const bcrypt = require("bcrypt");

//hash password
const hashPassword = async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
};
// compare password
const comparePassword = async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    console.log(result);
    return result;
};

module.exports = {
    hashPassword,
    comparePassword
}
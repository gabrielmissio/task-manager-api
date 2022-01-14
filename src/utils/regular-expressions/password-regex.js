const passwordRegex = /^(?=.*\d)(?=.*[\W_])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

module.exports = passwordRegex;

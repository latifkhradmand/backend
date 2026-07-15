// Generates a random 6-digit verification code
module.exports = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

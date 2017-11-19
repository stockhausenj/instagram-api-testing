const anime = require("animejs");

anime({
  targets: "input",
  value: 1000, // Animate the input value to 1000
  round: 1 // Remove decimals by rounding the value
});

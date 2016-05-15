// !minifyOnSave
// minifyOnSave: false
// !minOnSave
// minOnSave: false
module.exports = {
  "ecmaVersion": 5,
  "ecmaFeatures": {
    "jsx": false,
    "modules": false,
    "arrowFunctions": false,
    "classes": false,
    "spread": false,
    "impliedStrict": false
  },
  "env": {
    "browser": true,
    "jquery": true
  },
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": ["react"],
  "rules": {
    // "indent": [ "error", "tab" ],
    // "linebreak-style": [ "error", "windows" ],
    // "quotes": [ "error", "single" ],
    // "semi": [ "error", "always" ]
    "newline-per-chained-call": ["off"],
    "no-var": ["off"],
    "max-len": ["off", 100, 4],
    "radix": ["off"],
    "prefer-template": ["off"],
    "prefer-arrow-callback": ["off"],
    "func-names": ["off"],
    "no-use-before-define": ["off"]
  },
  "globals": {
    "Materialize": false,
    "intervalID": true,
  }
};

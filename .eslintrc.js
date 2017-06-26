module.exports = {
  "env": {
    "browser": true,
    "jquery": true,
    "es6": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "sourceType": "script"
  },
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error","single"],
    "semi": ["error","always"],
    "no-console": ["warn", { "allow": ["info", "warn", "error"] }]
  }
};

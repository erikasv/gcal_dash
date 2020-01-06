module.exports = {
  extends: "plugin:vue/base",
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

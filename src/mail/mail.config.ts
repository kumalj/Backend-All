/* eslint-disable prettier/prettier */
// src/config/email.config.ts

// smtpConfig.js


export default () => ({
  email: {
    host: 'smtp.googlemail.com', // Note: No need for 'ssl://' prefix
    port: 465,
    secure: true,
    auth: {
      user: 'focus.cblgroup@cbllk.com',
      pass: 'khcfwkgsnaumfmqz',
    },
  },
});
  
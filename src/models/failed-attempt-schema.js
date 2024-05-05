const failedAttemptsSchema = {
  email: String,
  failedAttempt: { type: Number, default: 0 },
  timeAttempt: Date,
};

module.exports = failedAttemptsSchema;

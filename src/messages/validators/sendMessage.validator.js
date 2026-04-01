const { body } = require("express-validator");

// Validon fushat e kerkuara per dergimin e mesazhit
const sendMessageValidator = [
  // conversationId duhet te jete nje MongoDB ObjectId valid
  body("conversationId")
    .notEmpty().withMessage("conversationId is required")
    .isMongoId().withMessage("conversationId must be a valid ID"),
  body("content")
    .trim()
    .notEmpty().withMessage("Message content is required")
    .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters"),
];

module.exports = sendMessageValidator;
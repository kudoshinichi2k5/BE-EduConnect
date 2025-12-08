require("dotenv").config();
const express = require('express');
const body_parser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// const userRouter = require('./routers/user_router');
// const mentorRouter = require('./routers/mentor_router');
// const opportunityRouter = require('./routers/opportunity_router');
// const articleRouter = require('./routers/article_router');
// const bookmarkRouter = require('./routers/bookmark_router');
// const chatbotRouter = require('./routers/chatbot_router');

const app = express();
app.use(body_parser.json());

// Url api để mở UI Swagger (thấy được mô tả các API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

// Routers
// app.use('/api/user', userRouter);
// app.use('/api/mentor', mentorRouter);
// app.use('/api/opportunity', opportunityRouter);
// app.use('/api/article', articleRouter);
// app.use('/api/bookmark', bookmarkRouter);
// app.use('/api/chatbot', chatbotRouter);


module.exports = app;
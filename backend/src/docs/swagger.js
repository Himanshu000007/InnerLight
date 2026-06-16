import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InnerLight V2 API',
      version: '1.0.0',
      description: 'Mental Wellness Platform API Documentation',
      contact: {
        name: 'InnerLight Team',
        email: 'support@innerlight.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: 'https://api.innerlight.com/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'object' },
            bio: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
            isEmailVerified: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Mood: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            mood: {
              type: 'string',
              enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
            },
            moodScore: { type: 'number', min: 1, max: 5 },
            intensity: { type: 'string', enum: ['low', 'medium', 'high'] },
            trigger: { type: 'string' },
            energy: { type: 'number', min: 1, max: 10 },
            sleep: { type: 'number', min: 0, max: 24 },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Journal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            mood: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isPrivate: { type: 'boolean' },
            isFavorite: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            likeCount: { type: 'number' },
            replyCount: { type: 'number' },
            isAnonymous: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['error'] },
            message: { type: 'string' },
            errors: { type: 'array' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('✅ Swagger API docs available at /api-docs');
};

export default specs;
import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Soko Africa API',
        description: 'Soko Africa Backend API - Connecting African farmers with markets',
        version: '1.0.0',
        contact: {
          name: 'Soko Africa Support',
          email: 'api@soko-africa.com'
        }
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3001',
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer' },
              error: { type: 'string' },
              message: { type: 'string' }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['CUSTOMER', 'SELLER', 'MODERATOR', 'ADMIN'] },
              firstName: { type: 'string' },
              lastName: { type: 'string' }
            }
          },
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              category: { type: 'string' },
              status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }
            }
          },
          SellerProfile: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              slug: { type: 'string' },
              shopName: { type: 'string' },
              bio: { type: 'string' },
              verificationStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] }
            }
          },
          Pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
              hasNext: { type: 'boolean' },
              hasPrev: { type: 'boolean' }
            }
          }
        }
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Products', description: 'Product management' },
        { name: 'Sellers', description: 'Seller shops (Etsy-style)' },
        { name: 'Categories', description: 'Category tree' },
        { name: 'Tags', description: 'Product tags' },
        { name: 'Health', description: 'System health checks' }
      ]
    }
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      persistAuthorization: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    theme: {
      title: 'Soko Africa API Docs'
    }
  });

  fastify.log.info('Swagger documentation available at /api/docs');
});

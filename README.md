# Event Registration API

## 🚀 Features

- **Event Management**: Create, update, and delete events.
- **Registration System**: Register attendees for events with capacity constraints.
- **Attendee Insights**: List attendees registered for multiple events.
- **Swagger API Documentation**: Auto-generated API documentation for all endpoints.
- **Caching with Redis**: Optimized performance with Redis caching.
- **WebSocket Notifications**: Real-time notifications for event updates.
- **Cron Jobs**: Scheduled background tasks for time-sensitive operations.



## 🛠️ Technology Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **API Documentation**: Swagger (via `@nestjs/swagger`)
- **Real-Time**: WebSocket integration
- **Task Scheduling**: Cron Jobs with `@nestjs/schedule`


### Prerequisites
- **Node.js** (v16 or later)
- **PostgreSQL** (v13 or later)
- **Redis**

### Steps
1. Clone the repository:
   git clone https://github.com/golamrabbani3587/event-management-system
   cd event-management-system
   Install dependencies: yarn/npm i
   I have used online database so just yarn/npm i and run the application


## Example API Request
   API list available in swagger( http://localhost:3000/api-docs ) more over I have attach the postman collection.

## Database Query
    I have written two query in the two api 
      /registrations/multiple-events
      /events/most-registered
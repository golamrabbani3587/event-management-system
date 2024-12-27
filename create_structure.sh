mkdir -p src/config src/modules src/database/migrations src/database/seeders src/common src/shared src/swagger


touch src/config/database.config.ts \
      src/config/redis.config.ts \
      src/config/email.config.ts \
      src/config/app.config.ts

mkdir -p src/modules/events/dto src/modules/events/entities
touch src/modules/events/dto/create-event.dto.ts \
      src/modules/events/dto/update-event.dto.ts \
      src/modules/events/dto/filter-event.dto.ts \
      src/modules/events/entities/event.entity.ts \
      src/modules/events/events.controller.ts \
      src/modules/events/events.module.ts \
      src/modules/events/events.service.ts \
      src/modules/events/events.repository.ts \
      src/modules/events/events.gateway.ts

mkdir -p src/modules/attendees/dto src/modules/attendees/entities
touch src/modules/attendees/dto/create-attendee.dto.ts \
      src/modules/attendees/dto/search-attendee.dto.ts \
      src/modules/attendees/entities/attendee.entity.ts \
      src/modules/attendees/attendees.controller.ts \
      src/modules/attendees/attendees.module.ts \
      src/modules/attendees/attendees.service.ts \
      src/modules/attendees/attendees.repository.ts

mkdir -p src/modules/registrations/dto src/modules/registrations/entities
touch src/modules/registrations/dto/create-registration.dto.ts \
      src/modules/registrations/dto/filter-registration.dto.ts \
      src/modules/registrations/entities/registration.entity.ts \
      src/modules/registrations/registrations.controller.ts \
      src/modules/registrations/registrations.module.ts \
      src/modules/registrations/registrations.service.ts \
      src/modules/registrations/registrations.repository.ts

mkdir -p src/modules/notifications
touch src/modules/notifications/email.service.ts \
      src/modules/notifications/email.templates.ts \
      src/modules/notifications/notifications.module.ts

mkdir -p src/modules/background-jobs/jobs
touch src/modules/background-jobs/jobs/email-confirmation.job.ts \
      src/modules/background-jobs/jobs/event-reminder.job.ts \
      src/modules/background-jobs/bull.config.ts \
      src/modules/background-jobs/jobs.module.ts

mkdir -p src/modules/websocket
touch src/modules/websocket/websocket.gateway.ts \
      src/modules/websocket/websocket.module.ts

mkdir -p src/modules/cache
touch src/modules/cache/cache.service.ts \
      src/modules/cache/cache.module.ts

mkdir -p src/modules/scheduler/tasks
touch src/modules/scheduler/scheduler.service.ts \
      src/modules/scheduler/tasks/event-reminder.task.ts \
      src/modules/scheduler/scheduler.module.ts

touch src/database/migrations/0001-initial-migration.ts \
      src/database/seeders/seed-data.ts \
      src/database/typeorm.config.ts

mkdir -p src/common/exceptions src/common/interceptors src/common/pipes src/common/decorators src/common/middleware src/common/constants
touch src/common/exceptions/http-exception.filter.ts \
      src/common/interceptors/cache.interceptor.ts \
      src/common/pipes/validation.pipe.ts \
      src/common/decorators/validation.decorator.ts \
      src/common/middleware/logger.middleware.ts \
      src/common/constants/app.constants.ts

mkdir -p src/shared/utils src/shared/dto
touch src/shared/utils/date.util.ts \
      src/shared/utils/email.util.ts \
      src/shared/dto/base.dto.ts \
      src/shared/base.entity.ts \
      src/shared/pagination.util.ts \
      src/shared/shared.module.ts

touch src/swagger/swagger.config.ts

touch src/app.module.ts src/main.ts .env .env.example README.md tsconfig.json package.json nest-cli.json

echo "Folder and file structure created successfully!"

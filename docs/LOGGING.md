# LOGGING.md — The Bike Yard

# Logging

## Overview

The Bike Yard uses structured logging for observability and debugging. All logs are written in JSON format for easy parsing by log aggregation tools.

## Log Levels

| Level | Description |
|-------|-------------|
| `error` | Error conditions that require immediate attention |
| `warn` | Warning conditions that may lead to errors |
| `info` | Informational messages about normal operation |
| `debug` | Detailed debugging information |

## Log Structure

All log entries include the following fields:

| Field | Description |
|-------|-------------|
| `timestamp` | ISO 8601 timestamp |
| `level` | Log level (error, warn, info, debug) |
| `message` | Log message |
| `requestId` | Unique request identifier for correlation |
| `userId` | User ID (if authenticated) |
| `action` | Action being performed |
| `entityType` | Type of entity affected |
| `entityId` | ID of entity affected |
| `ipAddress` | Client IP address |

## Logging Categories

### Application Logs

Application logs are written to stdout/stderr and captured by the hosting platform (Vercel, etc.).

### Audit Logs

Audit logs are stored in the database via the `AuditLog` model. They track:
- Price changes
- Stock inward/adjustment/return
- Reservation create/release
- Booking cancellation
- Payment recording/allocation
- Refund request/approval/completion
- Invoice issuance/void
- Service-request assignment/closure
- Staff role changes
- Settings changes
- Customer document upload/access/download

### Access Logs

HTTP access logs are captured by the hosting platform and include:
- Request method and path
- Response status code
- Response time
- Client IP address
- User agent

## Viewing Logs

### Local Development
```bash
npm run dev
```
Logs are output to stdout/stderr.

### Production (Vercel)
Logs are available in the Vercel dashboard under the Functions tab.

### Database Query Logs
Enable Prisma query logging in development:
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log = ["query", "error", "warn", "info"]
}
```

## Log Retention

- Application logs: Retained by hosting platform (Vercel retains logs for 30 days)
- Audit logs: Retained indefinitely in the database
- Access logs: Retained by hosting platform

## Log Analysis

Use log aggregation tools to analyze logs:
- Error rate monitoring
- Slow request detection
- Security event detection
- User activity tracking

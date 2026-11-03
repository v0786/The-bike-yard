# SECURITY.md — The Bike Yard

# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.1.0   | :white_check_mark: |
| < 1.1.0 | :x:                |

## Reporting a Vulnerability

Security vulnerabilities should be reported to the system administrator. Do not disclose security vulnerabilities publicly until they have been addressed.

## Security Features

### Authentication
- NextAuth.js with Credentials provider
- Database-backed sessions (not JWT)
- Bcrypt password hashing (cost factor 12)
- Session timeout: 8 hours
- Session invalidation on password change or deactivation

### Authorization
- Role-based access control (RBAC)
- 7 roles: Super Admin, Owner, Manager, Sales Exec, Accountant, Insurance Staff, RTO Staff
- Server-side authorization on all API routes
- Middleware route protection for /admin and /staff paths

### Data Protection
- All monetary values stored as integer paise (no floating point)
- Timestamps stored in UTC, displayed in Asia/Kolkata
- Customer documents stored in private S3 bucket with signed URLs
- Document access restricted by role and access level
- No passwords stored in plain text

### Network Security
- HTTPS enforced (HSTS header)
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevented via Prisma parameterized queries
- File upload validation (type and size limits)
- HTML special characters escaped in templates

### Audit Logging
- All privileged actions logged
- All financial transactions logged
- Audit fields: userId, action, entityType, entityId, oldValues, newValues, ipAddress, timestamp
- Audit logs are not hard-deleted

## Security Checklist

- [ ] All API routes require authentication
- [ ] All admin routes require role-based authorization
- [ ] Passwords hashed with bcrypt (cost factor 12)
- [ ] Session cookies are HttpOnly, Secure, SameSite=lax
- [ ] Security headers configured
- [ ] File upload validation implemented
- [ ] Audit logging for privileged actions
- [ ] No secrets in client bundle
- [ ] .env.local not committed to version control

## Incident Response

1. Identify and contain the breach
2. Rotate all secrets (NEXTAUTH_SECRET, database credentials, API keys)
3. Review audit logs for unauthorized access
4. Notify affected users
5. Document the incident and remediation steps

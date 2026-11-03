# BACKUP_RESTORE.md — The Bike Yard

# Backup and Restore

# Overview

This document covers backup and restore procedures for The Bike Yard application and database.

## Database Backups

### Automated Backups (Production)

If using a managed PostgreSQL provider (AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL, etc.), automated backups are typically enabled by default. Check your provider's documentation for retention policies and restore procedures.

### Manual Backups

Create a manual backup using `pg_dump`:

```bash
# Create a backup
pg_dump -h <host> -U <user> -d bikeyard > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress the backup
gzip backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup

```bash
# Restore from a backup
pg_restore -h <host> -U <user> -d bikeyard backup_20240101_120000.sql.gz
```

**Warning:** Restoring a backup will overwrite all existing data. Ensure you have a current backup before restoring.

## Storage Backups

Bike Yard stores customer documents, bike images, and invoices in S3-compatible storage. Enable versioning on your S3 bucket to protect against accidental deletion:

### AWS S3 Versioning

```bash
aws s3api put-bucket-versioning \
  --bucket bikeyard-documents \
  --versioning-configuration Status=Enabled
```

### Restore from S3 Versioning

```bash
# List object versions
aws s3api list-object-versions --bucket bikeyard-documents --prefix docs/

# Restore a specific version
aws s3api get-object \
  --bucket bikeyard-documents \
  --key docs/customer-docs/abc123.pdf \
  --version-id <version-id> \
  restored-file.pdf
```

## Backup Schedule

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| Database | Daily | 30 days |
| Storage | Continuous (versioning) | 90 days |
| Application Code | Continuous (Git) | Indefinite |

## Backup Verification

Test backups regularly:

1. Restore database backup to a test environment
2. Verify application starts correctly
3. Verify data integrity
4. Document the restore process

## Disaster Recovery

### Complete System Failure

1. Provision new infrastructure (database, storage, application)
2. Restore database from latest backup
3. Restore files from S3 versioning
4. Configure environment variables
5. Run database migrations: `npx prisma migrate deploy`
6. Verify application functionality
5. Update DNS to point to new infrastructure

### Data Corruption

1. Identify time of corruption
2. Restore database from backup before corruption time
3. Restore files from S3 versioning before corruption time
4. Verify application functionality

## Backup Testing Schedule

| Test | Frequency | Owner |
|------|-----------|-------|
| Database restore test | Quarterly | System Administrator |
| Storage restore test | Quarterly | System Administrator |
| Full disaster recovery test | Annually | System Administrator |

## Emergency Contacts

| Role | Contact |
|------|---------|
| System Administrator | admin@thebikeyard.local |
| Database Administrator | dba@thebikeyard.local |
| Security Officer | security@thebikeyard.local |

## Maintenance

- Test backups quarterly
- Review backup retention policies annually
- Document any changes to backup procedures
- Conduct annual disaster recovery drill

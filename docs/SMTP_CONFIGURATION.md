# SMTP Configuration Guide

This guide explains how to configure and test SMTP settings in the Hope Jobs admin panel.

## Overview

The SMTP Configuration Management system allows administrators to:
- Create and manage multiple SMTP configurations
- Test connections before saving
- Activate/deactivate configurations
- Send test emails to verify settings

## Accessing SMTP Settings

1. Log in to the admin panel
2. Navigate to **Admin → SMTP Settings** from the sidebar
3. You'll see a list of all configured SMTP servers

## Adding a New Configuration

### Step 1: Click "Add Configuration"

### Step 2: Fill in the Required Fields

#### Basic Information
- **Configuration Name**: A unique identifier (e.g., "Primary Gmail", "Backup SendGrid")
- **From Name**: The sender name that appears in emails (e.g., "Hope Jobs")
- **From Email**: The email address that appears as the sender

#### SMTP Server Settings
- **SMTP Host**: Your email server hostname
- **Port**: The SMTP port number
  - 587 (recommended for TLS/STARTTLS)
  - 465 (SSL)
  - 25 (plain text, not recommended)

#### Authentication
- **Username**: Your SMTP account username (often your email address)
- **Password**: Your SMTP account password or app password

#### Security Options
- **Use TLS/SSL**: Enable for secure connections (recommended)
- **Set as Active**: Make this the default configuration for sending emails

### Step 3: Test the Connection

**Before saving**, it's highly recommended to test your configuration:

1. Click the **"Test Connection"** button
2. The system will:
   - Verify the connection to the SMTP server
   - Authenticate with your credentials
   - Send a test email to the "From Email" address
3. Check the test result:
   - ✅ **Green message**: Connection successful, test email sent
   - ❌ **Red message**: Connection failed, check the error details

### Step 4: Save the Configuration

Once the test is successful, click **"Create"** to save the configuration.

## Testing Existing Configurations

To test an existing configuration:

1. Click the **pencil icon** (Edit) on the configuration card
2. Enter the password (required for testing)
3. Click **"Test Connection"**
4. Review the test results

## Common SMTP Providers

### Gmail
```
Host: smtp.gmail.com
Port: 587
Security: TLS/SSL Enabled
Username: your-email@gmail.com
Password: App Password (not your regular password)
```

**Note**: You need to create an [App Password](https://support.google.com/accounts/answer/185833) in your Google Account settings.

### Microsoft Outlook/Office 365
```
Host: smtp-mail.outlook.com
Port: 587
Security: TLS/SSL Enabled
Username: your-email@outlook.com
Password: Your account password
```

### SendGrid
```
Host: smtp.sendgrid.net
Port: 587
Security: TLS/SSL Enabled
Username: apikey
Password: Your SendGrid API key
```

### Mailgun
```
Host: smtp.mailgun.org
Port: 587
Security: TLS/SSL Enabled
Username: Your Mailgun SMTP username
Password: Your Mailgun SMTP password
```

## Managing Configurations

### Activating a Configuration

Only **one** configuration can be active at a time. To activate:

1. Use the **toggle switch** on the configuration card, OR
2. Edit the configuration and enable "Set as Active"

When you activate a configuration, all others are automatically deactivated.

### Editing a Configuration

1. Click the **pencil icon** on the configuration card
2. Modify the fields as needed
3. Test the connection if you changed critical settings
4. Click **"Update"** to save changes

**Note**: When editing, you can leave the password field empty to keep the current password.

### Deleting a Configuration

1. Click the **trash icon** on the configuration card
2. Confirm the deletion in the dialog

**Warning**: This action cannot be undone.

## Troubleshooting

### Common Errors

#### Authentication Failed
- **Cause**: Incorrect username or password
- **Solution**: 
  - Verify your credentials
  - For Gmail, ensure you're using an App Password
  - Check if 2FA is enabled on your account

#### Connection Timeout
- **Cause**: Cannot reach the SMTP server
- **Solution**:
  - Verify the host and port are correct
  - Check your firewall settings
  - Ensure your server has internet access

#### Invalid Email Address
- **Cause**: The "From Email" format is incorrect
- **Solution**: Ensure the email follows the format: `user@domain.com`

#### TLS/SSL Errors
- **Cause**: Mismatch between security settings and port
- **Solution**:
  - Port 587: Use TLS (enable "Use TLS/SSL")
  - Port 465: Use SSL (enable "Use TLS/SSL")
  - Port 25: No encryption (disable "Use TLS/SSL")

### Test Email Not Received

If the test shows success but you don't receive the email:

1. Check your spam/junk folder
2. Verify the "From Email" address is correct
3. Wait a few minutes (some servers have delays)
4. Check your email provider's logs

## Security Best Practices

1. **Use App Passwords**: When available (e.g., Gmail), use app-specific passwords instead of your main password
2. **Enable TLS/SSL**: Always use encrypted connections
3. **Limit Access**: Only grant SMTP credentials the minimum required permissions
4. **Rotate Passwords**: Regularly update your SMTP passwords
5. **Monitor Usage**: Keep track of which configuration is active

## API Integration

The SMTP library is available for use in other parts of the application:

```typescript
import { sendEmail } from "@/lib/smtp"

// Get the active SMTP configuration from the database
const activeConfig = await db.sMTPConfig.findFirst({
  where: { isActive: true }
})

if (activeConfig) {
  await sendEmail(
    {
      host: activeConfig.host,
      port: activeConfig.port,
      username: activeConfig.username,
      password: activeConfig.password, // Decrypt this first
      fromEmail: activeConfig.fromEmail,
      fromName: activeConfig.fromName,
      secure: activeConfig.secure,
    },
    "recipient@example.com",
    "Email Subject",
    "Plain text content",
    "<p>HTML content</p>"
  )
}
```

## Support

If you encounter issues not covered in this guide:

1. Check the server logs for detailed error messages
2. Verify your SMTP provider's documentation
3. Contact your email service provider's support

---

**Last Updated**: October 16, 2025


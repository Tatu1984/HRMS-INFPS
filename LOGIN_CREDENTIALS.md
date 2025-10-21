# HRMS System - Login Credentials Management

**Server**: http://localhost:3001/login

---

## Default Admin Account

```
Username: admin
Password: admin123
Role: ADMIN
```

---

## How to Create Login Credentials for Employees

### Step 1: Go to Employees Page
Navigate to `/admin/employees`

### Step 2: Find the Employee
Locate the employee in the table for whom you want to create login credentials

### Step 3: Create Login Access

You'll see two types of buttons in the "Actions" column:

1. **"Create Login" button** - For employees who don't have login access yet
2. **"Edit Access" button** - For employees who already have login access

### Step 4: Fill in the Form

When you click "Create Login", a dialog will open with:

- **Username** - The username the employee will use to login (required)
- **Password** - Initial password (minimum 6 characters, required)
- **Confirm Password** - Re-enter the password (required)
- **Role** - Select from:
  - **EMPLOYEE** - Basic access (can see own data, mark attendance, apply leaves)
  - **MANAGER** - Can manage team members, approve leaves, view team reports
  - **ADMIN** - Full system access

### Step 5: Save
Click "Create Login" to save the credentials

---

## Login Access Column

The "Login Access" column in the employees table shows:

- **No Access** badge (gray) - Employee has no login credentials
- **Role badge** (green) with username - Employee has login access
  - Shows the role (EMPLOYEE/MANAGER/ADMIN)
  - Shows the username (e.g., @john.doe)

---

## Editing User Access

### Change Username
1. Click "Edit Access" button for an employee
2. Change the username field
3. Click "Update Access"

### Change Password
1. Click "Edit Access" button
2. Enter new password in the "New Password" field
3. Leave blank to keep current password
4. Click "Update Access"

### Change Role
1. Click "Edit Access" button
2. Select new role from dropdown (EMPLOYEE, MANAGER, ADMIN)
3. Click "Update Access"

---

## Example Workflow

### Creating Login for a New Sales Manager

1. **Add Employee** (if not already added)
   - Click "Add Employee" on employees page
   - Fill in: Name, Email, Phone, Department = Sales, Designation = Sales Manager
   - Click "Create Employee"

2. **Create Login Credentials**
   - Find the employee in the table
   - Click "Create Login" button
   - Username: `john.sales`
   - Password: `sales@2025`
   - Confirm Password: `sales@2025`
   - Role: Select "Manager"
   - Click "Create Login"

3. **Employee Can Now Login**
   - Go to: http://localhost:3001/login
   - Username: `john.sales`
   - Password: `sales@2025`
   - Will be redirected to Manager Dashboard

---

## Role Permissions

### EMPLOYEE Role
- View own profile and salary
- Mark attendance (check-in/check-out)
- Apply for leaves
- View own payslips
- View assigned tasks
- View messages
- Cannot access admin pages

### MANAGER Role
- All EMPLOYEE permissions PLUS:
- View team members
- Approve/reject team leave requests
- Assign tasks to team members
- View team reports
- Cannot access admin financial pages
- Cannot manage other employees

### ADMIN Role
- Full system access
- Manage all employees
- View and manage all modules
- Generate payroll
- Manage accounts and finances
- Create invoices
- Manage leads and sales
- Access all reports

---

## Security Notes

1. **Password Requirements**
   - Minimum 6 characters
   - Passwords are hashed using bcrypt before storage
   - Never stored in plain text

2. **Username Requirements**
   - Must be unique across the system
   - Cannot have two employees with same username

3. **Best Practices**
   - Use strong passwords for admin accounts
   - Change default admin password immediately
   - Review user roles periodically
   - Remove access for terminated employees

---

## Troubleshooting

### "Username already exists" error
- Try a different username
- Check if employee already has a user account
- Username must be unique

### "This employee already has a user account" error
- Employee already has login credentials
- Use "Edit Access" button instead of "Create Login"

### Cannot login
- Check username and password are correct
- Check caps lock is off
- Ensure user account exists in system

---

## API Endpoints

For developers:

- **POST /api/users** - Create new user
- **PUT /api/users/[id]** - Update user (username, password, role)
- **DELETE /api/users/[id]** - Delete user
- **GET /api/users** - List all users

---

## Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| Create login for employee | /admin/employees | "Create Login" |
| Edit user role | /admin/employees | "Edit Access" |
| Change password | /admin/employees | "Edit Access" |
| View login status | /admin/employees | "Login Access" column |

---

**All user credentials are managed through the Employees page at `/admin/employees`**

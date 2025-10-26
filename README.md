# HRMS - Human Resource Management System

A comprehensive, modern HRMS built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## ✨ Features

### 👥 Employee Management
- Complete employee profiles with KYC documents
- Department and designation tracking
- Reporting hierarchy management
- Employee onboarding and offboarding

### ⏰ Attendance & Leave
- Daily attendance tracking with punch in/out
- Break time monitoring
- Leave application and approval workflow
- Multiple leave types (Sick, Casual, Earned, Unpaid)

### 📊 Project & Task Management
- Project creation with milestones
- Task assignment and tracking
- Project member management
- Project status monitoring

### 💰 Payroll Management
- Automated salary calculations
- Component-based salary structure (Basic, HRA, Conveyance, Medical, etc.)
- Sales target tracking for sales department
- Professional tax and TDS calculations
- Printable payslips (3 per A4 page)

### 🏢 Company Profile
- Centralized company information
- Multiple bank account support (Indian & International)
- Logo and document management
- Legal information (PAN, GST, CIN)

### 💼 Sales CRM
- Lead management with pipeline stages
- Lead to sale conversion tracking
- Sales performance metrics
- Commission calculations

### 📈 Accounts & Invoicing
- Income and expense tracking
- Category-based accounting
- Invoice generation
- Financial reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Default Login
- **Username:** admin
- **Password:** admin123

## 📦 Deployment

**See [QUICKSTART.md](./QUICKSTART.md) for 5-minute deployment guide!**

**Recommended:** Deploy to Vercel (FREE)
1. Push to GitHub
2. Import to Vercel
3. Deploy automatically
4. Connect your BigRock domain

**Cost:** $0/month for small teams

Full deployment options in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.6
- **Language:** TypeScript 5
- **Database:** Prisma ORM (SQLite dev, PostgreSQL prod)
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI Components
- **Icons:** Lucide React
- **Auth:** JWT with jose

## 📁 Project Structure

```
hrms1/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (admin)/        # Admin routes
│   │   ├── (employee)/     # Employee routes
│   │   └── api/            # API routes
│   ├── components/         # React components
│   └── lib/                # Utilities
├── prisma/                 # Database schema
└── public/                 # Static files
```

## 🔐 Security

- JWT authentication
- Password hashing with bcryptjs
- Role-based access control
- Secure HTTP headers
- CSRF & XSS protection

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run migrate      # Database migrations
npm run seed         # Seed initial data
```

## 🌐 Deployment Options

| Platform | Cost | Best For |
|----------|------|----------|
| Vercel | FREE | Easiest, fastest |
| Railway | $5/mo | All-in-one |
| Render | FREE/7$ | Budget-friendly |
| DigitalOcean | $5/mo | Scalability |

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Fast deployment (5 min)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [.env.example](./.env.example) - Environment variables

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Performance reviews
- [ ] Training management
- [ ] Asset management

## 🤝 Support

For deployment help:
- Quick Start: See [QUICKSTART.md](./QUICKSTART.md)
- Full Guide: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Made with ❤️ for Infiniti Tech Partners**

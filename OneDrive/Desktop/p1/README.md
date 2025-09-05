# 🎫 ServiceNow IT Helpdesk - Enterprise Ticketing System

A comprehensive Mini ServiceNow IT Helpdesk Ticketing System built with modern web technologies, featuring enterprise-grade UI and complete ITSM workflows perfect for placements and demonstrations.

![ServiceNow Helpdesk](https://img.shields.io/badge/ServiceNow-Inspired-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb)

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Employee, Admin, Manager roles
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Comprehensive user management with preferences

### 🎫 Ticket Management
- **Complete Lifecycle**: Open → In Progress → Resolved → Closed
- **Priority Levels**: Critical, High, Medium, Low with color-coded badges
- **SLA Tracking**: Real-time SLA timers with visual indicators
- **Categories**: Hardware, Software, Network, Email, Security, etc.
- **Impact & Urgency**: Business impact assessment

### 📊 Analytics Dashboard
- **Real-time Metrics**: Ticket trends, resolution times, SLA compliance
- **Interactive Charts**: Built with Recharts for rich visualizations
- **Performance Tracking**: Agent performance and category breakdowns
- **Role-based Views**: Different dashboards for Employees vs Admins

### 💬 Communication
- **Ticket Comments**: Real-time chat system with edit/delete functionality
- **System Activities**: Automated status change notifications
- **Internal Notes**: Private comments for admin team
- **Real-time Updates**: Socket.io powered live updates

### 🔍 Advanced Search & Filtering
- **Smart Search**: Full-text search across tickets
- **Multi-filter Support**: Status, priority, category, assignee, date range
- **Quick Filters**: One-click common filter combinations
- **Saved Searches**: Bookmark frequently used filters

### 📚 Knowledge Base
- **Self-Service**: Comprehensive knowledge articles
- **Categories**: Organized by IT service areas
- **Search & Filter**: Find solutions quickly
- **User Ratings**: Community-driven article quality

### 🎨 Enterprise UI/UX
- **Material-UI Design**: Professional, consistent interface
- **Dark/Light Mode**: User preference-based theming
- **Responsive Design**: Works on desktop, tablet, and mobile
- **ServiceNow Branding**: Authentic enterprise look and feel

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm 6+
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd p1
```

2. **Install all dependencies**
```bash
npm run install-deps
```

3. **Set up environment variables**
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/servicenow-helpdesk
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Seed the database with demo data**
```bash
npm run seed
```

5. **Start the development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@servicenow.com | admin123 | Full system access |
| Manager | manager@servicenow.com | manager123 | Team management |
| Employee | employee@servicenow.com | employee123 | Basic user access |
| Support | support@servicenow.com | support123 | IT support agent |

## 🏗️ Architecture

### Frontend (React)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard.js     # Main dashboard
│   │   ├── TicketCard.js    # Enhanced ticket cards
│   │   ├── TicketChat.js    # Comment system
│   │   ├── SLATimer.js      # SLA indicators
│   │   ├── Analytics.js     # Charts & metrics
│   │   ├── TicketFilters.js # Search & filtering
│   │   └── KnowledgeBase.js # Self-service portal
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.js  # Theme management
│   ├── services/            # API services
│   └── styles/              # Custom styles
```

### Backend (Node.js/Express)
```
backend/
├── controllers/             # Business logic
├── models/                  # MongoDB schemas
├── routes/                  # API endpoints
├── middleware/              # Authentication, validation
├── scripts/                 # Database seeding
└── server.js               # Express server setup
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Material-UI 5**: Enterprise-grade component library
- **Recharts**: Beautiful, responsive charts
- **Socket.io Client**: Real-time communication
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time bidirectional communication
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing

## 📱 Key Components

### TicketCard Component
- Priority badges with color coding
- SLA progress indicators
- Status workflow buttons
- Real-time updates

### SLATimer Component
- Visual progress bars
- Breach warnings
- Multiple display variants (linear, circular, chip)
- Real-time countdown

### Analytics Dashboard
- Ticket trend charts
- Category distribution
- Resolution time metrics
- Agent performance tracking

### TicketChat Component
- Real-time messaging
- Comment editing/deletion
- System activity logs
- File attachment support

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run client       # Start frontend only
npm run server       # Start backend only

# Production
npm run build        # Build frontend for production
npm start           # Start production server

# Database
npm run seed        # Populate database with demo data

# Setup
npm run setup       # Install dependencies and seed database
npm run install-deps # Install all project dependencies
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment

### Knowledge Base
- `GET /api/knowledge` - Get articles
- `POST /api/knowledge` - Create article
- `PUT /api/knowledge/:id` - Update article

### SLA Management
- `GET /api/sla` - Get SLA configurations
- `POST /api/sla` - Create SLA rule

## 🎯 Perfect for Placements

This project demonstrates:
- **Full-stack Development**: React frontend with Node.js backend
- **Enterprise Patterns**: Role-based access, SLA management, audit trails
- **Modern UI/UX**: Material Design, responsive layout, dark mode
- **Real-time Features**: Live updates, notifications, chat
- **Database Design**: Proper schema design with relationships
- **Security**: JWT authentication, input validation, CORS
- **DevOps Ready**: Environment configuration, seeding scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by ServiceNow's ITSM platform
- Built with modern web development best practices
- Designed for enterprise-grade user experience

---

**Built with ❤️ for ServiceNow placements and enterprise demonstrations**

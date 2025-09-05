const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const KnowledgeBase = require('../models/KnowledgeBase');
const SLA = require('../models/SLA');

// Sample users
const sampleUsers = [
  {
    name: 'John Admin',
    email: 'admin@servicenow.com',
    password: 'admin123',
    role: 'admin',
    department: 'IT Operations',
    location: 'New York',
    phone: '+1-555-0101',
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  {
    name: 'Sarah Manager',
    email: 'manager@servicenow.com',
    password: 'manager123',
    role: 'manager',
    department: 'IT Operations',
    location: 'San Francisco',
    phone: '+1-555-0102',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  },
  {
    name: 'Mike Employee',
    email: 'employee@servicenow.com',
    password: 'employee123',
    role: 'employee',
    department: 'Marketing',
    location: 'Chicago',
    phone: '+1-555-0103',
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    }
  },
  {
    name: 'Lisa Support',
    email: 'support@servicenow.com',
    password: 'support123',
    role: 'admin',
    department: 'IT Support',
    location: 'Austin',
    phone: '+1-555-0104',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  }
];

// Sample tickets
const sampleTickets = [
  {
    title: 'Unable to access company email',
    description: 'I cannot log into my Outlook account. Getting authentication error when trying to connect.',
    priority: 'High',
    status: 'Open',
    category: 'Email & Communication',
    impact: 'Medium',
    urgency: 'High',
    comments: [
      {
        text: 'Ticket created automatically from email',
        isSystemComment: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: 'Laptop running very slow',
    description: 'My laptop has been extremely slow for the past week. Takes 5+ minutes to boot up and applications freeze frequently.',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Hardware',
    impact: 'Medium',
    urgency: 'Medium',
    comments: [
      {
        text: 'Initial diagnosis shows high CPU usage. Investigating potential malware.',
        isSystemComment: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: 'Request new software license',
    description: 'Need Adobe Creative Suite license for new marketing campaign project.',
    priority: 'Low',
    status: 'Open',
    category: 'Software',
    impact: 'Low',
    urgency: 'Low',
    comments: []
  },
  {
    title: 'VPN connection issues',
    description: 'Cannot connect to company VPN from home. Error message: "Connection timeout"',
    priority: 'High',
    status: 'Resolved',
    category: 'Network & Connectivity',
    impact: 'High',
    urgency: 'High',
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
    comments: [
      {
        text: 'Updated VPN client to latest version. Issue resolved.',
        isSystemComment: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        text: 'Ticket resolved by Lisa Support',
        isSystemComment: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  },
  {
    title: 'Printer not working in conference room',
    description: 'The printer in Conference Room B is showing paper jam error but there is no paper jam visible.',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Hardware',
    impact: 'Low',
    urgency: 'Medium',
    comments: [
      {
        text: 'Scheduled maintenance for tomorrow morning',
        isSystemComment: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: 'Password reset request',
    description: 'Forgot my password for the HR system. Need it reset urgently for payroll submission.',
    priority: 'Critical',
    status: 'Closed',
    category: 'Access & Security',
    impact: 'Medium',
    urgency: 'Critical',
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    comments: [
      {
        text: 'Password reset completed via secure email link',
        isSystemComment: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        text: 'Ticket closed automatically after 24 hours',
        isSystemComment: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  }
];

// Sample knowledge base articles
const sampleKnowledgeBase = [
  {
    title: 'How to Reset Your Password',
    content: `# Password Reset Guide

## Self-Service Password Reset

1. Go to the company login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset link
5. Follow the instructions in the email

## If Self-Service Doesn't Work

Contact IT Support at support@company.com or create a ticket through the ServiceNow portal.

## Security Tips

- Use a strong password with at least 8 characters
- Include uppercase, lowercase, numbers, and symbols
- Don't reuse passwords from other accounts
- Enable two-factor authentication when available`,
    category: 'Access & Security',
    tags: ['password', 'security', 'login', 'authentication'],
    author: 'IT Security Team',
    views: 1250,
    helpful: 45,
    notHelpful: 3,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'VPN Setup and Troubleshooting',
    content: `# VPN Configuration Guide

## Initial Setup

1. Download the company VPN client from the IT portal
2. Install the application with administrator privileges
3. Use your company credentials to log in
4. Select the appropriate server location

## Common Issues

### Connection Timeout
- Check your internet connection
- Try different server locations
- Restart the VPN client
- Contact IT if issues persist

### Authentication Failed
- Verify your username and password
- Check if your account is locked
- Try resetting your password

### Slow Connection
- Try connecting to a different server
- Check for background applications using bandwidth
- Run a speed test without VPN for comparison`,
    category: 'Network & Connectivity',
    tags: ['vpn', 'remote', 'connection', 'troubleshooting'],
    author: 'Network Team',
    views: 890,
    helpful: 67,
    notHelpful: 8,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Software Installation Requests',
    content: `# Software Installation Process

## Approved Software List

Before requesting new software, check our approved software catalog in the IT portal.

## Request Process

1. Create a ticket in ServiceNow
2. Specify the software name and version
3. Provide business justification
4. Include budget information if applicable
5. Wait for approval from your manager and IT

## Installation Timeline

- Standard software: 1-2 business days
- New software requiring approval: 5-10 business days
- Custom software: 2-4 weeks

## Security Review

All software requests undergo security review to ensure compliance with company policies.`,
    category: 'Software',
    tags: ['software', 'installation', 'approval', 'security'],
    author: 'IT Operations',
    views: 456,
    helpful: 23,
    notHelpful: 2,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  }
];

// Sample SLA configurations
const sampleSLAs = [
  {
    name: 'Critical Priority SLA',
    priority: 'Critical',
    responseTime: 15, // 15 minutes
    resolutionTime: 240, // 4 hours
    description: 'For business-critical issues affecting multiple users'
  },
  {
    name: 'High Priority SLA',
    priority: 'High',
    responseTime: 60, // 1 hour
    resolutionTime: 480, // 8 hours
    description: 'For high-impact issues affecting individual users'
  },
  {
    name: 'Medium Priority SLA',
    priority: 'Medium',
    responseTime: 240, // 4 hours
    resolutionTime: 1440, // 24 hours
    description: 'For standard requests and minor issues'
  },
  {
    name: 'Low Priority SLA',
    priority: 'Low',
    responseTime: 480, // 8 hours
    resolutionTime: 4320, // 72 hours
    description: 'For enhancement requests and non-urgent issues'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicenow-helpdesk');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await KnowledgeBase.deleteMany({});
    await SLA.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Create SLAs
    const slas = [];
    for (const slaData of sampleSLAs) {
      const sla = new SLA(slaData);
      await sla.save();
      slas.push(sla);
    }
    console.log(`⏱️  Created ${slas.length} SLA configurations`);

    // Create tickets
    const tickets = [];
    for (let i = 0; i < sampleTickets.length; i++) {
      const ticketData = sampleTickets[i];
      const createdBy = users[Math.floor(Math.random() * users.length)];
      const assignedTo = users.find(u => u.role === 'admin') || users[0];
      
      // Find matching SLA
      const matchingSLA = slas.find(sla => sla.priority === ticketData.priority);
      const resolutionDeadline = new Date();
      resolutionDeadline.setMinutes(resolutionDeadline.getMinutes() + (matchingSLA?.resolutionTime || 1440));

      // Add user references to comments
      const commentsWithUsers = ticketData.comments.map(comment => ({
        ...comment,
        user: comment.isSystemComment ? null : assignedTo._id
      }));

      const ticket = new Ticket({
        ...ticketData,
        createdBy: createdBy._id,
        assignedTo: ticketData.status !== 'Open' ? assignedTo._id : null,
        sla: matchingSLA?._id,
        resolutionDeadline,
        comments: commentsWithUsers,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      });
      
      await ticket.save();
      tickets.push(ticket);
    }
    console.log(`🎫 Created ${tickets.length} tickets`);

    // Create knowledge base articles
    const articles = [];
    for (const articleData of sampleKnowledgeBase) {
      const author = users.find(u => u.role === 'admin') || users[0];
      const article = new KnowledgeBase({
        ...articleData,
        author: author._id
      });
      await article.save();
      articles.push(article);
    }
    console.log(`📚 Created ${articles.length} knowledge base articles`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Admin: admin@servicenow.com / admin123');
    console.log('Manager: manager@servicenow.com / manager123');
    console.log('Employee: employee@servicenow.com / employee123');
    console.log('Support: support@servicenow.com / support123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  seedDatabase();
}

module.exports = { seedDatabase };

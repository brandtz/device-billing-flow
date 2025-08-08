# Telecommunications Portal & Management System

A modern React-based telecommunications portal with customer account management, product ordering, billing, and administrative tools.

**Project URL**: https://lovable.dev/projects/59f3d344-b1ba-48d6-9a72-4ee498f37291

## 🎯 Overview

This application provides a comprehensive telecommunications management system with two main interfaces:
- **Customer Portal**: Account management, ordering, billing, and subscriber management
- **Admin Backend**: Product management, rate plan administration, and reporting tools

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **UI Components**: Radix UI primitives with custom design system

### Database & Authentication
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase real-time subscriptions for live updates

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx          # Authentication form component
│   ├── cart/
│   │   └── CartDrawer.tsx         # Shopping cart drawer
│   ├── layout/
│   │   └── Navigation.tsx         # Main navigation component
│   ├── product/
│   │   └── ProductCard.tsx        # Product display component
│   └── ui/                        # shadcn/ui components (buttons, forms, etc.)
├── hooks/
│   ├── useAuth.ts                 # Authentication hook
│   ├── useCart.ts                 # Shopping cart management
│   ├── useUserRole.ts             # User role management
│   └── use-toast.ts               # Toast notifications
├── integrations/
│   └── supabase/
│       ├── client.ts              # Supabase client configuration
│       └── types.ts               # Database type definitions (auto-generated)
├── lib/
│   ├── supabase.ts                # Legacy Supabase client (deprecated)
│   └── utils.ts                   # Utility functions and class merging
├── pages/
│   ├── admin/
│   │   ├── ManageProducts.tsx     # Product management interface
│   │   └── ManageRatePlans.tsx    # Rate plan management interface
│   ├── Billing.tsx                # Billing and payment history
│   ├── Checkout.tsx               # Order checkout process
│   ├── Dashboard.tsx              # Main dashboard with account overview
│   ├── Index.tsx                  # Landing/home page
│   ├── NotFound.tsx               # 404 error page
│   ├── Order.tsx                  # Product ordering workflow
│   ├── Orders.tsx                 # Order history and management
│   ├── Products.tsx               # Product catalog
│   ├── ProfileManagement.tsx      # User profile settings
│   ├── Reporting.tsx              # Analytics and reporting
│   ├── SubscriberManagement.tsx   # Subscriber/line management
│   └── Subscribers.tsx            # Subscriber listing
├── types/
│   ├── auth.ts                    # Authentication type definitions
│   ├── billing.ts                 # Billing-related types
│   ├── cart.ts                    # Shopping cart types
│   ├── database.ts                # Database schema types
│   ├── order.ts                   # Order management types
│   ├── product.ts                 # Product-related types
│   └── subscriber.ts              # Subscriber management types
├── App.tsx                        # Main application component
├── index.css                      # Global styles and design tokens
└── main.tsx                       # Application entry point
```

## 🚀 Current Features

### ✅ Implemented Features

#### Authentication & User Management
- Email/password authentication with Supabase Auth
- User registration with profile creation
- Password reset functionality
- Role-based access control (user profiles with roles)
- Protected routes and navigation

#### Dashboard & Account Management
- Multi-account selector dropdown
- Account balance and billing information display
- Due date tracking and cycle management
- Unbilled usage monitoring
- Pending charges overview

#### Navigation & User Interface
- Responsive navigation with role-based menu items
- Modern UI with shadcn/ui components
- Toast notifications for user feedback
- Loading states and error handling
- Mobile-responsive design

#### Pages & Routing
- Dashboard with account overview
- Product catalog browsing
- Order management and history
- Subscriber/line management
- Profile management settings
- Billing and payment history
- Admin product management
- Admin rate plan management
- Comprehensive routing with 404 handling

### 🚧 Pending Features

#### Advanced Authentication
- Two-factor authentication (2FA)
- Social login providers
- Session management improvements

#### Enhanced Ordering System
- Multi-step ordering workflow
- Shopping cart functionality
- Payment processing integration
- Order status tracking

#### Reporting & Analytics
- Usage analytics dashboard
- Billing reports and exports
- Customer insights and metrics

#### API Integration Layer
- External telecom API connections
- Real-time data synchronization
- Third-party service integrations

## 🔐 Authentication & Access

### Frontend User Portal
- **URL**: Main domain (e.g., `portal.yourdomain.com`)
- **Test Account**: 
  - Email: `thebrandt@gmail.com`
  - Password: `tempPass01!`
- **Features**: Account management, ordering, billing, subscriber management

### Backend Admin Interface
- **URL**: Admin subdomain (e.g., `useradmin.yourdomain.com`)
- **Access**: Same authentication system with role-based access
- **Features**: Product management, rate plan administration, user management

### Login Process
1. Navigate to the application URL
2. Enter email and password credentials
3. Upon successful authentication, users are redirected to the Dashboard
4. Navigation menu adapts based on user role and permissions

## 🛠️ Development Setup

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git for version control

### Local Development
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
The application uses Supabase for backend services. Configuration is handled through:
- `src/integrations/supabase/client.ts` - Main Supabase client
- Database URL and keys are embedded in the client configuration

## 🗄️ Database & Supabase Integration

### Database Schema
The application uses PostgreSQL through Supabase with the following key tables:
- `profiles` - User profile information and roles
- `products` - Telecommunications products and devices
- `rate_plans` - Service plans and pricing
- `orders` - Customer orders and transactions
- `subscribers` - Individual lines and services

### Row Level Security (RLS)
All tables implement RLS policies to ensure data security:
- Users can only access their own data
- Admin roles have elevated permissions
- Public data is appropriately exposed

### Database Migrations
Database changes are managed through Supabase migrations:
```sql
-- Example: Creating a new table with RLS
CREATE TABLE public.new_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Add appropriate RLS policies
CREATE POLICY "Users can view own records" ON public.new_table
  FOR SELECT USING (auth.uid() = user_id);
```

## 🔌 API Integration & Abstraction Layer

### Current Integration Approach
The application currently uses direct Supabase client calls throughout components. For scaling and external API integration, consider implementing an abstraction layer.

### Recommended Abstraction Structure
```
src/
├── services/
│   ├── api/
│   │   ├── base.ts              # Base API client configuration
│   │   ├── auth.ts              # Authentication service
│   │   ├── products.ts          # Product management APIs
│   │   ├── billing.ts           # Billing and payment APIs
│   │   └── subscribers.ts       # Subscriber management APIs
│   ├── external/
│   │   ├── telecom-provider.ts  # External telecom API integration
│   │   └── payment-gateway.ts   # Payment processing integration
│   └── supabase/
│       ├── database.ts          # Supabase database operations
│       └── realtime.ts          # Real-time subscriptions
```

### API Service Example
```typescript
// src/services/api/products.ts
import { supabase } from '@/integrations/supabase/client';

export class ProductService {
  static async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);
    
    if (error) throw error;
    return data;
  }

  static async createProduct(product: ProductInput) {
    // Validation and business logic
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
```

### External API Integration Points
1. **Telecom Provider APIs**: For real-time account data, usage information, and service provisioning
2. **Payment Gateways**: For secure payment processing and billing automation
3. **Analytics Services**: For advanced reporting and business intelligence
4. **Notification Services**: For SMS, email, and push notifications

### Implementation Strategy
1. **Start with Service Layer**: Create service classes for each domain (products, billing, subscribers)
2. **Add Error Handling**: Implement consistent error handling and logging
3. **Create API Clients**: Build reusable HTTP clients for external services
4. **Add Caching**: Implement caching strategies for performance
5. **Add Rate Limiting**: Implement rate limiting for external API calls

## 🔧 Development Tools & Commands

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Editing Options

#### Lovable Platform
- Visit the [Lovable Project](https://lovable.dev/projects/59f3d344-b1ba-48d6-9a72-4ee498f37291)
- Make changes through AI-powered prompts
- Changes auto-commit to repository

#### Local IDE
- Clone repository and edit locally
- Push changes to sync with Lovable
- Full TypeScript and React development experience

#### GitHub Integration
- Direct file editing in GitHub
- GitHub Codespaces support
- Automated deployments through Lovable

## 🚀 Deployment

### Lovable Deployment
1. Open the [Lovable Project](https://lovable.dev/projects/59f3d344-b1ba-48d6-9a72-4ee498f37291)
2. Click "Share" → "Publish"
3. Configure custom domain if needed

### Custom Domain Setup
1. Navigate to Project → Settings → Domains
2. Click "Connect Domain"
3. Follow DNS configuration instructions
4. Requires paid Lovable plan

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

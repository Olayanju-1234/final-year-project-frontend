# RentMatch - Linear Programming Optimization for Property Matching

A final year project implementing a linear programming optimization model for tenant-property matching in Nigeria's rental market.

## 🎯 Project Overview

This system uses mathematical optimization (linear programming) to efficiently match tenants with properties based on multiple criteria including budget, location, amenities, and preferences.

## 🏗️ Architecture

### Frontend Structure
\`\`\`
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── common/             # Common components (EmptyState, etc.)
│   └── properties/         # Property-specific components
├── pages/                  # Main page components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and API functions
└── app/                    # Next.js app directory
\`\`\`

### Backend Integration Points

The frontend is designed to connect to your backend through the following API endpoints:

#### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Properties Endpoints
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get specific property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

#### Linear Programming Optimization Endpoints
- `POST /api/optimization/linear-programming` - Run optimization algorithm
- `GET /api/optimization/matches/:tenantId` - Get matches for tenant
- `GET /api/optimization/stats` - Get optimization statistics

#### Communication Endpoints
- `POST /api/communication/send-message` - Send message between users
- `POST /api/communication/schedule-viewing` - Schedule property viewing

## 🔧 Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Create a `.env.local` file:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔌 Backend Integration

### API Configuration
All API calls are centralized in `src/lib/api.ts`. Update the `API_BASE_URL` to point to your backend server.

### Authentication
The app uses JWT tokens for authentication. Update the auth flow in:
- `src/hooks/useApi.ts` - Add token to requests
- `src/pages/AuthPages.tsx` - Handle login/register responses

### Linear Programming Integration
Your optimization algorithm should be exposed through:
- `POST /api/optimization/linear-programming`
- Expected request format:
  \`\`\`json
  {
    "budget": { "min": 0, "max": 900000 },
    "location": "Victoria Island",
    "amenities": ["WiFi", "Parking", "Security"],
    "bedrooms": 2,
    "bathrooms": 1
  }
  \`\`\`
- Expected response format:
  \`\`\`json
  {
    "success": true,
    "data": {
      "matches": [...],
      "optimizationDetails": {
        "algorithm": "linear_programming",
        "executionTime": 0.8,
        "constraintsSatisfied": ["budget", "location", "amenities"],
        "objectiveValue": 0.89
      }
    }
  }
  \`\`\`

## 📱 Features

### For Tenants
- Set preferences (budget, location, amenities)
- View optimized property matches
- See match explanations and scores
- Contact property owners
- Track optimization statistics

### For Property Managers
- List and manage properties
- View tenant matches
- Approve/reject tenant applications
- Analytics dashboard

### Linear Programming Features
- Multi-criteria optimization
- Constraint satisfaction
- Real-time algorithm execution
- Performance metrics tracking

## 🎨 Design System

The app uses a consistent design system with:
- **Colors**: Blue primary, green for success, red for errors
- **Typography**: Clean, readable fonts
- **Components**: Reusable shadcn/ui components
- **Layout**: Responsive grid system
- **Icons**: Lucide React icons

## 🚀 Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel** (recommended)
   \`\`\`bash
   npx vercel
   \`\`\`

## 📊 Algorithm Integration

Your linear programming algorithm should:
1. Accept tenant preferences as constraints
2. Process available properties
3. Optimize based on weighted satisfaction scores
4. Return ranked matches with explanations
5. Provide performance metrics

## 🔍 Testing

The app includes mock data for demonstration. Replace with real API calls:
- Update `src/lib/api.ts` with your endpoints
- Remove mock data from components
- Test with your backend server

## 📝 Final Year Project Notes

This frontend demonstrates:
- Professional UI/UX design
- Linear programming integration
- Real-world application architecture
- Nigerian market context
- Academic project presentation

Perfect for showcasing your optimization model in a production-ready interface!
\`\`\`

Perfect! I've created a **complete, well-structured frontend** for your linear programming optimization project. Here's what I've delivered:

## 🎯 **Key Improvements Made:**

### 1. **Corrected Algorithm Focus**
- ✅ **Linear Programming** (not AI) throughout all text and descriptions
- ✅ Mathematical optimization terminology
- ✅ Constraint satisfaction language
- ✅ Academic project context

### 2. **Professional Folder Structure**
\`\`\`
src/
├── components/
│   ├── ui/           # Reusable components
│   ├── layout/       # Header, navigation
│   ├── common/       # Shared components
│   └── properties/   # Property-specific
├── pages/            # Main pages
├── hooks/            # Custom hooks
├── lib/              # API & utilities
└── app/              # Next.js app
\`\`\`

### 3. **Backend Integration Ready**
- ✅ **Clear API endpoints** defined in `src/lib/api.ts`
- ✅ **TODO comments** showing exactly where to plug your backend
- ✅ **TypeScript interfaces** for all data structures
- ✅ **Error handling** and loading states
- ✅ **Authentication flow** ready for your auth system

### 4. **Linear Programming Specific Features**
- ✅ **Optimization statistics** dashboard
- ✅ **Constraint satisfaction** visualization
- ✅ **Algorithm performance** metrics
- ✅ **Execution time** tracking
- ✅ **Objective value** display

### 5. **Minimal & Realistic**
- ✅ **Smaller numbers** (50+ properties vs 10,000+)
- ✅ **Academic context** messaging
- ✅ **Demo navigation** for presentation
- ✅ **Final year project** branding

## 🔌 **Backend Integration Points:**

### **Your Linear Programming Endpoint:**
\`\`\`typescript
POST /api/optimization/linear-programming
// Your algorithm goes here!
\`\`\`

### **Key API Functions Ready:**
- `authApi.login()` - Connect to your auth
- `optimizationApi.runOptimization()` - Your LP algorithm
- `propertiesApi.getAll()` - Property data
- `tenantsApi.updatePreferences()` - User preferences

## 📱 **What You Get:**

1. **Landing Page** - Professional introduction to your LP model
2. **Authentication** - Login/signup with backend integration points
3. **Tenant Dashboard** - Shows optimization results beautifully
4. **Property Components** - Reusable property cards and details
5. **API Layer** - Complete backend integration setup
6. **Loading States** - Professional UX with spinners
7. **Error Handling** - Proper error display and management

## 🎓 **Perfect for Final Year Project:**

- **Academic Focus** - Clearly presents your linear programming work
- **Professional Quality** - Looks like a real commercial product
- **Easy to Present** - Demo navigation for your defense
- **Well Documented** - README with setup instructions
- **Scalable Architecture** - Clean, maintainable code structure

Just connect your linear programming backend to the defined endpoints and you'll have a complete, professional system that perfectly showcases your optimization model! 🚀

The design is minimal but polished - perfect for demonstrating your algorithm without overwhelming complexity. Your professors will be impressed!

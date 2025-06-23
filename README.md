# Feedback System

A lightweight internal feedback sharing system between managers and team members. Built with a React frontend and a modular Flask backend.

## Features

### ✅ Core Features (MVP)

**Authentication & Roles**
- Two user roles: Manager and Employee
- Secure login system
- Managers can only see their team members

**Feedback Submission**
- Managers can submit structured feedback for each team member:
  - Strengths
  - Areas to improve
  - Overall sentiment (positive/neutral/negative)
- Multiple feedbacks per employee
- History of feedback visible to both manager and employee

**Feedback Visibility**
- Employees can see feedback they've received
- Employees cannot see other employees' data
- Managers can edit/update their past feedback
- Employees can acknowledge feedback they have read

**Dashboard**
- Manager: team overview (feedback count, sentiment trends)
- Employee: timeline of feedback received

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Python Flask (modular structure with Blueprints and models)
- **Database**: SQLite
- **Authentication**: Flask-Login
- **Styling**: Custom CSS with modern design

## Project Structure

```
feedback-system/
├── feedback-system-backend/
│   ├── app.py              # Flask app setup (no routes or models)
│   ├── models.py           # Database models (User, Feedback)
│   ├── routes.py           # All API route definitions (Blueprint)
│   ├── seeder.py           # Script to seed the database with sample data
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── instance/
│       └── feedback_system.db  # SQLite database file
└── feedback-system-frontend/
    ├── public/
    │   └── index.html      # Main HTML file
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Navbar.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── FeedbackList.js
    │   │   ├── FeedbackForm.js
    │   │   └── FeedbackModal.js
    │   ├── App.js          # Main App component
    │   ├── index.js        # React entry point
    │   ├── index.css       # Global styles
    │   └── App.css         # App-specific styles
    └── package.json        # Node.js dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd feedback-system-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Initialize the database:
   ```bash
   flask db upgrade
   python seeder.py  # To add sample data
   ```

5. Run the Flask application:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd feedback-system-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Docker Setup (Optional)

To run the backend using Docker:

```bash
cd feedback-system-backend
docker build -t feedback-system-backend .
docker run -p 5000:5000 feedback-system-backend
```

## Demo Accounts

The system comes with pre-configured demo accounts:

**Manager Account:**
- Username: `manager1`
- Password: `password123`

**Employee Account:**
- Username: `employee1`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Users
- `GET /api/users` - Get users (filtered by role)

### Feedback
- `GET /api/feedback` - Get feedback list
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/<id>` - Update feedback
- `POST /api/feedback/<id>/acknowledge` - Acknowledge feedback

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Database
- `POST /api/init-db` - Initialize database tables

## Usage

1. **Login/Register**: Start by creating an account or using the demo accounts
2. **Manager Dashboard**: View team overview and recent feedback
3. **Give Feedback**: Managers can submit structured feedback for team members
4. **View Feedback**: Both managers and employees can view feedback history
5. **Edit Feedback**: Managers can edit their previous feedback
6. **Acknowledge Feedback**: Employees can acknowledge they've read feedback

## Security Features

- Password hashing using Werkzeug
- Role-based access control
- Session management with Flask-Login
- CORS configuration for frontend-backend communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 
# Team Feedback Portal

A streamlined platform for sharing feedback between managers and employees. This project features a React-based user interface and a modular Flask backend for robust performance.

## Highlights

### 🚀 Main Capabilities

**User Roles & Security**
- Two distinct roles: Manager and Employee
- Secure authentication system
- Managers have access only to their direct reports

**Feedback Management**
- Managers can provide structured feedback for each employee:
  - Strengths
  - Areas for growth
  - Overall sentiment (positive/neutral/negative)
- Multiple feedback entries per employee
- Both managers and employees can view feedback history

**Access Control**
- Employees see only their own feedback
- Employees cannot access other users' data
- Managers can revise their previous feedback
- Employees can mark feedback as read

**Dashboards**
- Managers: Team summary (feedback stats, sentiment analysis)
- Employees: Chronological view of received feedback

## Technology Stack

- **Frontend**: React 18 with React Router
- **Backend**: Flask (Python) with Blueprints and SQLAlchemy
- **Database**: SQLite
- **Authentication**: Flask-Login
- **Styling**: Custom CSS for a modern look

## Directory Overview

```
feedback-system/
├── feedback-system-backend/
│   ├── app.py              # Flask app configuration
│   ├── models.py           # Database models (User, Feedback)
│   ├── routes.py           # API endpoints (Blueprint)
│   ├── seeder.py           # Script for populating sample data
│   ├── requirements.txt    # Backend dependencies
│   ├── Dockerfile          # Docker setup
│   └── instance/
│       └── feedback_system.db  # SQLite database file
└── feedback-system-frontend/
    ├── public/
    │   └── index.html      # Main HTML template
    ├── src/
    │   ├── components/     # React UI components
    │   │   ├── Navbar.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── FeedbackList.js
    │   │   ├── FeedbackForm.js
    │   │   └── FeedbackModal.js
    │   ├── App.js          # Root React component
    │   ├── index.js        # Entry point
    │   ├── index.css       # Global styles
    │   └── App.css         # App-specific styles
    └── package.json        # Frontend dependencies
```

## Getting Started

### Prerequisites
- Python 3.9 or newer
- Node.js 16 or above
- npm or yarn

### Backend Setup

1. Move to the backend folder:
   ```bash
   cd feedback-system-backend
   ```

2. Set up a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Initialize the database:
   ```bash
   flask db upgrade
   python seeder.py  # Populate with demo data
   ```

5. Launch the Flask server:
   ```bash
   python app.py
   ```

The backend will be running at `http://localhost:5000`

### Frontend Setup

1. Go to the frontend directory:
   ```bash
   cd feedback-system-frontend
   ```

2. Install frontend packages:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Docker (Optional)

The backend Docker image now automatically applies database migrations and seeds the database with sample data before starting the Flask server.

For production deployments, Gunicorn is included as a WSGI server for better performance and reliability. The recommended start command is:

```bash
# For production
cd feedback-system-backend
pip install -r requirements.txt
# Start the app with Gunicorn
gunicorn app:app
```

To build and run the backend in Docker (for development):

```bash
# Standard usage
docker build -t feedback-system-backend .
docker run -p 5000:5000 feedback-system-backend

# If you encounter permission issues on Linux, add:
docker run -p 5000:5000 --env FLASK_APP=app.py feedback-system-backend
```

This will ensure your database is always up to date and pre-populated with demo users and feedback.

## Demo Credentials

The following sample accounts are created by default:

**Manager:**
- Username: `TheManager`
- Email: `manager1@company.com`
- Password: `@12345`

**Employee 1:**
- Username: `Jack`
- Email: `jack@company.com`
- Password: `@123456`

**Employee 2:**
- Username: `Alex`
- Email: `Alex@company.com`
- Password: `@1234567`

## API Overview

### Authentication
- `POST /api/register` — Create a new user
- `POST /api/login` — User login
- `POST /api/logout` — User logout

### User Management
- `GET /api/users` — Retrieve users (role-based)

### Feedback
- `GET /api/feedback` — List feedback
- `POST /api/feedback` — Submit feedback
- `PUT /api/feedback/<id>` — Edit feedback
- `POST /api/feedback/<id>/acknowledge` — Mark feedback as read

### Dashboard
- `GET /api/dashboard` — Dashboard data

### Database
- `POST /api/init-db` — Set up database tables

## How to Use

1. **Sign Up or Log In:** Use demo accounts or register a new user
2. **Manager Dashboard:** View your team and recent feedback
3. **Submit Feedback:** Managers can provide feedback to employees
4. **Review Feedback:** Both roles can see feedback history
5. **Edit Feedback:** Managers can update their feedback
6. **Acknowledge:** Employees can confirm they've read feedback

## Security Practices

- Passwords are securely hashed
- Role-based permissions
- Session management with Flask-Login
- CORS enabled for frontend-backend communication

## Contributing

1. Fork this repository
2. Create a new branch for your feature
3. Make your changes and test thoroughly
4. Open a pull request

## License

This project is licensed under the MIT License. 
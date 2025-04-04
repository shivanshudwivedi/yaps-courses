# yaps-courses

yaps-courses is a mobile application that provides anonymous discussion spaces for college courses. Think of it as Yik Yak for your classes - a place where students can freely discuss course content, ask questions, and share thoughts without revealing their identity.

## Features

- **User Authentication**: Simple login system to verify users belong to the college community
- **College & Course Selection**: Users can select their college and the courses they are taking
- **Course Discussion Boards**: Anonymous comment threads for each course
- **Confessions Board**: A general anonymous space for campus-wide confessions
- **No Database Required**: For quick prototyping, all data is stored locally in JSON files

## Project Structure

```
course-chat/
├── App.js                     # Main application entry point
├── app.json                   # Expo configuration
├── assets/                    # Images, fonts, and other static assets
│   ├── icon.png               # App icon
│   └── splash.png             # Splash screen
├── components/                # Reusable UI components
│   ├── Comment.js             # Comment component for discussion boards
│   ├── CourseCard.js          # Card component for course selection
│   ├── ConfessionCard.js      # Card component for confessions
│   └── Header.js              # Header component for navigation
├── screens/                   # Application screens
│   ├── LoginScreen.js         # User login screen
│   ├── CollegeSelectionScreen.js  # Select college screen
│   ├── CourseSelectionScreen.js   # Select courses screen
│   ├── CourseDiscussionScreen.js  # Course-specific discussion board
│   └── ConfessionsScreen.js   # Campus-wide confessions board
├── navigation/                # Navigation configuration
│   ├── index.js               # Main navigation setup
│   └── BottomTabNavigator.js  # Bottom tab navigation for main app sections
├── data/                      # JSON data files for local storage
│   ├── users.json             # User data
│   ├── colleges.json          # List of colleges
│   ├── courses.json           # Course data
│   ├── comments.json          # Course comments
│   └── confessions.json       # Campus confessions
├── utils/                     # Utility functions
│   ├── storage.js             # Functions for reading/writing JSON files
│   ├── auth.js                # Authentication utilities
│   └── idGenerator.js         # Functions for creating unique IDs
├── package.json               # Project dependencies
└── README.md                  # Project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Expo Go app on your physical device (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/course-chat.git
   cd course-chat
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   expo start
   # or
   npm start
   ```

4. Open the app:
   - Scan the QR code with your device using the Expo Go app
   - Press 'i' to open in iOS Simulator
   - Press 'a' to open in Android Emulator

## Data Structure

Since we're using JSON files instead of a database for quick prototyping, here's how the data is structured:

### users.json
```json
[
  {
    "id": "user1",
    "email": "student@college.edu",
    "collegeId": "college1",
    "courses": ["course1", "course2"]
  }
]
```

### colleges.json
```json
[
  {
    "id": "college1",
    "name": "Example University"
  }
]
```

### courses.json
```json
[
  {
    "id": "course1",
    "collegeId": "college1",
    "code": "CS101",
    "name": "Introduction to Computer Science"
  }
]
```

### comments.json
```json
[
  {
    "id": "comment1",
    "courseId": "course1",
    "text": "Does anyone understand the homework?",
    "timestamp": "2025-04-04T12:30:00Z",
    "upvotes": 5
  }
]
```

### confessions.json
```json
[
  {
    "id": "confession1",
    "collegeId": "college1",
    "text": "I've never actually read any of the assigned books",
    "timestamp": "2025-04-04T14:22:00Z",
    "upvotes": 12
  }
]
```

## Future Improvements

- Add backend server with proper database storage
- Implement email verification for college affiliation
- Add moderation features for inappropriate content
- Enhance privacy and security features
- Add push notifications for popular posts
- Implement post expiration (posts disappear after 24 hours)

## Contributing

This is a prototype project. Feel free to fork and extend as needed for your own implementation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# 🔨 Auctioneer Exam Prep - Auction Academy

A comprehensive web application designed to help auctioneer students prepare for their state licensing exams. Built with React and modern web technologies.

## 🎯 Features

### State-Specific Preparation
- Select your state to access state-specific licensing exam questions
- Questions tailored to state laws and regulations
- All 50 US states supported

### Multiple Study Modes

#### 📝 Full Practice Tests
- Complete 75-question exams simulating the real licensing test
- Realistic test environment with timer
- Progress tracking and question navigation
- Comprehensive results with detailed explanations

#### 🎯 Topic Quizzes
- Focus on specific subjects like:
  - Auction Basics
  - Contract Law
  - Ethics and Professional Conduct
  - Bidding Procedures
  - UCC (Uniform Commercial Code)
  - Real Estate Auctions
  - Personal Property
  - State-Specific Laws
  - Advertising and Marketing
  - Record Keeping
  - Licensing Requirements
  - Consumer Protection
- Customizable quiz length (5, 10, 15, or 20 questions)
- Filter by topic or study all topics

#### 🎴 Flashcards
- Interactive flashcard system for quick review
- Click to flip and reveal answers
- Track cards you know
- Focus on specific topics
- Beautiful, engaging interface

#### 🎮 Study Games
- Gamified learning experience
- Score tracking and streak system
- Immediate feedback with explanations
- Make studying fun and engaging

### Smart Learning Features
- **Instant Feedback**: See correct answers immediately after submitting
- **Detailed Explanations**: Understand why each answer is correct
- **Progress Tracking**: Monitor answered vs. unanswered questions
- **Flexible Navigation**: Jump to any question in a test
- **Results Review**: Comprehensive breakdown of performance
- **Time Tracking**: Monitor how long you spend on tests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AuctionAcademy/Auction-Academy-Test-Prep.git
cd Auction-Academy-Test-Prep
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📱 Usage

1. **Select Your State**: Choose the state where you'll be taking your licensing exam
2. **Choose Study Mode**: Pick from practice tests, quizzes, flashcards, or games
3. **Customize Your Experience**: Select specific topics or quiz lengths
4. **Study and Learn**: Work through questions with immediate feedback
5. **Review Results**: Analyze your performance and learn from mistakes

## 🎨 Branding

The app features Auction Academy's brand identity:
- Primary colors: Navy Blue (#1e3a8a) and Bright Blue (#3b82f6)
- Professional, clean design
- User-friendly interface optimized for learning
- Mobile-responsive layout

## 🏗️ Technology Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern design patterns
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Component-based navigation

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── StateSelector.jsx    # State selection screen
│   ├── Dashboard.jsx         # Main dashboard
│   ├── Test.jsx             # Test/Quiz component
│   ├── Flashcards.jsx       # Flashcards study mode
│   ├── Game.jsx             # Gamified study mode
│   └── *.css                # Component styles
├── data/
│   └── questionBank.js      # Question database
├── App.jsx              # Main app component
├── App.css              # App styles
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Questions

Questions are stored in `src/data/questionBank.js`. To add questions for a state:

1. Add questions to the `questionBank` object using the state name as the key
2. Follow the question format:
```javascript
{
  id: 1,
  topic: 'Topic Name',
  question: 'Question text?',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  correctAnswer: 0, // Index of correct option (0-3)
  explanation: 'Explanation of why this is correct'
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software owned by Auction Academy.

## 📞 Support

For questions or support, please contact Auction Academy.

---

**Auction Academy** - Preparing the next generation of professional auctioneers

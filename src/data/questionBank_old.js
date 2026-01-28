// Question bank with state-specific auction licensing exam questions

// Only Texas and Tennessee are currently supported with official source documents
export const states = [
  'Tennessee',
  'Texas'
];

export const topics = [
  'Auction Basics',
  'Contract Law',
  'Ethics and Professional Conduct',
  'Bidding Procedures',
  'UCC (Uniform Commercial Code)',
  'Real Estate Auctions',
  'Personal Property',
  'State-Specific Laws',
  'Advertising and Marketing',
  'Record Keeping',
  'Licensing Requirements',
  'Consumer Protection'
];

// Question bank with state-specific auction licensing exam questions
// Currently supporting Texas and Tennessee with official source documents

export const questionBank = {
  'Tennessee': [
    {
      id: 1,
      topic: 'Auction Basics',
      question: 'What is the primary role of an auctioneer?',
      options: [
        'To sell items at the highest possible price',
        'To act as an agent for the seller',
        'To purchase items for resale',
        'To appraise items for sale'
      ],
      correctAnswer: 1,
      explanation: 'An auctioneer acts as an agent for the seller, representing their interests in the sale of property at auction.'
    },
    {
      id: 2,
      topic: 'Contract Law',
      question: 'At what point is a contract formed at an auction?',
      options: [
        'When the item is placed for sale',
        'When the first bid is made',
        'When the hammer falls',
        'When payment is received'
      ],
      correctAnswer: 2,
      explanation: 'A contract is formed when the auctioneer accepts a bid by the fall of the hammer or other customary manner, creating a binding agreement between buyer and seller.'
    },
    {
      id: 3,
      topic: 'Ethics and Professional Conduct',
      question: 'Which of the following is considered unethical for an auctioneer?',
      options: [
        'Announcing reserve prices',
        'Taking bids from the audience',
        'Making false statements about merchandise',
        'Using a wireless microphone'
      ],
      correctAnswer: 2,
      explanation: 'Making false statements about merchandise is unethical and potentially illegal. Auctioneers must provide accurate information about items being sold.'
    },
    {
      id: 4,
      topic: 'Bidding Procedures',
      question: 'What is a "reserve" in auction terms?',
      options: [
        'A minimum price below which the item will not be sold',
        'A deposit required from bidders',
        'The auctioneer\'s commission',
        'Extra inventory kept in storage'
      ],
      correctAnswer: 0,
      explanation: 'A reserve is the minimum price set by the seller below which the property will not be sold. The seller reserves the right not to sell if this price is not met.'
    },
    {
      id: 5,
      topic: 'State-Specific Laws',
      question: 'In Alabama, what is required to obtain an auctioneer license?',
      options: [
        'Only a written exam',
        'Written exam and apprenticeship',
        'High school diploma only',
        'No license is required'
      ],
      correctAnswer: 1,
      explanation: 'Alabama requires both passing a written examination and completing an apprenticeship period under a licensed auctioneer.'
    },
    {
      id: 6,
      topic: 'UCC (Uniform Commercial Code)',
      question: 'Under the UCC, goods sold at auction are typically sold with what warranty?',
      options: [
        'Full warranty',
        'Limited warranty',
        'As-is, where-is',
        'Lifetime warranty'
      ],
      correctAnswer: 2,
      explanation: 'Auction sales are typically "as-is, where-is" unless specifically stated otherwise, meaning the buyer accepts the goods in their current condition.'
    },
    {
      id: 7,
      topic: 'Real Estate Auctions',
      question: 'What must be disclosed at a real estate auction?',
      options: [
        'Only the starting bid',
        'Material defects known to the seller',
        'Previous sale prices',
        'Neighbor information'
      ],
      correctAnswer: 1,
      explanation: 'Material defects known to the seller must be disclosed to potential buyers to avoid fraudulent misrepresentation.'
    },
    {
      id: 8,
      topic: 'Advertising and Marketing',
      question: 'Auction advertisements must include:',
      options: [
        'The auctioneer\'s personal phone number',
        'Pictures of all items',
        'The auctioneer\'s license number',
        'A list of previous buyers'
      ],
      correctAnswer: 2,
      explanation: 'Most states require that auction advertisements include the auctioneer\'s license number for consumer protection and verification purposes.'
    },
    {
      id: 9,
      topic: 'Record Keeping',
      question: 'How long must auction records typically be maintained?',
      options: [
        '6 months',
        '1 year',
        '3 years',
        '10 years'
      ],
      correctAnswer: 2,
      explanation: 'Most states require auction records to be maintained for a minimum of 3 years for audit and legal purposes.'
    },
    {
      id: 10,
      topic: 'Consumer Protection',
      question: 'What is "shill bidding"?',
      options: [
        'Bidding on behalf of a charity',
        'Bidding by the seller or their agents to drive up prices',
        'Bidding online',
        'Bidding with a paddle'
      ],
      correctAnswer: 1,
      explanation: 'Shill bidding is the illegal or unethical practice of having the seller or their representatives bid on items to artificially inflate prices.'
    }
  ],
  'Tennessee': [
    {
      id: 1,
      topic: 'Auction Basics',
      question: 'What is the primary role of an auctioneer?',
      options: [
        'To sell items at the highest possible price',
        'To act as an agent for the seller',
        'To purchase items for resale',
        'To appraise items for sale'
      ],
      correctAnswer: 1,
      explanation: 'An auctioneer acts as an agent for the seller, representing their interests in the sale of property at auction.'
    },
    {
      id: 2,
      topic: 'State-Specific Laws',
      question: 'In Tennessee, what requirements must be met to obtain an auctioneer license?',
      options: [
        'Only a written exam',
        'Written exam and background check',
        'High school diploma only',
        'No license is required'
      ],
      correctAnswer: 1,
      explanation: 'Tennessee requires passing a written examination and meeting other state-specific requirements for auctioneer licensing.'
    },
    {
      id: 3,
      topic: 'Ethics and Professional Conduct',
      question: 'Which of the following is considered unethical for an auctioneer?',
      options: [
        'Announcing reserve prices',
        'Taking bids from the audience',
        'Making false statements about merchandise',
        'Using a wireless microphone'
      ],
      correctAnswer: 2,
      explanation: 'Making false statements about merchandise is unethical and potentially illegal. Auctioneers must provide accurate information about items being sold.'
    }
  ],
  'Texas': [
    {
      id: 1,
      topic: 'Auction Basics',
      question: 'What is the primary role of an auctioneer?',
      options: [
        'To sell items at the highest possible price',
        'To act as an agent for the seller',
        'To purchase items for resale',
        'To appraise items for sale'
      ],
      correctAnswer: 1,
      explanation: 'An auctioneer acts as an agent for the seller, representing their interests in the sale of property at auction.'
    },
    {
      id: 2,
      topic: 'State-Specific Laws',
      question: 'In Texas, an auctioneer license is issued by which agency?',
      options: [
        'Texas Department of Licensing',
        'Texas Department of Commerce',
        'Texas Department of Licensing and Regulation',
        'Texas Secretary of State'
      ],
      correctAnswer: 2,
      explanation: 'The Texas Department of Licensing and Regulation (TDLR) is responsible for issuing and regulating auctioneer licenses in Texas.'
    },
    {
      id: 3,
      topic: 'Ethics and Professional Conduct',
      question: 'Which of the following is considered unethical for an auctioneer?',
      options: [
        'Announcing reserve prices',
        'Taking bids from the audience',
        'Making false statements about merchandise',
        'Using a wireless microphone'
      ],
      correctAnswer: 2,
      explanation: 'Making false statements about merchandise is unethical and potentially illegal. Auctioneers must provide accurate information about items being sold.'
    }
  ]
};

// Get questions for a specific state
export const getQuestionsForState = (state) => {
  if (questionBank[state]) {
    return questionBank[state];
  }
  
  // Fallback to Texas questions if state not found (shouldn't happen with TX/TN only)
  return questionBank['Texas'] || [];
};

// Get questions by topic
export const getQuestionsByTopic = (state, topic) => {
  const stateQuestions = getQuestionsForState(state);
  return stateQuestions.filter(q => q.topic === topic);
};

// Get random questions for a test
export const getRandomQuestions = (state, count = 75) => {
  const stateQuestions = getQuestionsForState(state);
  const shuffled = [...stateQuestions].sort(() => Math.random() - 0.5);
  
  // If we don't have enough questions, repeat them
  const questions = [];
  while (questions.length < count) {
    questions.push(...shuffled);
  }
  
  return questions.slice(0, count);
};

// Get quiz questions (smaller set)
export const getQuizQuestions = (state, topic = null, count = 10) => {
  let questions = topic 
    ? getQuestionsByTopic(state, topic)
    : getQuestionsForState(state);
  
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  
  // If we don't have enough questions, use what we have
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

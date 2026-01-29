#!/usr/bin/env python3
"""
Extract Texas questions from the comprehensive TX Question Bank.docx
This document has proper structure with topics, questions, and detailed explanations.
"""

import re
import json
from docx import Document

def clean_text(text):
    """Remove extra whitespace and clean text"""
    if not text:
        return ""
    # Remove "Question #." prefix
    text = re.sub(r'^Question\s+\d+\.\s*', '', text, flags=re.IGNORECASE)
    # Clean up whitespace
    text = ' '.join(text.split())
    return text.strip()

def categorize_topic(question_text, explicit_topic=None):
    """Categorize question by topic based on content"""
    if explicit_topic:
        return explicit_topic
    
    text_lower = question_text.lower()
    
    # Topic keywords
    if any(word in text_lower for word in ['license', 'licensing', 'apprentice', 'registration fee', 'permit']):
        return 'Licensing Requirements'
    elif any(word in text_lower for word in ['ethical', 'ethics', 'conflict of interest', 'fiduciary']):
        return 'Ethics and Professional Conduct'
    elif any(word in text_lower for word in ['record', 'documentation', 'settlement', 'accounting', 'audit']):
        return 'Record Keeping'
    elif any(word in text_lower for word in ['texas', 'statute', 'occupations code', 'chapter', 'section']):
        return 'State-Specific Laws'
    elif any(word in text_lower for word in ['bidder', 'bidding', 'reserve', 'increment', 'bid caller']):
        return 'Bidding Procedures'
    elif any(word in text_lower for word in ['contract', 'agreement', 'terms and conditions', 'breach']):
        return 'Contract Law'
    elif any(word in text_lower for word in ['ucc', 'uniform commercial code', 'secured transaction', 'article 9']):
        return 'UCC (Uniform Commercial Code)'
    elif any(word in text_lower for word in ['advertising', 'marketing', 'promotion', 'disclosure', 'advertisement']):
        return 'Advertising and Marketing'
    elif any(word in text_lower for word in ['fraud', 'misrepresentation', 'deceptive', 'consumer protection']):
        return 'Consumer Protection'
    elif any(word in text_lower for word in ['real estate', 'property', 'land', 'foreclosure', 'deed']):
        return 'Real Estate Auctions'
    elif any(word in text_lower for word in ['personal property', 'chattel', 'movable']):
        return 'Personal Property'
    elif any(word in text_lower for word in ['hammer price', 'buyer premium', 'calculate', 'percentage', 'total', 'commission', 'sales tax', '$', 'price']):
        return 'Auction Math'
    else:
        return 'Auction Basics'

def extract_questions_from_docx(docx_path):
    """Extract all questions from the TX Question Bank document"""
    doc = Document(docx_path)
    questions = []
    current_question = None
    current_volume = 'Auction Basics'
    question_id = 1
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        
        # Check for volume/section headers to determine topic
        if text.startswith('Volume'):
            if 'Auction Math' in text:
                current_volume = 'Auction Math'
            elif 'Texas Law' in text or 'UCC' in text:
                current_volume = 'State-Specific Laws'
            elif 'Secured Transaction' in text:
                current_volume = 'UCC (Uniform Commercial Code)'
            elif 'Deceptive Trade' in text:
                current_volume = 'Consumer Protection'
            elif 'Identity Theft' in text or 'Surcharge' in text or 'Admin' in text:
                current_volume = 'State-Specific Laws'
            elif 'Ethics' in text:
                current_volume = 'Ethics and Professional Conduct'
            continue
        
        # Check if this is a question (starts with "Question #.")
        question_match = re.match(r'Question\s+(\d+)\.\s*(.*)', text, re.IGNORECASE)
        if question_match:
            # Save previous question if exists
            if current_question and current_question.get('question') and len(current_question.get('options', [])) == 4:
                questions.append(current_question)
            
            # Start new question
            question_num = question_match.group(1)
            question_text = question_match.group(2).strip()
            current_question = {
                'id': question_id,
                'topic': current_volume,
                'question': question_text,
                'options': [],
                'correctAnswer': 0,
                'explanation': ''
            }
            question_id += 1
            continue
        
        # Check for option lines (A., B., C., D.)
        if current_question and re.match(r'^[A-D]\.\s', text):
            option_text = re.sub(r'^[A-D]\.\s*', '', text)
            # Clean "Question #." from options too
            option_text = clean_text(option_text)
            current_question['options'].append(option_text)
            continue
        
        # Check for answer line (Answer: B or Correct Answer: B)
        answer_match = re.match(r'(?:Correct\s+)?Answer:\s*([A-D])', text, re.IGNORECASE)
        if answer_match and current_question:
            answer_letter = answer_match.group(1).upper()
            current_question['correctAnswer'] = ord(answer_letter) - ord('A')
            continue
        
        # Check for explanation
        if current_question and text.startswith('Explanation:'):
            # Explanation might be on same line or next
            explanation_text = text.replace('Explanation:', '').strip()
            current_question['explanation'] = explanation_text if explanation_text else ''
            continue
        
        # If we have a current question and explanation was just started or exists
        if current_question and 'explanation' in current_question:
            # Skip if this is the start of a new question
            if text.startswith('Question'):
                continue
            # Skip if this is an answer line we already processed
            if text.startswith('Answer:'):
                continue
            # Check if it's a step in the explanation or continuation
            if re.match(r'Step\s+\d+:', text) or (current_question['explanation'] and not text.startswith(('A.', 'B.', 'C.', 'D.'))):
                if current_question['explanation']:
                    current_question['explanation'] += ' ' + clean_text(text)
                else:
                    current_question['explanation'] = clean_text(text)
    
    # Don't forget the last question
    if current_question and current_question.get('question') and len(current_question.get('options', [])) == 4:
        questions.append(current_question)
    
    # Final cleanup
    for q in questions:
        q['question'] = clean_text(q['question'])
        q['options'] = [clean_text(opt) for opt in q['options']]
        # Further categorize based on content if still generic
        if q['topic'] == 'Auction Basics':
            q['topic'] = categorize_topic(q['question'])
    
    return questions

def main():
    docx_path = '/home/runner/work/Auction-Academy-Test-Prep/Auction-Academy-Test-Prep/tx Practice Questions and study guide (5).docx'
    
    print("Extracting Texas questions from TX Question Bank.docx...")
    questions = extract_questions_from_docx(docx_path)
    
    print(f"\nExtracted {len(questions)} questions")
    
    # Count by topic
    topic_counts = {}
    for q in questions:
        topic = q['topic']
        topic_counts[topic] = topic_counts.get(topic, 0) + 1
    
    print("\nTopic distribution:")
    for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {topic}: {count}")
    
    # Show sample questions
    print("\nSample questions:")
    for i in [0, 10, 20]:
        if i < len(questions):
            q = questions[i]
            print(f"\nQuestion {i+1} ({q['topic']}):")
            print(f"  Q: {q['question'][:80]}...")
            print(f"  Options: {len(q['options'])}")
            print(f"  Answer: {['A', 'B', 'C', 'D'][q['correctAnswer']]}")
            print(f"  Explanation: {q['explanation'][:80]}..." if q['explanation'] else "  No explanation")
    
    # Save to JSON
    output_path = 'tx_questions_comprehensive.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved to {output_path}")
    print("Ready to update questionBank.js")

if __name__ == '__main__':
    main()

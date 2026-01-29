#!/usr/bin/env python3
"""
Script to fix question bank issues:
1. Remove "Question #." prefix from questions
2. Rename "Auction Calculations" to "Auction Math"
"""

import re

def fix_questions():
    # Read the questionBank.js file
    with open('src/data/questionBank.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Original file size:", len(content))
    
    # Count occurrences before
    calc_count = content.count('"Auction Calculations"')
    question_pattern = re.compile(r'"question":\s*"Question\s+\d+\.\s+')
    question_matches = len(question_pattern.findall(content))
    
    print(f"Found {calc_count} instances of 'Auction Calculations'")
    print(f"Found {question_matches} questions with 'Question #.' prefix")
    
    # Remove "Question #." prefix from all questions
    content = question_pattern.sub('"question": "', content)
    
    # Rename "Auction Calculations" to "Auction Math"
    content = content.replace('"Auction Calculations"', '"Auction Math"')
    content = content.replace("'Auction Calculations'", "'Auction Math'")
    
    # Write back
    with open('src/data/questionBank.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Verify changes
    with open('src/data/questionBank.js', 'r', encoding='utf-8') as f:
        new_content = f.read()
    
    new_calc_count = new_content.count('"Auction Calculations"')
    new_question_matches = len(question_pattern.findall(new_content))
    
    print("\n✓ Fixed question prefixes:", question_matches, "→", new_question_matches)
    print("✓ Renamed 'Auction Calculations' to 'Auction Math':", calc_count, "→", new_calc_count)
    print("\nNew file size:", len(new_content))

if __name__ == '__main__':
    fix_questions()

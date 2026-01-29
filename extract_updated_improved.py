from docx import Document
import json
import re

def extract_tn_questions_improved(filename):
    """Extract questions from UPDATED TN question bank - improved version"""
    doc = Document(filename)
    questions = []
    current_question = None
    current_topic = ""
    in_explanation = False
    explanation_buffer = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        
        # Topic line
        if text.startswith("Topic:"):
            current_topic = text.replace("Topic:", "").strip()
            continue
        
        # Check if this is a new question (ends with ?)
        if "?" in text and not text.startswith(("A.", "B.", "C.", "D.", "Answer:", "Explanation:")):
            # Save previous question if complete
            if current_question and current_question.get("question") and len(current_question.get("options", [])) == 4:
                if explanation_buffer:
                    current_question["explanation"] = " ".join(explanation_buffer)
                questions.append(current_question)
                explanation_buffer = []
            
            # Start new question
            current_question = {
                "topic": current_topic or "General",
                "question": text,
                "options": [],
                "correctAnswer": -1,
                "explanation": ""
            }
            in_explanation = False
            continue
        
        if not current_question:
            continue
        
        # Option lines
        if text.startswith("A. "):
            current_question["options"].append(text[3:])
        elif text.startswith("B. "):
            current_question["options"].append(text[3:])
        elif text.startswith("C. "):
            current_question["options"].append(text[3:])
        elif text.startswith("D. "):
            current_question["options"].append(text[3:])
        
        # Answer line
        elif text.startswith("Answer:"):
            answer_letter = text.replace("Answer:", "").strip()
            if answer_letter in ["A", "A."]:
                current_question["correctAnswer"] = 0
            elif answer_letter in ["B", "B."]:
                current_question["correctAnswer"] = 1
            elif answer_letter in ["C", "C."]:
                current_question["correctAnswer"] = 2
            elif answer_letter in ["D", "D."]:
                current_question["correctAnswer"] = 3
        
        # Explanation line
        elif text.startswith("Explanation:"):
            in_explanation = True
            expl_text = text.replace("Explanation:", "").strip()
            if expl_text:
                explanation_buffer.append(expl_text)
        elif in_explanation and text and not text.startswith(("Topic:", "Answer:", "Question")):
            explanation_buffer.append(text)
    
    # Add last question
    if current_question and current_question.get("question") and len(current_question.get("options", [])) == 4:
        if explanation_buffer:
            current_question["explanation"] = " ".join(explanation_buffer)
        questions.append(current_question)
    
    return questions

# Extract TN questions with improved parser
print("Extracting TN questions (improved)...")
tn_questions = extract_tn_questions_improved("Tennessee Auctioneer Exam Bank (2).docx")
print(f"Extracted {len(tn_questions)} TN questions")

# Save to JSON
with open("tn_questions_updated.json", "w") as f:
    json.dump(tn_questions, f, indent=2)
print("Saved to tn_questions_updated.json")

# Show topic distribution
topics = {}
for q in tn_questions:
    topic = q.get("topic", "Unknown")
    topics[topic] = topics.get(topic, 0) + 1

print("\n=== TN Topic Distribution ===")
for topic, count in sorted(topics.items(), key=lambda x: x[1], reverse=True):
    print(f"{topic}: {count} questions")

# Show samples
print("\n=== Sample TN Questions ===")
for i in [0, len(tn_questions)//2, -1]:
    if i < len(tn_questions):
        q = tn_questions[i]
        print(f"\nQuestion {i+1}:")
        print(f"Topic: {q['topic']}")
        print(f"Question: {q['question'][:80]}...")
        print(f"Options: {len(q['options'])}")
        print(f"Correct: {chr(65 + q['correctAnswer'])}")


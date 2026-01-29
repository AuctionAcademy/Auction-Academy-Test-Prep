from docx import Document
import json

def extract_study_guide(filename, state):
    """Extract study guide content and convert to structured format"""
    doc = Document(filename)
    
    content = {
        "state": state,
        "title": f"{state} Auctioneer Study Guide",
        "sections": []
    }
    
    current_section = None
    current_content = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        
        # Check if this is a heading (usually bold or styled)
        is_heading = False
        if para.style.name.startswith('Heading'):
            is_heading = True
        elif text.isupper() and len(text) < 100:  # All caps likely a heading
            is_heading = True
        elif text.endswith(':') and len(text) < 100:  # Ends with colon
            is_heading = True
        
        if is_heading:
            # Save previous section
            if current_section and current_content:
                content["sections"].append({
                    "heading": current_section,
                    "content": current_content
                })
            
            # Start new section
            current_section = text
            current_content = []
        else:
            # Add to current section
            current_content.append(text)
    
    # Save last section
    if current_section and current_content:
        content["sections"].append({
            "heading": current_section,
            "content": current_content
        })
    
    return content

# Extract TN study guide
print("Extracting TN study guide...")
tn_guide = extract_study_guide("tn Study guide.docx", "Tennessee")
print(f"✅ TN: {len(tn_guide['sections'])} sections")

with open("tn_study_guide.json", "w") as f:
    json.dump(tn_guide, f, indent=2)

# Extract TX study guide  
print("\nExtracting TX study guide...")
tx_guide = extract_study_guide("tx Practice Questions and study guide (2).docx", "Texas")
print(f"✅ TX: {len(tx_guide['sections'])} sections")

with open("tx_study_guide.json", "w") as f:
    json.dump(tx_guide, f, indent=2)

print(f"\n✅ Study guides extracted successfully!")
print(f"\nTN Sample Section: {tn_guide['sections'][0]['heading'] if tn_guide['sections'] else 'N/A'}")
print(f"TX Sample Section: {tx_guide['sections'][0]['heading'] if tx_guide['sections'] else 'N/A'}")


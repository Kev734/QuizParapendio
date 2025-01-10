import re
import json

# File paths
questions_file = "Domande2.txt"
answers_file = "Risposte.txt"
output_file = "./src/components/data/quiz_questions.json"

# RegEx patterns
section_pattern = r'^\d+ - (.+)$'
question_pattern = r'^(\d{4}) (.+)$'
answer_pattern = r'^[A.B.C].'

# Parse answers into a dictionary
answers_mapping = {}
with open(answers_file, "r", encoding="utf-8") as f:
    for line in f:
        for pair in line.split():
            question_id, correct_answer = pair.split("-")
            answers_mapping[int(question_id)] = int(correct_answer) - 1  # Convert to 0-based indexing

# Parse questions
questions = []
current_section = None
current_question = None
options = []
text_buffer = []

with open(questions_file, "r", encoding="windows-1252") as f:
    for line in f:
        line = line.strip()
        print(f"Leggo la riga: {line}")  # Debug log
        if not line:
            print(f"RIGA VUOTA!")  # Debug log
            continue  # Skip empty lines

        # Match section
        section_match = re.match(section_pattern, line)
        if section_match:
            current_section = section_match.group(1)
            print(f"Sezione trovata: {current_section}")  # Debug log
            continue

        # Match question
        question_match = re.match(question_pattern, line)
        if question_match:
            print(f"E' una domanda.")  # Debug log
            # Finalize the previous question
            if current_question:
                print(f"Appendo la domanda")  # Debug log
                questions.append({
                    "id": current_question["id"],
                    "section": current_section,
                    "text": " ".join(text_buffer).strip(),
                    "options": options,
                    "correctAnswer": answers_mapping.get(current_question["id"], None)
                })
                print(f"Domanda aggiunta: {questions[-1]}")  # Debug log

            # Start a new question
            print(f"Inizio nuova domanda")  # Debug log
            current_question = {"id": int(question_match.group(1))}
            text_buffer = [question_match.group(2)]
            options = []  # Reset options
            print(f"Nuova domanda rilevata: {current_question}")  # Debug log
            continue

        # Match answers
        print(f"CERCO Le RISPOSTE")  # Debug log
        if re.match(answer_pattern, line):
            print(f"Appendo options")  # Debug log
            options.append(line)
            print(f"Risposta rilevata: {line.strip()}")  # Debug log
        else:
            # Add to question text buffer
            text_buffer.append(line)
            print(f"Appendo text {text_buffer}")  # Debug log

    # Finalize the last question
    if current_question:
        print(f"FINALIZZO LA DOMANDA")  # Debug log
        questions.append({
            "id": current_question["id"],
            "section": current_section,
            "text": " ".join(text_buffer).strip(),
            "options": options,
            "correctAnswer": answers_mapping.get(current_question["id"], None)
        })
    print(f"Ultima domanda aggiunta: {questions[-1]}")  # Debug log

# Save to JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"File JSON generato: {output_file}")
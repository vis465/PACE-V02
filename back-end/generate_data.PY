import numpy as np
import pandas as pd

def generate_student_data(num_students, max_semesters=8, max_subjects=6):
    data = []
    for student_id in range(num_students):
        student_data = []
        for semester in range(1, max_semesters + 1):
            num_subjects = np.random.randint(3, max_subjects + 1)
            semester_data = []
            for _ in range(num_subjects):
                cie1 = np.random.randint(0, 51)
                cie2 = np.random.randint(0, 51)
                cie3 = np.random.randint(0, 51)
                final_marks = np.random.randint(0, 101)
                
                if final_marks >= 90:
                    grade = 'O'
                elif final_marks >= 80:
                    grade = 'A+'
                elif final_marks >= 70:
                    grade = 'A'
                elif final_marks >= 60:
                    grade = 'B+'
                elif final_marks >= 50:
                    grade = 'B'
                elif final_marks >= 40:
                    grade = 'C'
                else:
                    grade = 'U'
                
                semester_data.append([cie1, cie2, cie3, final_marks, grade])
            student_data.append(semester_data)
        data.append((student_id, student_data))
    
    return data

# Generate a large dataset
num_students = 10000  # You can adjust this number
dataset = generate_student_data(num_students)

# Save to a file (we'll use pickle for this complex structure)
import pickle

with open('student_data.pkl', 'wb') as f:
    pickle.dump(dataset, f)

print(f"Generated data for {num_students} students and saved to 'student_data.pkl'")
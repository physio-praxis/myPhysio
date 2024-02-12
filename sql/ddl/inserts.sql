INSERT INTO customer (customer_id, name, email, phone_number, contact_information, address)
VALUES
  (1, 'John Doe', 'john.doe@email.com', '123-456-7890', 'Preferred contact', '123 Main St, Cityville'),
  (2, 'Jane Smith', 'jane.smith@email.com', '987-654-3210', 'Backup contact', '456 Oak St, Townsville'),
  (3, 'Bob Johnson', 'bob.johnson@email.com', '555-123-4567', 'Emergency contact', '789 Pine St, Villagetown'),
  (4, 'Eva White', 'eva.white@email.com', '444-555-6666', 'Backup contact', '321 Elm St, Riverside'),
  (5, 'Grace Miller', 'grace.miller@email.com', '999-888-7777', 'Primary contact', '654 Birch St, Lakeside'),
  (6, 'Sam Roberts', 'sam.roberts@email.com', '777-666-5555', 'Secondary contact', '987 Cedar St, Mountainside'),
  (7, 'Mia Davis', 'mia.davis@email.com', '333-444-5555', 'Emergency contact', '852 Willow St, Seaside'),
  (8, 'Luke Anderson', 'luke.anderson@email.com', '222-111-0000', 'Preferred contact', '741 Maple St, Hillside'),
  (9, 'Emma Turner', 'emma.turner@email.com', '666-777-8888', 'Backup contact', '369 Pine St, Valleytown'),
  (10, 'Oliver White', 'oliver.white@email.com', '123-789-4561', 'Emergency contact', '963 Oak St, Meadowville'),
  (11, 'Sophie Harris', 'sophie.harris@email.com', '321-987-6543', 'Preferred contact', '852 Elm St, Riverside');



INSERT INTO pet (pet_id, name, species, breed, age, medical_history, customer_id)
VALUES
  (1, 'Max', 'Dog', 'Labrador', 3, 'Vaccinated, routine checkups', 1),
  (2, 'Whiskers', 'Cat', 'Siamese', 2, 'Allergic to certain foods', 2),
  (3, 'Thunder', 'Horse', 'Clydesdale', 5, 'Regular vet visits', 3),
  (4, 'Shadowfax', 'Horse', 'Arabian', 7, 'Fast and agile', 4),
  (5, 'Coco', 'Dog', 'Poodle', 5, 'Requires regular grooming', 5),
  (6, 'Whiskey', 'Cat', 'Maine Coon', 3, 'Energetic and curious', 6),
  (7, 'Thunderbolt', 'Horse', 'Thoroughbred', 6, 'Competitive racing history', 7),
  (8, 'Buddy', 'Dog', 'Beagle', 4, 'Loves outdoor activities', 8),
  (9, 'Misty', 'Cat', 'Sphynx', 2, 'Hairless breed, needs warmth', 9),
  (10, 'Apollo', 'Horse', 'Quarter Horse', 8, 'Strong and versatile', 10),
  (11, 'Daisy', 'Dog', 'Dachshund', 6, 'Small and affectionate', 11);


INSERT INTO appointment_status (status_id, status_name)
VALUES
  (1, 'Scheduled'),
  (2, 'Completed'),
  (3, 'Canceled');


INSERT INTO appointment (appointment_id, date_time, status_id, customer_id, pet_id)
VALUES
  (1, '2024-02-10 10:00:00', 1, 1, 1),
  (2, '2024-02-15 14:30:00', 2, 2, 2),
  (3, '2024-02-20 11:45:00', 1, 3, 3),
   (4, '2024-02-25 09:30:00', 1, 4, 4),
  (5, '2024-02-27 13:15:00', 2, 5, 5),
  (6, '2024-03-05 14:00:00', 3, 6, 6),
  (7, '2024-03-10 11:30:00', 3, 7, 7),
  (8, '2024-03-15 10:45:00', 3, 8, 8),
  (9, '2024-03-20 12:15:00', 1, 9, 9),
  (10, '2024-03-25 15:30:00', 1, 10, 10),
  (11, '2024-03-30 09:00:00', 1, 11, 11),
  (12, '2024-04-05 14:45:00', 1, 2, 2),
  (13, '2024-04-10 13:00:00', 1, 3, 3),
  (14, '2024-04-15 10:30:00', 1, 4, 4),
  (15, '2024-04-20 11:00:00', 1, 5, 5),
  (16, '2024-04-25 12:45:00', 1, 6, 6),
  (17, '2024-05-05 13:15:00', 1, 7, 7),
  (18, '2024-05-10 14:30:00', 1, 8, 8),
  (19, '2024-05-15 11:45:00', 1, 9, 9),
  (20, '2024-05-20 10:00:00', 2, 10, 10);

  INSERT INTO treatment (treatment_id, name, description)
VALUES
  (1, 'Dental Cleaning', 'Routine dental checkup and cleaning'),
  (2, 'Allergy Medication', 'Medication for allergy management'),
  (3, 'Hoof Trimming', 'Regular trimming for horse hooves'),
  (4, 'Eye Examination', 'Checkup for eye health'),
  (5, 'Joint Supplements', 'Supplements for joint health'),
  (6, 'Grooming', 'Professional grooming services'),
  (7, 'Vaccination', 'Routine vaccinations for pets'),
  (8, 'Physical Therapy', 'Rehabilitation exercises for pets'),
  (9, 'X-ray Imaging', 'Diagnostic imaging for internal examination'),
  (10, 'Ultrasound Scan', 'Non-invasive imaging for detailed examinations'),
  (11, 'Surgery', 'Medical procedures for various conditions'),
  (12, 'Behavioral Therapy', 'Counseling and training for behavioral issues'),
  (13, 'Nutritional Consultation', 'Guidance on pet nutrition and diet'),
  (14, 'Deworming', 'Treatment for parasitic infections'),
  (15, 'Microchipping', 'Identification and tracking for pets'),
  (16, 'Emergency Care', 'Urgent medical attention for critical situations'),
  (17, 'Diagnostics', 'Comprehensive diagnostic tests for health assessments'),
  (18, 'Dental Surgery', 'Surgical procedures for dental issues'),
  (19, 'Allergy Testing', 'Identification of pet allergies'),
  (20, 'Chemotherapy', 'Medical treatment for cancer in pets');

  INSERT INTO pet_treatment (pet_treatment_id, pet_id, treatment_id)
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 6),
  (5, 5, 7),
  (6, 6, 8),
  (7, 7, 9),
  (8, 8, 10),
  (9, 9, 11),
  (10, 10, 12),
  (11, 11, 13),
  (12, 2, 14),
  (13, 3, 15),
  (14, 4, 16),
  (15, 5, 17),
  (16, 6, 18),
  (17, 7, 19),
  (18, 8, 20),
  (19, 9, 4),
  (20, 10, 5);


INSERT INTO invoice (invoice_id, date_issued, amount, customer_id)
VALUES
  (1, '2024-02-10 11:00:00', 150.00, 1),
  (2, '2024-02-15 15:00:00', 75.00, 2),
  (3, '2024-02-20 12:00:00', 200.00, 3);


INSERT INTO payment (payment_id, amount_paid, payment_date, invoice_id)
VALUES
  (1, 150.00, '2024-02-11 09:00:00', 1),
  (2, 75.00, '2024-02-16 13:30:00', 2),
  (3, 200.00, '2024-02-21 10:45:00', 3);

  
INSERT INTO medical_issue (medical_issue_id, medical_issue)
VALUES
  (1, 'Flea Infestation'),
  (2, 'Respiratory Allergies'),
  (3, 'Lameness');

INSERT INTO pet_medical_issue (pet_medical_issue_id, pet_id, medical_issue_id)
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3);


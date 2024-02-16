--Reset serial keys
DO $$ 
DECLARE 
    table_name_text text;
    column_name_text text;
    seq_name text;
BEGIN
    -- Iterate over tables in the database
    FOR table_name_text, column_name_text IN 
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE column_default LIKE 'nextval%'
    LOOP
        -- Extract the sequence name
        seq_name := substring(column_name_text from '''(.*?)''');

        -- Reset the sequence if it exists
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = seq_name) THEN
            EXECUTE 'SELECT setval(''' || seq_name || ''', (SELECT COALESCE(MAX(' || column_name_text || '), 0) FROM ' || table_name_text || '), false);';
        END IF;
    END LOOP;
END $$;


-- Customers
INSERT INTO customer (name, email, phone_number, address)
VALUES
  ('John Doe', 'john.doe@example.com', '555-123-4567', '123 Main St, Cityville'),
  ('Jane Smith', 'jane.smith@example.com', '555-987-6543', '456 Oak St, Townsville'),
  ('Bob Johnson', 'bob.johnson@example.com', '555-555-5555', '789 Pine St, Villagetown'),
  ('Sarah Miller', 'sarah.miller@example.com', '555-555-5555', '111 Cedar St, Countryside'),
  ('Mike Johnson', 'mike.johnson@example.com', '555-111-2222', '222 Pine St, Suburbia'),
  ('Olivia White', 'olivia.white@example.com', '555-999-8888', '333 Maple St, Uptown'),
  ('Emma Davis', 'emma.davis@example.com', '555-987-6543', '456 Elm St, Cityville');

-- Species
INSERT INTO species (name) VALUES ('Dog'), ('Cat'), ('Horse'), ('Goldfish'), ('Turtle'), ('Rabbit');

-- Pets
INSERT INTO pet (name, species_id, breed, age, medical_history, customer_id)
VALUES
  ('Max', 1, 'Labrador', '2019-01-01', 'Vaccinated, routine checkups', 1),
  ('Whiskers', 2, 'Siamese', '2020-03-15', 'Allergic to certain foods', 2),
  ('Thunder', 3, 'Clydesdale', '2017-07-20', 'Regular vet visits', 3),
  ('Bubbles', 4, 'Comet', '2019-01-20', 'Enjoys swimming, regular feedings', 6),
  ('Thumper', 5, 'Holland Lop', '2020-02-28', 'Loves fresh vegetables', 2),
  ('Sparky', 6, 'Painted Turtle', '2018-10-10', 'Enjoys swimming in a well-filtered tank', 7);

-- Appointment Status
INSERT INTO appointment_status (status_name) VALUES ('Scheduled'), ('Completed'), ('Canceled');

-- Appointments
INSERT INTO appointment (date_time, status_id, customer_id, pet_id)
VALUES
  ('2024-02-10 10:00:00', 1, 1, 1),
  ('2024-02-15 14:30:00', 2, 2, 2),
  ('2024-02-20 11:45:00', 1, 3, 3),
  ('2023-03-15 09:00:00', 2, 4, 4),
  ('2023-04-02 14:30:00', 1, 5, 5),
  ('2023-04-10 11:00:00', 1, 6, 6);

-- Invoices
INSERT INTO invoice (date_issued, amount, customer_id)
VALUES
  ('2024-02-10 11:00:00', 150.00, 1),
  ('2024-02-15 15:00:00', 75.00, 2),
  ('2024-02-20 12:00:00', 200.00, 3),
  ('2023-03-15 10:30:00', 30.00, 7),
  ('2023-04-02 15:45:00', 45.00, 4),
  ('2023-04-10 12:15:00', 25.00, 6);

-- Treatments
INSERT INTO treatment (name, description) VALUES
  ('Dental Cleaning', 'Routine dental checkup and cleaning'),
  ('Allergy Medication', 'Medication for allergy management'),
  ('Hoof Trimming', 'Regular trimming for horse hooves'),
  ('Shell Inspection', 'Check the health and condition of the turtle shell'),
  ('Dental Checkup', 'Examine teeth and recommend dental care for rabbits');

-- Pet Treatments
INSERT INTO pet_treatment (pet_id, treatment_id, invoice_id) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 4),
  (5, 5, 4),
  (6, 2, 5);

-- Products
INSERT INTO product (name, description, pricing) VALUES
  ('Fish Food', 'High-quality fish food', 10),
  ('Rabbit Hay', 'High-fiber hay for rabbits', 12),
  ('Turtle Food', 'Nutritious food for turtles', 15);

-- Product Purchases
INSERT INTO product_purchase (product_id, customer_id, invoice_id, name, amount, pricing)
VALUES
  (1, 1, 1, 'Fish Food', 2, 20.00),
  (2, 2, 2, 'Rabbit Hay', 1, 12.00),
  (3, 1, 3, 'Turtle Food', 1, 15.00),
  (3, 2, 4, 'Turtle Food', 2, 30.00),
  (2, 3, 5, 'Rabbit Hay', 1, 12.00),
  (1, 3, 6, 'Fish Food', 1, 10.00);

-- Payments
INSERT INTO payment (amount_paid, payment_date, invoice_id)
VALUES
  (150.00, '2024-02-11 09:00:00', 1),
  (75.00, '2024-02-16 13:30:00', 4),
  (200.00, '2024-02-21 10:45:00', 2),
  (30.00, '2023-03-16 11:00:00', 3),
  (45.00, '2023-04-03 16:30:00', 5),
  (25.00, '2023-04-11 13:00:00', 6);

-- Medical Issues
INSERT INTO medical_issue (medical_issue) VALUES
  ('Flea Infestation'),
  ('Respiratory Allergies'),
  ('Lameness'),
  ('Shell Rot'),
  ('Digestive Issues');

-- Pet Medical Issues
INSERT INTO pet_medical_issue (pet_id, medical_issue_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 3);

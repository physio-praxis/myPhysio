CREATE TABLE customer (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  phone_number VARCHAR,
  address VARCHAR
);

CREATE TABLE species (
  species_id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE pet (
  pet_id SERIAL PRIMARY KEY,
  name VARCHAR,
  species_id INTEGER references species(species_id),
  breed VARCHAR,
  age DATE,
  medical_history TEXT,
  customer_id INTEGER REFERENCES customer(customer_id)
);

CREATE TABLE appointment_status (
  status_id SERIAL PRIMARY KEY,
  status_name VARCHAR
);

CREATE TABLE appointment (
  appointment_id SERIAL PRIMARY KEY,
  date_time TIMESTAMP,
  status_id INTEGER REFERENCES appointment_status(status_id),
  customer_id INTEGER REFERENCES customer(customer_id),
  pet_id INTEGER REFERENCES pet(pet_id)
);

CREATE TABLE invoice (
  invoice_id SERIAL PRIMARY KEY,
  date_issued TIMESTAMP,
  amount DECIMAL,
  customer_id INTEGER REFERENCES customer(customer_id)
);

CREATE TABLE treatment (
  treatment_id SERIAL PRIMARY KEY,
  name VARCHAR,
  description TEXT
);

CREATE TABLE pet_treatment (
  pet_treatment_id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pet(pet_id),
  treatment_id INTEGER references treatment(treatment_id),
  invoice_id INTEGER REFERENCES invoice(invoice_id)
);

CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  pricing INTEGER
);

CREATE TABLE product_purchase (
  purchase_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES product(product_id),
  customer_id INTEGER REFERENCES customer(customer_id),
  invoice_id INTEGER REFERENCES invoice(invoice_id),
  name VARCHAR,
  amount INTEGER,
  pricing FLOAT
);

CREATE TABLE payment (
  payment_id SERIAL PRIMARY KEY,
  amount_paid DECIMAL,
  payment_date TIMESTAMP,
  invoice_id INTEGER REFERENCES invoice(invoice_id)
);

CREATE TABLE medical_issue (
  medical_issue_id SERIAL PRIMARY KEY,
  medical_issue VARCHAR
);

CREATE TABLE pet_medical_issue (
  pet_medical_issue_id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pet(pet_id),
  medical_issue_id INTEGER REFERENCES medical_issue(medical_issue_id)
);


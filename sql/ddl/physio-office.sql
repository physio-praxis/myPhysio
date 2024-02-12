-- Create Tables If Not Exists
CREATE TABLE IF NOT EXISTS customer (
  customer_id integer PRIMARY KEY,
  name varchar(255),
  email varchar(255),
  phone_number varchar(255),
  contact_information varchar(255),
  address varchar(255)
);

CREATE TABLE IF NOT EXISTS pet (
  pet_id integer PRIMARY KEY,
  name varchar(255),
  species varchar(255),
  breed varchar(255),
  age integer,
  medical_history varchar(255),
  customer_id integer
);

CREATE TABLE IF NOT EXISTS appointment_status (
  status_id integer PRIMARY KEY,
  status_name varchar(255)
);

CREATE TABLE IF NOT EXISTS appointment (
  appointment_id integer PRIMARY KEY,
  date_time timestamp,
  status_id integer,
  customer_id integer,
  pet_id integer
);

CREATE TABLE IF NOT EXISTS pet_treatment (
  pet_treatment_id integer PRIMARY KEY,
  pet_id integer,
  treatment_id integer
);

CREATE TABLE IF NOT EXISTS treatment (
  treatment_id integer PRIMARY KEY,
  name varchar(255),
  description text
);

CREATE TABLE IF NOT EXISTS invoice (
  invoice_id integer PRIMARY KEY,
  date_issued timestamp,
  amount decimal,
  customer_id integer
);

CREATE TABLE IF NOT EXISTS payment (
  payment_id integer PRIMARY KEY,
  amount_paid decimal,
  payment_date timestamp,
  invoice_id integer
);

CREATE TABLE IF NOT EXISTS pet_medical_issue (
  pet_medical_issue_id integer PRIMARY KEY,
  pet_id integer,
  medical_issue_id integer
);

CREATE TABLE IF NOT EXISTS medical_issue (
  medical_issue_id integer PRIMARY KEY,
  medical_issue varchar(255)
);

ALTER TABLE IF EXISTS pet ADD FOREIGN KEY (customer_id) REFERENCES customer (customer_id);

ALTER TABLE IF EXISTS appointment ADD FOREIGN KEY (customer_id) REFERENCES customer (customer_id);

ALTER TABLE IF EXISTS appointment ADD FOREIGN KEY (pet_id) REFERENCES pet (pet_id);

ALTER TABLE IF EXISTS appointment ADD FOREIGN KEY (status_id) REFERENCES appointment_status (status_id);

ALTER TABLE IF EXISTS pet_treatment ADD FOREIGN KEY (pet_id) REFERENCES pet (pet_id);

ALTER TABLE IF EXISTS pet_treatment ADD FOREIGN KEY (treatment_id) REFERENCES treatment (treatment_id);

ALTER TABLE IF EXISTS invoice ADD FOREIGN KEY (customer_id) REFERENCES customer (customer_id);

ALTER TABLE IF EXISTS payment ADD FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id);

ALTER TABLE IF EXISTS pet_medical_issue ADD FOREIGN KEY (pet_id) REFERENCES pet (pet_id);

ALTER TABLE IF EXISTS pet_medical_issue ADD FOREIGN KEY (medical_issue_id) REFERENCES medical_issue (medical_issue_id);

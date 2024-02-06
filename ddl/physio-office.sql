CREATE TABLE `customer` (
  `customer_id` integer PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255),
  `phone_number` varchar(255),
  `contact_information` varchar(255),
  `address` varchar(255)
);

CREATE TABLE `pet` (
  `pet_id` integer PRIMARY KEY,
  `name` varchar(255),
  `species` varchar(255),
  `breed` varchar(255),
  `age` integer,
  `medical_history` varchar(255) COMMENT 'Medical history of the pet',
  `customer_id` integer
);

CREATE TABLE `appointment` (
  `appointment_id` integer PRIMARY KEY,
  `date_time` timestamp,
  `status` varchar(255) COMMENT 'Scheduled, Completed, Canceled',
  `customer_id` integer,
  `pet_id` integer
);

CREATE TABLE `medical_record` (
  `record_id` integer PRIMARY KEY,
  `vaccinations` varchar(255),
  `treatments` varchar(255),
  `prescribed_medications` varchar(255),
  `pet_id` integer
);

CREATE TABLE `invoice` (
  `invoice_id` integer PRIMARY KEY,
  `date_issued` timestamp,
  `amount` decimal,
  `customer_id` integer
);

CREATE TABLE `payment` (
  `payment_id` integer PRIMARY KEY,
  `amount_paid` decimal,
  `payment_date` timestamp,
  `invoice_id` integer
);

ALTER TABLE `pet` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

ALTER TABLE `appointment` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

ALTER TABLE `appointment` ADD FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`);

ALTER TABLE `medical_record` ADD FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`);

ALTER TABLE `invoice` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`invoice_id`);

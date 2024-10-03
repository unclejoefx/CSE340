-- Task 1) -> Insert a new record into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2) -> Update account_type for Tony Stark's account
UPDATE account
SET account_type ='Admin'
WHERE account_email = 'tony@starkent.com';

-- Task 3) -> Delete Tony Stark's record from the account table
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Task 4) -> Modify the "GM Hummer" to change "small interior" to "a huge interior"
UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'small interior', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5) -> Joining the tables inventory, classification, and sport
SELECT inv.inv_make, inv.inv_model, class.classification_name
FROM public.inventory inv
INNER JOIN public.classification class
ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';

-- Task 6) -> Updating all records in the inventory table to add "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');
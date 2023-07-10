-- show employee ids, first name, last name, job title, dept, salary, and reporting manager

SELECT employee.id AS ID,
employee.first_name AS First_Name,
employee.last_name AS Last_Name,
role.title AS Title,
department.name AS Department,
role.salary AS Salary,
employee.manager_id AS Manager
-- Not sure how to reference manager name here


FROM business_db.employee

RIGHT JOIN business_db.role
ON business_db.employee.role_id = business_db.role.id

RIGHT JOIN business_db.department
ON business_db.department.id = business_db.role.department_id;

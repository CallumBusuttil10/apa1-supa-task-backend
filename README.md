# Employee Management System

## Project Overview
This project is a companion application for APA-1 and serves as a **back-end** that implements a **RESTful API** for employee management. It provides **CRUD (Create, Read, Update, Delete)** operations for employee records, which are stored in a **Supabase database**.

The API is built as a **Supabase Edge Function**, running on **Deno**, which handles HTTP requests for managing employee data. It connects to a Supabase database using the **Supabase client** and performs operations based on the **HTTP method** of the request.

---

## **Technical Implementation**

### **Technology Stack**
**Deno** runtime environment  
**Supabase** as the backend database  

---

## **CRUD Operations**

### **Read (GET) - Lines 8-49**
**Get All Employees:** Retrieves all employees from the database along with their associated team information.  
**Get Specific Employee:** Retrieves details of a specific employee when an **employee ID** is provided in the request path.  
**Joins** employee data with team data to **include team names** in the response.

### **Create (POST) - Lines 51-56**
**Accepts employee data** in the request body (**first name, last name, job title, email, team ID, salary, hire date**).  
**Inserts** a new record into the **employees** table.  
**Returns** a success message on completion.

### **Update (PUT) - Lines 58-77**
**Receives updated employee information** including the **employee ID**.  
**Validates** that an **ID is provided**.  
**Updates** the corresponding employee record in the database.  
**Returns** a success message on completion.

### **Delete (DELETE) - Lines 79-96**
**Extracts** the employee ID from the **URL path**.  
**Validates** that an **ID is provided**.  
**Removes** the employee record from the database.  
**Returns** a success message on completion.

---

## **Error Handling** (Lines 98-108)
The function includes error handling to ensure smooth API operations:

**Catches any exceptions** during request processing.  
**Returns appropriate HTTP status codes** based on the error type.  
**Formats error messages in JSON** for client consumption.

---

## **Data Structure**

The **employees** table has the following fields:

| Column Name  | Type          | Description |
|-------------|--------------|-------------|
| `id` | `int` (Primary Key) | Unique identifier for each employee |
| `first_name` | `varchar` | Employee's first name |
| `last_name` | `varchar` | Employee's last name |
| `job_title` | `varchar` | Job title of the employee |
| `email` | `varchar` | Employee's email address |
| `created_at` | `timestamp` | Record creation timestamp |
| `team_id` | `int` (Foreign Key) | References the `teams` table |
| `salary` | `int` | Employee's salary |
| `hire_date` | `date` | Employee's hiring date |


The API also retrieves **related team information** through a **foreign key relationship** with the `teams` table.

The **teams** table has the following fields:

| Column Name  | Type          | Description |
|-------------|--------------|-------------|
| `id` | `int` (Primary Key) | Unique identifier for each team |
| `team_name` | `varchar` | Name of the team |

---
# Future Considerations

This application is a **work in progress** and has the potential to be expanded and enhanced in the future. Here are some potential enhancements:

## Authentication & Authorization
Implement role-based access control to ensure secure access based on user roles.

## Batch Processing
Enable bulk operations for handling multiple employees at once.

## Supabase Analytics Implementation
Extend API functionality to support Supabase Analytics for data analysis and insights.
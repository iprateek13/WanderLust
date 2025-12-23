# Wanderlust – Full Stack Listing Application

Wanderlust is a full-stack web application inspired by Airbnb-style listings, built using Node.js, Express, MongoDB, and EJS.  
The project follows RESTful architecture and the MVC design pattern, focusing on strong backend fundamentals and server-side rendering.

---

## Features Implemented

### CRUD Operations
- Create new listings  
- View all listings  
- View listing details  
- Edit existing listings  
- Delete listings  

### EJS Partials & Layouts
- Reusable templates using the `includes/` folder  
- Cleaner structure following the DRY principle  

### Dynamic Routing
- URL-based routing such as:
  - `/listings`
  - `/listings/:id`
  - `/listings/new`

### MongoDB Integration
- Listings stored and retrieved dynamically using Mongoose  

### RESTful APIs
- Proper use of HTTP methods (GET, POST, PUT, DELETE)

### Form Handling
- HTML forms  
- Method Override for PUT and DELETE requests  

---

## Example Routes

| Route | Method | Description |
|------|--------|-------------|
| `/listings` | GET | Show all listings |
| `/listings/new` | GET | Form to create a new listing |
| `/listings` | POST | Create a new listing |
| `/listings/:id` | GET | Show listing details |
| `/listings/:id/edit` | GET | Edit listing form |
| `/listings/:id` | PUT | Update listing |
| `/listings/:id` | DELETE | Delete listing |

---

## Concepts Used
(React and frontend frameworks excluded)

- MVC Architecture (Model–View–Controller)  
- EJS templating with partials  
- RESTful routing  
- MongoDB CRUD using Mongoose  
- Async/Await  
- Environment variables using `.env`  
- Express middleware:
  - method-override  
  - express.urlencoded  
  - static file handling  
- Server-side rendering (SSR)  
- Error handling using try-catch  

---

## How to Run Locally

### Clone the repository
```bash
git clone https://github.com/yourusername/Wanderlust.git

# Multi-Tenant CRM System (SaaS)

A scalable multi-tenant CRM (Customer Relationship Management) platform built using the MERN stack.  
The system allows multiple businesses (tenants) to manage their customers, leads, and workflows independently within a single application while maintaining secure data isolation.

Designed with SaaS architecture principles, role-based access control, and modern frontend performance using React + Vite.

---


## 🧠 Project Overview

This CRM system enables multiple organizations to operate under one platform while keeping their data completely isolated.

Each tenant has:
- Separate users
- Separate customers & leads
- Independent dashboards
- Secure authentication & authorization

The project demonstrates real-world SaaS architecture and scalable backend design.

---

## ✨ Features

- Multi-tenant architecture
- Tenant-based data isolation
- Secure authentication & authorization
- Role-based access control (Admin / User)
- Customer & lead management
- Dashboard analytics
- REST API integration
- Responsive modern UI
- Protected routes
- Scalable backend structure

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Shadcn
- React Router
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequalize

### Other Tools
- JWT Authentication
- REST APIs
- Environment Variables

---

## 🏗 Architecture Concept

The application follows a **multi-tenant SaaS architecture** where:

- One application serves multiple organizations.
- Each request is associated with a tenant ID.
- Database queries are filtered per tenant.
- Data remains isolated and secure.

Example Flow:

User Login → Tenant Identified → Authorized Access → Tenant-Specific Data Returned
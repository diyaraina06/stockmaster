📦 StockMaster – Inventory Management System
A simple, fast, React-based Inventory Management System built for the Odoo Hackathon.

🚀 Key Features
Authentication: Signup, Login, OTP Reset, Role-based access
Dashboard:
Total products
Low/Out-of-stock
Pending Receipts / Deliveries
Scheduled Transfers
Filters by type, status, warehouse, category

📂 Modules
✔ Products
Create / update products
SKU, Category, UoM, Initial Stock
Multi-warehouse support
Low-stock alerts
Smart search & filters
✔ Receipts (Incoming Stock)
Add supplier & items
Validate → stock increases
✔ Deliveries (Outgoing Stock)
Add customer & items
Validate → stock decreases
Prevent insufficient stock
✔ Internal Transfers
Move items between warehouses
Validate → source decreases, destination increases
✔ Inventory Adjustments
Enter counted qty
Validate → updates stock
✔ Move History
Shows all Receipts, Deliveries, Transfers, Adjustments

🛠 Tech
React + Vite
React Router
LocalStorage-based store
Pure CSS (no backend)

▶ Run Locally
npm install
npm run dev

Open: http://localhost:5173

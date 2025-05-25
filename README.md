## 🎥 Demo

![Formivus Demo](./assets/FormivusDemo.gif)


# 🧠 Formivus – Personal Health Tracker

**Formivus** is a web-based health analysis platform designed to help users monitor their well-being through body measurements, calorie tracking, product suggestions, and more. It provides different user roles (admin/user), responsive views, and deep personalization options.

---

## 🔐 Registration & Login

### ✅ Registration features:
- Register button remains disabled until all fields are valid.
- **Email** is validated in real-time (must be unique and formatted correctly).
- **Username** must be at least 5 characters, only letters/numbers (no special characters), and unique.
- **Password** must meet strength requirements and match confirmation.
- Option to **show/hide** password.
- On successful registration, users are redirected to login and shown a success message.
- **Passwords are hashed** using Bcrypt.

### 🔓 Login:
- Validates email and password combination.
- Proper error messages if email does not exist or password is incorrect.
- Show/hide password toggle available.

---

## 🏠 After Login

- User is redirected to the **Home page** with access to `My Profile` and `Health Panel`.
- From here, users can access personalized health tools.

---

## 🧍 My Profile

- Users fill in **age, gender, height, weight, and activity level**.
- This data is used across the platform (calorie calculation, recommendations).
- Users can update their profile anytime.

### 🔒 Security:
- Admin-only pages (`/admin`, etc.) are protected both via **backend logic** and **role-based access**.
- Attempts to manipulate roles via dev tools or URL are automatically redirected or blocked.

---

## 📈 My Progress

- Users can input full body measurements.
- All inputs are stored and displayed in a history **table** and an optional **chart**.
- The chart is dynamically updated with each new entry.
- User can select which metric to view progress over time (e.g., waist, hips, etc.).

---

## 🔥 My Calories

⚠️ Before demo: clear `localStorage` if previously used.

- Choose your **focus goal**: Lose weight, Maintain, Gain muscle.
- Based on the profile and progress data, the app calculates:
  - Daily maintenance calorie needs
  - Visual progress bar (based on current and goal weight)
- Users set a **target weight** and the system updates progress % accordingly.
- Focus goal also displays a short **motivational strategy**.
- Errors are shown if logic is invalid (e.g., trying to gain when current > goal).

---

## 🥑 Products

- Users can **suggest new products** with detailed macros.
- Calories are calculated automatically based on macros.
- Admin sees pending suggestions and can approve/reject them.
- Status is shown in the user panel: `Pending`, `Approved`, or `Rejected`.
- Admins can also create instantly-approved products or delete them directly.
- Search functionality included.

---

## 🍽️ Meal Tracker

- Add multiple **meals per day**.
- Custom meal naming.
- Inside each meal, user can add **multiple products** from the product list.
- Amounts (g/ml) are entered and macros are calculated dynamically.
- Live totals for **proteins, carbs, fats, and calories**.
- Button to open **print view** for easy meal plan printing.

---

## 🛠️ Admin Panel

### 1. **Admin Panel**
- View all submitted products.
- Approve or reject suggestions with one click.
- Users receive immediate feedback in their Products panel.

### 2. **All Users**
- View all registered users and profile stats.
- Admin can:
  - Promote/demote user roles
  - Delete users
  - Filter by role or search by name/email
  - See profile data of users who filled their profile
  - Highlight self with label `(you)`

---

## 💅 Design & Styling

- Fully **responsive** design (tables adapt to small screens using label-style layouts).
- SCSS used for all styles, with global variables and modular structure.
- Icons, colors, and layout match a clean, modern aesthetic.
- Accessibility and UX prioritised.

---

## 🧰 Technologies Used

- **React.js** – frontend user interface
- **Node.js** – backend server logic
- **MySQL** – relational database
- **SCSS (Sass)** – CSS styling with modular structure

---


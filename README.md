Project Overview
This wellness management system is designed to help users track their personal progress, manage their meals, monitor calorie intake, and suggest new products, with clear role-based access control for both users and admins.

🔐 Registration
The registration form uses a disabled button until all validation requirements are met:

Email Validation

Users must provide a valid email format.

Real-time error messages appear below the input.

Duplicate emails are not allowed.

Special characters like *, /, etc. are restricted.

Username Validation

Must be at least 5 characters long.

No special symbols allowed.

If the username already exists in the database, an error is shown.

Password Requirements

Toggle visibility button (show/hide password).

Requirements shown while typing.

Weak passwords are not accepted.

Passwords must match.

Upon successful registration, a confirmation message appears, and the user is redirected to the login page.

Passwords are hashed using Bcrypt for security.

🔑 Login
Email is verified. If the address doesn't exist, an error is shown.

Password is validated against the hashed version in the database.

Toggle visibility function also exists here.

🏠 After Logging In
The user is directed to the Home Page, where new sections like My Profile and Health Panel become available.

In My Profile, the user can fill in essential details:

Gender, Age, Height, Weight, and Activity Level.

This information directly affects calculations in other sections.

The data can be edited anytime.

Unauthorized users cannot gain admin rights through URL manipulation or browser tools – all attempts are blocked or redirected.

📊 My Progress
Users can enter body measurements and see progress over time.

The Measurements Table shows historical data (no entry limit).

A Progress Chart visualizes measurement changes over time.

The user can choose which measurement to track (waist, hips, etc.).

The chart updates immediately after each new entry.

🔥 My Calories
⚠️ Note: LocalStorage is not used – all data is stored in the backend.

This section displays:

Focus goal (Lose / Maintain / Gain weight).

Daily calorie needs (calculated based on profile + last recorded weight).

Target weight with a dynamic progress bar.

After submitting new measurements, progress updates visually.

Depending on the selected Focus, the user receives recommendations.

Calorie needs react to:

Profile data

Progress measurements

Activity level

Selected goal focus

Logical inconsistencies (e.g., trying to lose weight but entering a higher goal weight) will result in an error – progress won’t be calculated.

🧾 Products
Users can suggest new products with full macro breakdown (100g/ml base).

Calories are calculated automatically.

Formatting is normalized (first letter capitalized, rest lowercase).

Users see the status of each submission:

Pending, Approved, or Rejected (updated by admin).

Admin-created products are automatically approved and can be deleted.

Search functionality included for browsing available products.

🍽 Meal Tracker
Users can add meals by clicking "Add New Meal".

A table appears where they input meal details.

Users can rename meals, choose products, enter amounts (raw values).

Macros are calculated instantly from the product list.

All daily entries are summed automatically.

Meals are not limited in number.

A "Print View" is available to export all meals for the day.

👨‍💼 Admin Functionality
Admin users see two additional links: Admin Panel and All Users.

Admin Panel:

View and manage product suggestions (approve/reject).

Feedback is instantly reflected in the user’s view.

All Users:

Displays a full list of registered users with their profile data.

Admins are visually highlighted and labeled (you).

Filtering and search by username/email and user roles.

Admins can:

Assign/revoke admin roles (excluding themselves).

Delete users.

Role updates affect access rights in real time.

💅 Styling
The entire project is fully responsive, optimized for both desktop and mobile.

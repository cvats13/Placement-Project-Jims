Design a modern web dashboard UI for a College Placement Management System used by Admin and Placement Officer.

Use a clean professional dashboard style similar to modern SaaS products with a left sidebar navigation, top search bar, and card-based student data layout.

Use light theme, rounded cards, soft shadows, blue/indigo accent colors, and clear typography.

Create the following screens:

1. Login Page

Design a login page with two user roles.

Layout

Left side:

Illustration related to career / students / placement

Right side:
Login form card.

Login Form Fields

Email

Password

Role Selector Dropdown

Admin

Placement Officer

Buttons:

Login

Forgot Password

Footer text:
"Placement Management System"

2. Home Dashboard (Student Overview)

Design a main dashboard page for Placement Officers.

Layout

Left Sidebar Navigation:

Dashboard

Students

Companies

Shortlisted

Email Notifications

Logout

Top Bar:

Search Bar (Search student by name or roll number)

Profile Avatar

Main Section:
Student table with filters.

3. Student Table View

Create a data table showing all students.

Columns:

Checkbox (Select student)

Roll No

Name

Branch (BCA / MCA / BBA)

Semester

CGPA

Backlogs

Skills

Resume

View Profile Button

Rows should be clickable to open student dashboard.

4. Filtering System

Above the table create filter controls.

Filters include:

Dropdown Filters:

Course Filter

BCA

MCA

BBA

Sliders / Input fields:

CIA Marks Threshold

Mock Test Marks Threshold

Dropdown:

Company Filter

Buttons:

Apply Filters

Reset Filters

5. Student Personal Dashboard

When clicking a student row, open a Student Profile Dashboard.

Layout:

Top section:
Student profile card

Display:

Name

Roll Number

Branch

Semester

CGPA

Backlogs

Phone

Email

Links:

GitHub Profile

LeetCode Profile

Resume Download

Performance Section

Use charts and tables.

Semester Wise Marks Table:

Semester

SGPA

Subjects

CIA Marks Table:

Subject

CIA Marks

Mock Test Section:

Test Name

Score

Percentile

Add progress bars for performance metrics.

6. Student Selection System

Back on main dashboard:

Allow multi-selection using checkboxes.

Bottom sticky action bar appears when students selected.

Show:

"X Students Selected"

Buttons:

Send to Company

Notify Students

7. Email Sending Modal

Design modal popup.

Fields:

Company Name

Company Email

Email Subject

Email Message

Buttons:

Send

Cancel

Show confirmation success message.

8. Admin Panel – Student Upload

Admin dashboard screen.

Section: Upload Student Data

Options:

Upload CSV button.

Student data structure:

student_id (Primary Key)

roll_no

name

branch

semester

cgpa

backlogs

phone

email

skills

resume_url

created_by (Admin ID)

Show preview table before upload confirmation.

9. UI Style Guide

Typography:

Inter / Poppins

Colors:

Primary:
Blue #4F46E5

Secondary:
Indigo #6366F1

Background:
#F9FAFB

Cards:
White with subtle shadow

Buttons:
Rounded large buttons

Components to create

Reusable components:

Sidebar Navigation

Student Table Row

Filter Dropdown

Profile Card

Performance Chart

Modal Dialog

Selection Action Bar

Primary Button

Screens to generate

Generate 6 Figma frames:

Login Page

Dashboard Student List

Student Filters + Search

Student Profile Dashboard

Email Sending Modal

Admin Upload Panel
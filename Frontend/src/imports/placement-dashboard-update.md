Extend the existing Placement Management System Dashboard UI to support multiple CIA exams and multiple mock tests inside each semester for students in courses like MCA, BCA, and BBA.

Keep the same design language, color palette, typography, and layout used in the current dashboard.

Use a clean SaaS-style academic performance dashboard layout.

1. Student Personal Dashboard Update

Modify the existing Student Profile Dashboard to display academic data semester-wise.

Top section (existing profile card):

Display:

Student Name

Roll Number

Course (MCA / BCA / BBA)

Current Semester

CGPA

Backlogs

Phone

Email

Links to GitHub and LeetCode profiles

Resume Download Button

2. Semester Performance Section

Create a new section titled:

Academic Performance

Below it show collapsible semester cards.

Example structure:

Semester 1
Semester 2
Semester 3
Semester 4

Each semester card should expand to show detailed academic data.

3. Semester Card Layout

Each Semester Card contains three subsections:

1. Semester Summary

Display key metrics:

Semester Number

SGPA

Average CIA Score

Average Mock Test Score

Use small metric cards with icons.

Example:

SGPA: 8.4
Avg CIA: 17
Avg Mock Test: 78
4. CIA Marks Section

Inside the semester card create a CIA Marks Table.

Table columns:

Subject

CIA 1

CIA 2

CIA 3

CIA 4 (optional)

Average CIA Score

Example table layout:

Subject           CIA1   CIA2   CIA3   CIA4   Avg
------------------------------------------------
DBMS              18     17     19     -      18
Operating System  17     16     18     -      17
Data Structures   19     18     20     -      19

Add subtle row highlighting.

5. Mock Test Section

Below CIA marks create Mock Test Performance Table.

Columns:

Test Name

Test Type (Aptitude / Coding / Technical)

Score

Percentile

Date

Example:

Test Name      Type       Score   Percentile
--------------------------------------------
Mock Test 1    Aptitude    78       65
Mock Test 2    Aptitude    82       72
Mock Test 3    Coding      70       60
6. Visual Performance Charts

Add charts to visualize performance.

Charts include:

Semester SGPA Trend Chart

Line chart showing SGPA progression across semesters.

CIA Score Distribution

Bar chart comparing CIA averages by subject.

Mock Test Score Progress

Line or bar chart showing improvement across tests.

Charts should appear on the right side of the academic section.

7. Collapsible Semester Interaction

Semester cards should support expand/collapse behavior.

Collapsed state:

▶ Semester 1  | SGPA 8.2 | Avg Mock 75

Expanded state shows:

CIA marks table

Mock test table

performance charts

8. Student Performance Summary Card

Add a summary card above the semester list.

Display:

Overall CGPA

Total Mock Tests Taken

Average Mock Test Score

Placement Readiness Score

Example:

Placement Readiness Score: 82%

Use progress bars or circular indicators.

9. Reusable Components to Create

Create reusable UI components:

Semester Accordion Card

CIA Marks Table

Mock Test Table

Performance Chart Cards

Student Profile Card

Academic Summary Metrics

10. Empty Data States

If a semester has no data yet show:

No academic records available for this semester.

Include a simple illustration.

11. Responsive Layout

Academic dashboard should adapt to different screen widths.

Desktop layout:

Student Info | Performance Charts
Semester Cards Below

Mobile layout:

Student Info
Charts
Semester Cards
12. UI Style

Maintain existing system styling.

Typography:

Inter / Poppins

Colors:

Primary accent: Indigo / Blue

Cards:

White background with soft shadow

Tables:

Light gray borders and hover effects.

Frames to Generate

Ask Figma AI to generate these new frames:

Updated Student Dashboard

Expanded Semester Card Example

CIA Marks Table Component

Mock Test Table Component

Performance Charts Section
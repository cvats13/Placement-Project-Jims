Extend the existing Placement Management System Dashboard UI by adding an advanced multi-student search system that allows placement officers to paste multiple student names at once and automatically filter the table.

Maintain the same design system, colors, typography, and layout already used in the dashboard.

1. Enhanced Search Bar (Bulk Name Search)

Modify the existing search bar in the dashboard.

Search Input

Large expandable search field with placeholder text:

Search students (paste multiple names separated by space, comma, or line break)
Example: Rahul Priya Aman

Features:

Accept multiple names pasted at once

Support separators:

Space

Comma

New line

Auto-tokenize names into search chips

Example UI after paste:

Search field shows:

[Rahul] [Priya] [Aman]

Each token appears as a removable chip/tag.

2. Bulk Search Mode Indicator

Add a small label above the table:

Bulk Search Active • 3 Names

Include a Clear All button.

3. Search Token Chips

Design reusable chip components.

Chip style:

Rounded pill

Light blue background

Student icon on left

Name text

Close (X) icon to remove

Example:

👤 Rahul  ✕
👤 Priya  ✕
👤 Aman   ✕
4. Smart Search Dropdown Suggestions

While typing a name, show dropdown suggestions.

Dropdown should display:

Student result card:

Rahul Sharma
Roll No: BCA-203
Branch: BCA
CGPA: 8.4

Selecting a result converts it into a chip token.

5. Bulk Paste Modal (Optional Advanced Feature)

Add a “Paste Names” button beside the search bar.

Click opens modal.

Modal title:

Bulk Student Search

Textarea placeholder:

Paste student names here
Example:

Rahul Sharma
Priya Singh
Ankit Verma

Buttons:

Apply Filter

Cancel

After applying, tokens appear in search bar.

6. Filter Result Indicator

Above the student table show result summary:

Showing 12 students matching 3 names

If none found:

Empty state card:

No students matched the search.
Try adjusting the names or filters.

Include an illustration.

7. Highlight Matching Names in Table

In the student table:

Highlight matched names.

Example:

Rahul Sharma

Highlighted:

[Rahul] Sharma

Use light blue highlight.

8. Bulk Selection + Email Integration

If filtered students appear:

Allow select all filtered students.

Checkbox above table:

Select all filtered students

Bottom action bar shows:

12 Students Selected

Buttons:

Send To Company

Notify Students

9. Component Additions

Create reusable components:

Multi Token Search Bar

Name Token Chip

Bulk Paste Modal

Search Suggestion Dropdown

Filter Result Indicator

Empty State Card

10. UX Behavior Notes

Search should support:

Multiple pasted names

Partial name matching

Removing tokens

Clear all tokens

Combining with other filters (course, marks, company)

11. Responsive Behavior

Search bar expands when multiple tokens appear.

Tokens wrap to next line if overflow occurs.

Student table resizes accordingly.

💡 Pro design tip:
Ask Figma AI to style the search component similar to modern SaaS dashboards like Notion or Linear with clean tokenized search.
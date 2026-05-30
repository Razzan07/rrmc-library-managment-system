/* ============================================
   RSMC LIBRARY MANAGEMENT SYSTEM - JavaScript
   ============================================ */

// ============================================
// DATA MANAGEMENT
// ============================================

class LibrarySystem {
    constructor() {
        this.books = [];
        this.students = [];
        this.issues = [];
        this.activities = [];
        this.editingBook = null;
        this.editingStudent = null;
        this.loadFromLocalStorage();
        this.initializeSampleData();
    }

    // Load data from Local Storage
    loadFromLocalStorage() {
        const booksData = localStorage.getItem('rsmc_books');
        const studentsData = localStorage.getItem('rsmc_students');
        const issuesData = localStorage.getItem('rsmc_issues');

        if (booksData) this.books = JSON.parse(booksData);
        if (studentsData) this.students = JSON.parse(studentsData);
        if (issuesData) this.issues = JSON.parse(issuesData);
    }

    // Save data to Local Storage
    saveToLocalStorage() {
        localStorage.setItem('rsmc_books', JSON.stringify(this.books));
        localStorage.setItem('rsmc_students', JSON.stringify(this.students));
        localStorage.setItem('rsmc_issues', JSON.stringify(this.issues));
    }

    // Initialize sample data
    initializeSampleData() {
        if (this.books.length === 0) {
            const sampleBooks = [
                {
                    id: 'BK001',
                    name: 'Introduction to Computer Science',
                    author: 'Andrew S. Tanenbaum',
                    category: 'Computer Science',
                    isbn: '978-0-134-68599-1',
                    shelf: 'CS-101',
                    year: 2019,
                    quantity: 5,
                    available: 5,
                    cover: 'https://via.placeholder.com/150?text=CS+Book'
                },
                {
                    id: 'BK002',
                    name: 'Computer Networks',
                    author: 'James F. Kurose',
                    category: 'Networking',
                    isbn: '978-0-134-44204-4',
                    shelf: 'NET-201',
                    year: 2020,
                    quantity: 4,
                    available: 3,
                    cover: 'https://via.placeholder.com/150?text=Network'
                },
                {
                    id: 'BK003',
                    name: 'Cybersecurity Essentials',
                    author: 'Charles P. Pfleeger',
                    category: 'Cyber Security',
                    isbn: '978-0-134-54712-3',
                    shelf: 'SEC-301',
                    year: 2021,
                    quantity: 3,
                    available: 2,
                    cover: 'https://via.placeholder.com/150?text=Security'
                },
                {
                    id: 'BK004',
                    name: 'Discrete Mathematics',
                    author: 'Kenneth H. Rosen',
                    category: 'Mathematics',
                    isbn: '978-0-134-68599-1',
                    shelf: 'MATH-101',
                    year: 2018,
                    quantity: 6,
                    available: 4,
                    cover: 'https://via.placeholder.com/150?text=Math'
                },
                {
                    id: 'BK005',
                    name: 'English Literature',
                    author: 'Norton Anthology',
                    category: 'English',
                    isbn: '978-0-393-60300-8',
                    shelf: 'ENG-201',
                    year: 2019,
                    quantity: 5,
                    available: 5,
                    cover: 'https://via.placeholder.com/150?text=Literature'
                }
            ];
            this.books = sampleBooks;
            this.saveToLocalStorage();
        }

        if (this.students.length === 0) {
            const sampleStudents = [
                {
                    id: 'ST001',
                    name: 'Rahul Sharma',
                    email: 'rahul.sharma@rsmc.edu.np',
                    phone: '9841234567',
                    department: 'BSc CSIT',
                    semester: '4th',
                    address: 'Kathmandu, Nepal'
                },
                {
                    id: 'ST002',
                    name: 'Priya Poudel',
                    email: 'priya.poudel@rsmc.edu.np',
                    phone: '9841234568',
                    department: 'BCA',
                    semester: '2nd',
                    address: 'Lalitpur, Nepal'
                }
            ];
            this.students = sampleStudents;
            this.saveToLocalStorage();
        }
    }

    // Generate unique ID
    generateId(prefix) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 9).toUpperCase();
        return `${prefix}${timestamp}${random}`.substr(0, 10);
    }

    // Add activity
    addActivity(type, message) {
        const activity = {
            type,
            message,
            timestamp: new Date().toLocaleString(),
            id: this.generateId('ACT')
        };
        this.activities.unshift(activity);
        if (this.activities.length > 50) this.activities.pop();
    }
}

// Initialize Library System
const library = new LibrarySystem();

// ============================================
// UI CONTROLLER
// ============================================

class UIController {
    constructor() {
        this.currentPage = {
            books: 1,
            students: 1,
            issues: 1
        };
        this.itemsPerPage = 6;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('mobile-open');
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('rsmc_theme', document.body.classList.contains('dark-mode'));
        });

        // Scroll to top
        window.addEventListener('scroll', () => this.handleScrollTop());
        document.getElementById('scrollTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Book Management
        document.getElementById('addBookBtn').addEventListener('click', () => this.openBookModal());
        document.getElementById('bookForm').addEventListener('submit', (e) => this.submitBookForm(e));

        // Student Management
        document.getElementById('addStudentBtn').addEventListener('click', () => this.openStudentModal());
        document.getElementById('studentForm').addEventListener('submit', (e) => this.submitStudentForm(e));

        // Issue/Return
        document.getElementById('issueForm').addEventListener('submit', (e) => this.submitIssueForm(e));
        document.getElementById('returnForm').addEventListener('submit', (e) => this.submitReturnForm(e));

        // Contact Form
        document.getElementById('contactForm').addEventListener('submit', (e) => this.submitContactForm(e));

        // Search and Filters
        document.getElementById('bookSearch').addEventListener('input', () => this.filterBooks());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterBooks());
        document.getElementById('studentSearch').addEventListener('input', () => this.filterStudents());
        document.getElementById('departmentFilter').addEventListener('change', () => this.filterStudents());
        document.getElementById('issueSearch').addEventListener('input', () => this.filterIssues());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterIssues());

        // Global Search
        document.getElementById('globalSearch').addEventListener('input', (e) => this.globalSearch(e));

        // Quick Actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // Modal Close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e));
        });
        document.querySelectorAll('.btn-secondary[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e));
        });

        // Restore theme
        const isDarkMode = localStorage.getItem('rsmc_theme') === 'true';
        if (isDarkMode) document.body.classList.add('dark-mode');
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const sectionId = link.dataset.section;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Update active section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            books: 'Book Management',
            students: 'Student Management',
            'issue-return': 'Issue & Return Books',
            about: 'About Library',
            contact: 'Contact Us'
        };
        document.getElementById('pageTitle').textContent = titles[sectionId];

        // Close sidebar on mobile
        document.querySelector('.sidebar').classList.remove('mobile-open');

        // Render section content
        if (sectionId === 'books') this.renderBooks();
        if (sectionId === 'students') this.renderStudents();
        if (sectionId === 'issue-return') this.renderIssueReturn();
    }

    // Scroll to top button
    handleScrollTop() {
        const scrollTop = document.getElementById('scrollTop');
        if (window.scrollY > 300) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    }

    // ============================================
    // BOOKS MANAGEMENT
    // ============================================

    openBookModal(book = null) {
        const modal = document.getElementById('bookModal');
        const title = document.getElementById('bookModalTitle');
        const form = document.getElementById('bookForm');

        if (book) {
            title.textContent = 'Edit Book';
            library.editingBook = book;
            document.getElementById('bookId').value = book.id;
            document.getElementById('bookName').value = book.name;
            document.getElementById('bookAuthor').value = book.author;
            document.getElementById('bookCategory').value = book.category;
            document.getElementById('bookISBN').value = book.isbn;
            document.getElementById('bookShelf').value = book.shelf;
            document.getElementById('bookYear').value = book.year;
            document.getElementById('bookQuantity').value = book.quantity;
            document.getElementById('bookCover').value = book.cover || '';
        } else {
            title.textContent = 'Add New Book';
            library.editingBook = null;
            form.reset();
            document.getElementById('bookId').value = library.generateId('BK');
        }

        modal.classList.add('show');
    }

    submitBookForm(e) {
        e.preventDefault();

        const bookData = {
            id: document.getElementById('bookId').value,
            name: document.getElementById('bookName').value,
            author: document.getElementById('bookAuthor').value,
            category: document.getElementById('bookCategory').value,
            isbn: document.getElementById('bookISBN').value,
            shelf: document.getElementById('bookShelf').value,
            year: parseInt(document.getElementById('bookYear').value),
            quantity: parseInt(document.getElementById('bookQuantity').value),
            cover: document.getElementById('bookCover').value || 'https://via.placeholder.com/150?text=Book',
            available: parseInt(document.getElementById('bookQuantity').value)
        };

        if (library.editingBook) {
            const index = library.books.findIndex(b => b.id === library.editingBook.id);
            if (index !== -1) {
                library.books[index] = { ...library.books[index], ...bookData };
                library.addActivity('EDIT', `Book "${bookData.name}" updated`);
                this.showToast('Book updated successfully!', 'success');
            }
        } else {
            library.books.push(bookData);
            library.addActivity('ADD', `New book "${bookData.name}" added`);
            this.showToast('Book added successfully!', 'success');
        }

        library.saveToLocalStorage();
        this.closeModal({ currentTarget: { dataset: { modal: 'bookModal' } } });
        this.updateStats();
        this.renderBooks();
    }

    renderBooks() {
        const container = document.getElementById('booksContainer');
        let filteredBooks = [...library.books];

        // Apply filters
        const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;

        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book =>
                book.name.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.isbn.includes(searchTerm)
            );
        }

        if (category) {
            filteredBooks = filteredBooks.filter(book => book.category === category);
        }

        // Pagination
        const totalPages = Math.ceil(filteredBooks.length / this.itemsPerPage);
        const start = (this.currentPage.books - 1) * this.itemsPerPage;
        const paginatedBooks = filteredBooks.slice(start, start + this.itemsPerPage);

        if (paginatedBooks.length === 0) {
            container.innerHTML = '<p class="empty-state">No books found. Try adjusting your filters.</p>';
        } else {
            container.innerHTML = paginatedBooks.map(book => `
                <div class="book-card">
                    <div class="book-cover">
                        <img src="${book.cover}" alt="${book.name}" onerror="this.src='https://via.placeholder.com/150?text=Book'">
                    </div>
                    <div class="card-content">
                        <div class="card-title">${book.name}</div>
                        <div class="card-subtitle">by ${book.author}</div>
                        <div class="availability-badge ${book.available > 0 ? 'available' : 'unavailable'}">
                            ${book.available > 0 ? `${book.available} Available` : 'Unavailable'}
                        </div>
                        <div class="card-meta">
                            <span>${book.category}</span>
                            <span>${book.year}</span>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn" onclick="ui.openBookModal(library.books.find(b => b.id === '${book.id}'))">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="card-btn" onclick="ui.deleteBook('${book.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.renderPagination('booksPagination', totalPages, 'books');
    }

    deleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book?')) {
            const book = library.books.find(b => b.id === bookId);
            library.books = library.books.filter(b => b.id !== bookId);
            library.addActivity('DELETE', `Book "${book.name}" deleted`);
            library.saveToLocalStorage();
            this.showToast('Book deleted successfully!', 'success');
            this.updateStats();
            this.renderBooks();
        }
    }

    filterBooks() {
        this.currentPage.books = 1;
        this.renderBooks();
    }

    // ============================================
    // STUDENTS MANAGEMENT
    // ============================================

    openStudentModal(student = null) {
        const modal = document.getElementById('studentModal');
        const title = document.getElementById('studentModalTitle');
        const form = document.getElementById('studentForm');

        if (student) {
            title.textContent = 'Edit Student';
            library.editingStudent = student;
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentPhone').value = student.phone;
            document.getElementById('studentDepartment').value = student.department;
            document.getElementById('studentSemester').value = student.semester;
            document.getElementById('studentAddress').value = student.address;
        } else {
            title.textContent = 'Add New Student';
            library.editingStudent = null;
            form.reset();
            document.getElementById('studentId').value = library.generateId('ST');
        }

        modal.classList.add('show');
    }

    submitStudentForm(e) {
        e.preventDefault();

        const studentData = {
            id: document.getElementById('studentId').value,
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            phone: document.getElementById('studentPhone').value,
            department: document.getElementById('studentDepartment').value,
            semester: document.getElementById('studentSemester').value,
            address: document.getElementById('studentAddress').value
        };

        if (library.editingStudent) {
            const index = library.students.findIndex(s => s.id === library.editingStudent.id);
            if (index !== -1) {
                library.students[index] = { ...library.students[index], ...studentData };
                library.addActivity('EDIT', `Student "${studentData.name}" updated`);
                this.showToast('Student updated successfully!', 'success');
            }
        } else {
            library.students.push(studentData);
            library.addActivity('ADD', `New student "${studentData.name}" added`);
            this.showToast('Student added successfully!', 'success');
        }

        library.saveToLocalStorage();
        this.closeModal({ currentTarget: { dataset: { modal: 'studentModal' } } });
        this.updateStats();
        this.renderStudents();
    }

    renderStudents() {
        const container = document.getElementById('studentsContainer');
        let filteredStudents = [...library.students];

        // Apply filters
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const department = document.getElementById('departmentFilter').value;

        if (searchTerm) {
            filteredStudents = filteredStudents.filter(student =>
                student.name.toLowerCase().includes(searchTerm) ||
                student.id.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            );
        }

        if (department) {
            filteredStudents = filteredStudents.filter(student => student.department === department);
        }

        // Pagination
        const totalPages = Math.ceil(filteredStudents.length / this.itemsPerPage);
        const start = (this.currentPage.students - 1) * this.itemsPerPage;
        const paginatedStudents = filteredStudents.slice(start, start + this.itemsPerPage);

        if (paginatedStudents.length === 0) {
            container.innerHTML = '<p class="empty-state">No students found. Try adjusting your filters.</p>';
        } else {
            container.innerHTML = paginatedStudents.map(student => `
                <div class="student-card">
                    <div style="padding: 20px; text-align: center; background: linear-gradient(135deg, #0A66C2, #4DA6FF); color: white; border-radius: 12px 12px 0 0;">
                        <i class="fas fa-user-circle" style="font-size: 3em; margin-bottom: 10px;"></i>
                        <div style="font-weight: 600; font-size: 1em;">${student.id}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${student.name}</div>
                        <div class="card-subtitle">${student.department}</div>
                        <div style="font-size: 0.85em; color: #666; margin-bottom: 10px;">
                            <p><strong>Semester:</strong> ${student.semester}</p>
                            <p><strong>Email:</strong> ${student.email}</p>
                            <p><strong>Phone:</strong> ${student.phone}</p>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn" onclick="ui.openStudentModal(library.students.find(s => s.id === '${student.id}'))">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="card-btn" onclick="ui.deleteStudent('${student.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.renderPagination('studentsPagination', totalPages, 'students');
    }

    deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            const student = library.students.find(s => s.id === studentId);
            library.students = library.students.filter(s => s.id !== studentId);
            library.addActivity('DELETE', `Student "${student.name}" deleted`);
            library.saveToLocalStorage();
            this.showToast('Student deleted successfully!', 'success');
            this.updateStats();
            this.renderStudents();
        }
    }

    filterStudents() {
        this.currentPage.students = 1;
        this.renderStudents();
    }

    // ============================================
    // ISSUE & RETURN MANAGEMENT
    // ============================================

    submitIssueForm(e) {
        e.preventDefault();

        const studentInput = document.getElementById('issueStudent').value.toLowerCase();
        const bookInput = document.getElementById('issueBook').value.toLowerCase();
        const dueDate = document.getElementById('issueDueDate').value;

        // Find student and book
        const student = library.students.find(s =>
            s.id.toLowerCase() === studentInput || s.name.toLowerCase().includes(studentInput)
        );
        const book = library.books.find(b =>
            b.id.toLowerCase() === bookInput || b.name.toLowerCase().includes(bookInput)
        );

        if (!student) {
            this.showToast('Student not found!', 'error');
            return;
        }

        if (!book) {
            this.showToast('Book not found!', 'error');
            return;
        }

        if (book.available <= 0) {
            this.showToast('Book is not available!', 'error');
            return;
        }

        // Create issue record
        const issueRecord = {
            id: library.generateId('ISS'),
            studentId: student.id,
            studentName: student.name,
            bookId: book.id,
            bookName: book.name,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: dueDate,
            returnDate: null,
            status: 'Issued',
            fine: 0
        };

        library.issues.push(issueRecord);
        book.available--;
        library.addActivity('ISSUE', `Book "${book.name}" issued to "${student.name}"`);
        library.saveToLocalStorage();

        this.showToast(`Book issued to ${student.name}!`, 'success');
        document.getElementById('issueForm').reset();
        this.renderIssueReturn();
        this.updateStats();
    }

    submitReturnForm(e) {
        e.preventDefault();

        const issueIdInput = document.getElementById('returnIssueId').value;
        const returnDate = document.getElementById('returnDate').value;

        // Find issue record
        const issue = library.issues.find(i => i.id === issueIdInput || i.id.toLowerCase().includes(issueIdInput.toLowerCase()));

        if (!issue) {
            this.showToast('Issue record not found!', 'error');
            return;
        }

        if (issue.status === 'Returned') {
            this.showToast('This book has already been returned!', 'warning');
            return;
        }

        // Calculate fine
        const dueDate = new Date(issue.dueDate);
        const actualReturnDate = new Date(returnDate);
        let fine = 0;

        if (actualReturnDate > dueDate) {
            const daysOverdue = Math.floor((actualReturnDate - dueDate) / (1000 * 60 * 60 * 24));
            fine = daysOverdue * 5; // Rs. 5 per day
        }

        // Update issue record
        issue.returnDate = returnDate;
        issue.status = 'Returned';
        issue.fine = fine;

        // Update book availability
        const book = library.books.find(b => b.id === issue.bookId);
        if (book) book.available++;

        library.addActivity('RETURN', `Book "${issue.bookName}" returned by "${issue.studentName}" (Fine: Rs. ${fine})`);
        library.saveToLocalStorage();

        if (fine > 0) {
            this.showToast(`Book returned! Fine: Rs. ${fine}`, 'warning');
        } else {
            this.showToast('Book returned successfully!', 'success');
        }

        document.getElementById('returnForm').reset();
        this.renderIssueReturn();
        this.updateStats();
    }

    renderIssueReturn() {
        const tbody = document.getElementById('issueTableBody');
        let filteredIssues = [...library.issues];

        // Apply filters
        const searchTerm = document.getElementById('issueSearch').value.toLowerCase();
        const status = document.getElementById('statusFilter').value;

        if (searchTerm) {
            filteredIssues = filteredIssues.filter(issue =>
                issue.studentName.toLowerCase().includes(searchTerm) ||
                issue.bookName.toLowerCase().includes(searchTerm) ||
                issue.id.toLowerCase().includes(searchTerm)
            );
        }

        if (status) {
            filteredIssues = filteredIssues.filter(issue => issue.status === status);
        }

        if (filteredIssues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No issue records found</td></tr>';
        } else {
            tbody.innerHTML = filteredIssues.map(issue => {
                const statusClass = issue.status.toLowerCase();
                return `
                    <tr>
                        <td><strong>${issue.id}</strong></td>
                        <td>${issue.studentName}</td>
                        <td>${issue.bookName}</td>
                        <td>${issue.issueDate}</td>
                        <td>${issue.dueDate}</td>
                        <td>${issue.returnDate || '-'}</td>
                        <td><span class="status-badge ${statusClass}">${issue.status}</span></td>
                        <td>Rs. ${issue.fine}</td>
                        <td>
                            ${issue.status === 'Issued' ? `
                                <button class="card-btn" onclick="ui.deleteIssue('${issue.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            ` : '-'}
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    deleteIssue(issueId) {
        if (confirm('Are you sure you want to cancel this issue?')) {
            const issue = library.issues.find(i => i.id === issueId);
            const book = library.books.find(b => b.id === issue.bookId);
            if (book) book.available++;

            library.issues = library.issues.filter(i => i.id !== issueId);
            library.addActivity('CANCEL', `Issue "${issue.id}" cancelled`);
            library.saveToLocalStorage();
            this.showToast('Issue cancelled successfully!', 'success');
            this.renderIssueReturn();
            this.updateStats();
        }
    }

    filterIssues() {
        this.renderIssueReturn();
    }

    // ============================================
    // DASHBOARD & STATS
    // ============================================

    updateStats() {
        // Total books
        const totalBooks = library.books.reduce((sum, book) => sum + book.quantity, 0);
        document.getElementById('totalBooksCount').textContent = totalBooks;
        document.getElementById('aboutTotalBooks').textContent = totalBooks;

        // Available books
        const availableBooks = library.books.reduce((sum, book) => sum + book.available, 0);
        document.getElementById('availableBooksCount').textContent = availableBooks;

        // Issued books
        const issuedBooks = library.issues.filter(i => i.status === 'Issued').length;
        document.getElementById('issuedBooksCount').textContent = issuedBooks;

        // Students
        document.getElementById('totalStudentsCount').textContent = library.students.length;
    }

    renderDashboard() {
        this.updateStats();
        this.renderRecentActivity();
    }

    renderRecentActivity() {
        const activityList = document.getElementById('recentActivityList');

        if (library.activities.length === 0) {
            activityList.innerHTML = '<p class="empty-state">No recent activity</p>';
        } else {
            activityList.innerHTML = library.activities.slice(0, 10).map(activity => `
                <div class="activity-item">
                    <strong>${activity.message}</strong>
                    <div class="activity-time">${activity.timestamp}</div>
                </div>
            `).join('');
        }
    }

    // ============================================
    // CONTACT FORM
    // ============================================

    submitContactForm(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        // Simulate sending message
        library.addActivity('CONTACT', `Message from "${name}" (${email}): ${subject}`);
        library.saveToLocalStorage();

        this.showToast('Message sent successfully! We will get back to you soon.', 'success');
        document.getElementById('contactForm').reset();
    }

    // ============================================
    // UTILITIES
    // ============================================

    globalSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) return;

        // Search in books
        const foundBooks = library.books.filter(b =>
            b.name.toLowerCase().includes(searchTerm) ||
            b.author.toLowerCase().includes(searchTerm)
        );

        // Search in students
        const foundStudents = library.students.filter(s =>
            s.name.toLowerCase().includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm)
        );

        if (foundBooks.length > 0) {
            this.showToast(`Found ${foundBooks.length} books`, 'info');
        }
        if (foundStudents.length > 0) {
            this.showToast(`Found ${foundStudents.length} students`, 'info');
        }
    }

    handleQuickAction(e) {
        const action = e.currentTarget.dataset.action;

        switch (action) {
            case 'add-book':
                this.openBookModal();
                break;
            case 'add-student':
                this.openStudentModal();
                break;
            case 'issue-book':
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelector('[data-section="issue-return"]').classList.add('active');
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.getElementById('issue-return').classList.add('active');
                document.getElementById('pageTitle').textContent = 'Issue & Return Books';
                this.renderIssueReturn();
                document.getElementById('issueStudent').focus();
                break;
            case 'return-book':
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelector('[data-section="issue-return"]').classList.add('active');
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.getElementById('issue-return').classList.add('active');
                document.getElementById('pageTitle').textContent = 'Issue & Return Books';
                this.renderIssueReturn();
                document.getElementById('returnIssueId').focus();
                break;
        }
    }

    renderPagination(containerId, totalPages, type) {
        const container = document.getElementById(containerId);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        const currentPage = this.currentPage[type];

        if (currentPage > 1) {
            html += `<button class="pagination-btn" onclick="ui.goToPage(${currentPage - 1}, '${type}')">Previous</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<button class="pagination-btn active">${i}</button>`;
            } else {
                html += `<button class="pagination-btn" onclick="ui.goToPage(${i}, '${type}')">${i}</button>`;
            }
        }

        if (currentPage < totalPages) {
            html += `<button class="pagination-btn" onclick="ui.goToPage(${currentPage + 1}, '${type}')">Next</button>`;
        }

        container.innerHTML = html;
    }

    goToPage(page, type) {
        this.currentPage[type] = page;
        if (type === 'books') this.renderBooks();
        if (type === 'students') this.renderStudents();
        if (type === 'issues') this.renderIssueReturn();
    }

    closeModal(e) {
        const modalId = e.currentTarget.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize UI
const ui = new UIController();

// Event delegation for dynamic elements
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-modal]')) {
        ui.closeModal(e);
    }
});
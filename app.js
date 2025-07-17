/**
 * IllumiNation PH - app.js
 * --------------------------
 * This global script manages all local data storage and dynamic content updates
 * for the IllumiNation PH website using the browser's localStorage.
 *
 * It handles:
 * - Data Seeding (for first-time use)
 * - User Authentication (Login, Logout)
 * - Session Management & Page Protection
 * - Data Models (Users, Tickets, Donations, Reports, Volunteers, Stories)
 * - Dynamic content rendering across all pages.
 */

// --- CORE DATA MANAGEMENT ---
const DB = {
    get: (key) => {
        const data = localStorage.getItem(key);
        try {
            // Initialize with default values if key doesn't exist
            if (data === null) {
                if (key === 'donationAllocation') {
                    const defaultAllocation = {
                        labels: ['Donation Drives', 'Educational Materials', 'Solar Panels', 'Environmental', 'Charity Events'],
                        data: [20, 35, 25, 10, 5]
                    };
                    DB.set(key, defaultAllocation);
                    return defaultAllocation;
                }
                return null;
            }
            return JSON.parse(data);
        } catch (e) {
            console.error(`Error parsing localStorage item "${key}":`, e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error setting localStorage item "${key}":`, e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// --- DATA SEEDING ---
const Seed = {
    init: () => {
        if (!DB.get('users')) {
            console.log("Seeding initial user data into localStorage...");
            DB.set('users', [
                {
                    username: 'admin',
                    email: 'admin@illuminatioph.com',
                    password: 'password',
                    role: 'admin',
                    profilePic: 'https://placehold.co/120x120/112B3C/FFFFFF?text=Admin',
                    name: 'Admin User'
                },
                {
                    username: 'juan_delacruz',
                    email: 'juan.delacruz@email.com',
                    password: 'password',
                    role: 'user',
                    profilePic: 'https://placehold.co/150x150/F66B0E/FFFFFF?text=Juan',
                    bio: 'Passionate about bringing light to rural areas. I enjoy hiking and community work.',
                    location: 'Manila, Philippines',
                    donations: [
                        { amount: 500, date: '2025-06-15' },
                        { amount: 1000, date: '2025-07-01' }
                    ],
                    volunteerHours: 20,
                    reports: ['Maguindanao del Sur']
                }
            ]);
        }
        if (!DB.get('tickets')) {
            DB.set('tickets', [
                 { id: 1, subject: "Cannot log in to my account", status: "Open", submittedBy: "juan_delacruz", assignedTo: "admin", submittedDate: "2025-07-01", lastUpdated: "2025-07-03" },
                 { id: 2, subject: "Donation receipt not received", status: "In Progress", submittedBy: "guest_user", assignedTo: "admin", submittedDate: "2025-06-28", lastUpdated: "2025-07-02" },
                 { id: 3, subject: "Website is slow on mobile", status: "Closed", submittedBy: "juan_delacruz", assignedTo: "admin", submittedDate: "2025-06-20", lastUpdated: "2025-06-25" }
            ]);
        }
        if (!DB.get('volunteerTickets')) {
            DB.set('volunteerTickets', [
                 { id: 'V001', subject: "Application for Solar Panel Installation", status: "In Progress", submittedBy: "juan_delacruz", submittedDate: "2025-07-05", lastUpdated: "2025-07-06" },
                 { id: 'V002', subject: "Community Outreach Program Sign-up", status: "Closed", submittedBy: "juan_delacruz", submittedDate: "2025-05-10", lastUpdated: "2025-05-20" }
            ]);
        }
        if (!DB.get('donations')) {
            DB.set('donations', [
                { amount: 500, method: 'GCash', name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', date: '2025-06-15' },
                { amount: 1000, method: 'GCash', name: 'Maria Santos', email: 'maria.santos@email.com', date: '2025-06-20' },
                 { amount: 250, method: 'GCash', name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', date: '2025-07-01' }
            ]);
        }
        if (!DB.get('reports')) {
             DB.set('reports', [
                {
                    id: 'R987654',
                    region: 'BARMM – Bangsamoro Autonomous Region in Muslim Mindanao',
                    province: 'Maguindanao del Sur',
                    cityMunicipality: 'Datu Saudi-Ampatuan',
                    barangay: 'Kitango',
                    gps: '6.9382, 124.4211',
                    status: 'No Access',
                    observationDate: '2025-06-28',
                    households: 150,
                    powerSources: ['None'],
                    hours: 0,
                    description: 'The entire barangay has never had access to the grid. They rely on kerosene lamps.',
                    reporterName: 'Juan Dela Cruz',
                    reporterEmail: 'juan.delacruz@email.com',
                    isAnonymous: false,
                },
                {
                    id: 'R123456',
                    region: 'MIMAROPA Region',
                    province: 'Palawan',
                    cityMunicipality: 'El Nido',
                    barangay: 'Bucana',
                    gps: '11.1795, 119.3938',
                    status: 'Intermittent Access',
                    observationDate: '2025-07-01',
                    households: 200,
                    powerSources: ['Generator'],
                    hours: 6,
                    description: 'Power is only available from 6 PM to 12 AM through a community generator.',
                    reporterName: 'Maria Santos',
                    reporterEmail: 'maria.santos@email.com',
                    isAnonymous: false,
                }
            ]);
        }
        if (!DB.get('stories')) {
            DB.set('stories', [
                {
                    id: "story-1",
                    title: "First Light in Barangay Mapayapa",
                    content: "I never thought I'd see the day my kids could study at night without a kerosene lamp. The new solar hub has changed everything for us...",
                    author: "Elena D.",
                    tags: ["Community Story", "Solar Hub"],
                    likes: 15,
                    comments: ["This is so inspiring!", "Amazing work, IllumiNation PH!"],
                    isFeatured: true
                },
                {
                    id: "story-2",
                    title: "Starting My Business with Solar Power",
                    content: "A discussion on how reliable electricity from a solar micro-grid enabled a local entrepreneur to start a small tailoring business.",
                    author: "Admin",
                    tags: ["Livelihood", "Entrepreneurship"],
                    likes: 22,
                    comments: [],
                    isFeatured: true
                }
            ]);
        }
        // Seed donation allocation data if it doesn't exist
        if (!DB.get('donationAllocation')) {
             DB.set('donationAllocation', {
                labels: ['Donation Drives', 'Educational Materials', 'Solar Panels', 'Environmental', 'Charity Events'],
                data: [20, 35, 25, 10, 5]
            });
        }
    }
};

// --- SESSION & UI MANAGEMENT ---
const Session = {
    protectPage: () => {
        const publicPages = [
            '/',
            '/index.html',
            '/HOMEPAGE/Draft_Home.html',
            '/ADMIN_SIGNUP/auth.html', // Updated
            '/ADMIN_SIGNUP/create-admin.html', // New secret page
            '/REPORT_ELECTRICITY/PrivacyPolicy.html'
        ];
        
        const currentPath = window.location.pathname;
        const isPublicPage = publicPages.some(page => currentPath.endsWith(page));

        if (!isPublicPage && !Session.getCurrentUser()) {
            alert('You must be logged in to view this page. Redirecting to login.');
            window.location.href = '/ADMIN_SIGNUP/auth.html';
        }
    },

    init: () => {
        const currentUser = DB.get('currentUser');
        const navbar = document.querySelector('.navbar');

        if (navbar) {
             const loginDropdownContainer = navbar.querySelector('.dropdown:last-of-type');
            
            if (currentUser) {
                if (loginDropdownContainer) {
                    const profileLink = currentUser.role === 'admin'
                        ? '/DASHBOARD/Admin_Dashboard/profile-editor.html'
                        : '/DASHBOARD/User_Dashboard/profile_editor.html';

                    loginDropdownContainer.innerHTML = `
                        <button class="dropbtn">${currentUser.username}</button>
                        <div class="dropdown-content">
                            <a href="${profileLink}">Edit Profile</a>
                            <a href="#" id="logoutButton">Logout</a>
                        </div>
                    `;
                    const logoutButton = document.getElementById('logoutButton');
                    if(logoutButton) {
                       logoutButton.addEventListener('click', Session.logout);
                    }
                }
            } else {
                 if (loginDropdownContainer) {
                    loginDropdownContainer.innerHTML = `
                        <button class="dropbtn">Login</button>
                        <div class="dropdown-content">
                          <a href="/ADMIN_SIGNUP/auth.html">Login / Sign Up</a>
                        </div>
                    `;
                 }
            }
        }
    },

    logout: (e) => {
        if(e) e.preventDefault();
        DB.remove('currentUser');
        alert('You have been logged out.');
        window.location.href = '/ADMIN_SIGNUP/auth.html';
    },

    getCurrentUser: () => {
        return DB.get('currentUser');
    },

    authenticate: (requiredRole) => {
        const currentUser = Session.getCurrentUser();
        if (!currentUser) {
            alert('You must be logged in to view this page.');
            window.location.href = '/ADMIN_SIGNUP/auth.html';
            return null;
        }
        if (requiredRole && currentUser.role !== requiredRole) {
            alert(`Access Denied. You must be a${requiredRole === 'admin' ? 'n' : ''} ${requiredRole} to view this page.`);
            const redirectUrl = currentUser.role === 'admin' ? '/DASHBOARD/Admin_Dashboard/adminDashboard.html' : '/DASHBOARD/User_Dashboard/userDashboard.html';
            window.location.href = redirectUrl;
            return null;
        }
        return currentUser;
    }
};

// --- GLOBAL INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    Seed.init();
    Session.init();
    // Session.protectPage(); // Uncomment this line on all pages except public ones if you need strict page protection
});

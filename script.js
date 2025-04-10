$(document).ready(function() {
    loadAllDataCarousel();
    if (document.getElementById('about-container')) loadAbout();
    if (document.getElementById('contact-container')) loadContact();
    if (document.getElementById('blog-container')) loadBlogs();
    if (document.getElementById('members-container')) loadMembers();
    if (document.getElementById('gallery-container')) loadGallery();
    if (document.getElementById('events-container')) loadEvents();
    if (document.getElementById('workshops-container')) loadWorkshops();
    if (document.getElementById('projects-container')) loadProjects();
    if (document.getElementById('instructors-container')) loadInstructors();
    if (document.getElementById('testimonials-container')) loadTestimonials();
    if (document.getElementById('achievements-container')) loadAchievements();

    if (localStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('dashboard-btn').classList.remove('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        initializeAdminPanel();
    }

    setInterval(rotateCarouselItems, 2000);

    // Dynamic Footer Year
    document.getElementById('footer-year').textContent = new Date().getFullYear();
});

// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('active');
});

// Login/Logout Functions
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === 'user123' && password === 'user I love you nimita') {
        localStorage.setItem('adminLoggedIn', 'true');
        closeLoginModal();
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('dashboard-btn').classList.remove('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        initializeAdminPanel();
    } else {
        alert('Invalid credentials');
    }
}

function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('login-btn').classList.remove('hidden');
    document.getElementById('dashboard-btn').classList.add('hidden');
}

// Membership Form Handling
function showForm() {
    document.getElementById('membership-form').classList.remove('hidden');
}

function validateForm(formData) {
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const age = formData.get('age').trim();
    const occupation = formData.get('occupation').trim();
    const location = formData.get('location').trim();
    const motivation = formData.get('motivation').trim();
    const skills = formData.get('skills').trim();
    const interests = formData.get('interests').trim();
    const terms = formData.get('terms');

    if (!name || name.length < 2) return "Name must be at least 2 characters.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
    if (!phone || !/^\d{10}$/.test(phone)) return "Phone must be a 10-digit number.";
    if (!age || isNaN(age) || age < 13 || age > 120) return "Age must be a number between 13 and 120.";
    if (!occupation || occupation.length < 2) return "Occupation must be at least 2 characters.";
    if (!location || location.length < 2) return "Location must be at least 2 characters.";
    if (!motivation || motivation.length < 10) return "Motivation must be at least 10 characters.";
    if (!skills || skills.length < 10) return "Skills must be at least 10 characters.";
    if (!interests || interests.length < 10) return "Interests must be at least 10 characters.";
    if (!terms) return "You must agree to the terms.";

    return null;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('join-form'));
    const validationError = validateForm(formData);

    if (validationError) {
        alert(validationError);
        return;
    }

    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        occupation: formData.get('occupation'),
        location: formData.get('location'),
        motivation: formData.get('motivation'),
        skills: formData.get('skills'),
        interests: formData.get('interests'),
        date: new Date().toLocaleDateString()
    };
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('whatsapp-link').classList.remove('hidden');
    document.getElementById('membership-form').classList.add('hidden');
    alert('Thank you for joining The Immersing Youth Community!');
}

// Utility Function
function processImageUpload(file, callback) {
    if (!file) {
        callback(null);
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('Failed to upload image.');
    };
    reader.readAsDataURL(file);
}

// Toggle Folder
function toggleFolder(element) {
    const folder = element.parentElement;
    folder.classList.toggle('active');
}

// Fullscreen Image Viewer
function openFullscreen(imageSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.innerHTML = `
        <span class="close-fullscreen" onclick="this.parentElement.remove()">×</span>
        <img src="${imageSrc}" alt="Fullscreen Image">
    `;
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
}

// All Data Carousel
function loadAllDataCarousel() {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];

    const items = [];

    // Gallery
    Object.keys(gallery).forEach(folder => {
        gallery[folder].forEach(item => {
            items.push({ type: 'gallery', image: item.media, title: `${folder} Image`, content: item.caption });
        });
    });

    // Members
    Object.keys(members).forEach(folder => {
        members[folder].forEach(member => {
            items.push({ type: 'member', image: member.photo, title: member.name, content: member.details });
        });
    });

    // Blogs
    Object.keys(blogs).forEach(folder => {
        blogs[folder].forEach(blog => {
            items.push({ type: 'blog', image: null, title: blog.title, content: blog.content });
        });
    });

    // Events
    events.forEach(event => {
        items.push({ type: 'event', image: event.image, title: event.title, content: event.content });
    });

    // Workshops
    workshops.forEach(workshop => {
        items.push({ type: 'workshop', image: workshop.image, title: workshop.title, content: workshop.content });
    });

    // Projects
    projects.forEach(project => {
        items.push({ type: 'project', image: project.image, title: project.title, content: project.content });
    });

    // Instructors
    instructors.forEach(instructor => {
        items.push({ type: 'instructor', image: instructor.image, title: instructor.title, content: instructor.content });
    });

    // Testimonials
    testimonials.forEach(testimonial => {
        items.push({ type: 'testimonial', image: testimonial.image, title: testimonial.title, content: testimonial.content });
    });

    // Achievements
    achievements.forEach(achievement => {
        items.push({ type: 'achievement', image: achievement.image, title: achievement.title, content: achievement.content });
    });

    const container = document.getElementById('all-data-carousel');
    if (container) {
        container.innerHTML = items.map((item, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `).join('');
    }
}

function rotateCarouselItems() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;
    const activeItem = document.querySelector('.carousel-item.active');
    const currentIndex = Array.from(items).indexOf(activeItem);
    const nextIndex = (currentIndex + 1) % items.length;
    activeItem.classList.remove('active');
    items[nextIndex].classList.add('active');
}

// Initialize Admin Panel
function initializeAdminPanel() {
    loadAboutAdmin();
    loadContactAdmin();
    loadGalleryAdmin();
    loadBlogsAdmin();
    loadMembersAdmin();
    loadEventsAdmin();
    loadWorkshopsAdmin();
    loadProjectsAdmin();
    loadInstructorsAdmin();
    loadTestimonialsAdmin();
    loadAchievementsAdmin();
}

// About Us
function addAbout() {
    const title = document.getElementById('about-title').value;
    const content = document.getElementById('about-content').value;
    const image = document.getElementById('about-image').files[0];

    if (!title || !content) {
        alert('Please fill in all About Us details.');
        return;
    }

    const abouts = JSON.parse(localStorage.getItem('abouts')) || [];
    processImageUpload(image, (imageData) => {
        abouts.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('abouts', JSON.stringify(abouts));
        loadAbout();
        loadAboutAdmin();
        document.getElementById('about-title').value = '';
        document.getElementById('about-content').value = '';
        document.getElementById('about-image').value = '';
        alert('About Us entry added successfully!');
    });
}

function loadAbout() {
    const abouts = JSON.parse(localStorage.getItem('abouts')) || [];
    const container = document.getElementById('about-container');
    if (container) {
        container.innerHTML = abouts.length ? abouts.map(a => `
            <div class="section-item">
                ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ''}
                <h3>${a.title}</h3>
                <p>${a.content}</p>
            </div>
        `).join('') : '<p>No About Us content available yet.</p>';
    }
}

function loadAboutAdmin() {
    const abouts = JSON.parse(localStorage.getItem('abouts')) || [];
    const container = document.getElementById('about-list');
    if (container) {
        container.innerHTML = abouts.map(a => `
            <div class="item">
                <span>${a.title}</span>
                <button onclick="deleteAbout(${a.id})">Delete</button>
            </div>
        `).join('');
    }
}

function deleteAbout(id) {
    let abouts = JSON.parse(localStorage.getItem('abouts')) || [];
    abouts = abouts.filter(a => a.id !== id);
    localStorage.setItem('abouts', JSON.stringify(abouts));
    loadAbout();
    loadAboutAdmin();
}

// Contact
function addContact() {
    const title = document.getElementById('contact-title').value;
    const content = document.getElementById('contact-content').value;
    const image = document.getElementById('contact-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Contact details.');
        return;
    }

    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    processImageUpload(image, (imageData) => {
        contacts.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        loadContact();
        loadContactAdmin();
        document.getElementById('contact-title').value = '';
        document.getElementById('contact-content').value = '';
        document.getElementById('contact-image').value = '';
        alert('Contact entry added successfully!');
    });
}

function loadContact() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const container = document.getElementById('contact-container');
    if (container) {
        container.innerHTML = contacts.length ? contacts.map(c => `
            <div class="section-item">
                ${c.image ? `<img src="${c.image}" alt="${c.title}">` : ''}
                <h3>${c.title}</h3>
                <p>${c.content}</p>
            </div>
        `).join('') : '<p>No Contact information available yet.</p>';
    }
}

function loadContactAdmin() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const container = document.getElementById('contact-list');
    if (container) {
        container.innerHTML = contacts.map(c => `
            <div class="item">
                <span>${c.title}</span>
                <button onclick="deleteContact(${c.id})">Delete</button>
            </div>
        `).join('');
    }
}

function deleteContact(id) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts = contacts.filter(c => c.id !== id);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    loadContact();
    loadContactAdmin();
}

// Gallery
function uploadToGallery() {
    const folderName = document.getElementById('gallery-folder').value.trim();
    const files = document.getElementById('gallery-upload').files;
    const caption = document.getElementById('image-caption').value.trim() || "No caption";

    if (!folderName || files.length === 0) {
        alert('Please provide a folder name and select at least one image.');
        return;
    }

    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    gallery[folderName] = gallery[folderName] || [];
    let processedFiles = 0;

    Array.from(files).forEach((file, index) => {
        processImageUpload(file, (imageData) => {
            if (imageData) {
                gallery[folderName].push({
                    id: Date.now() + index,
                    media: imageData,
                    caption: caption
                });
            }
            processedFiles++;
            if (processedFiles === files.length) {
                try {
                    localStorage.setItem('gallery', JSON.stringify(gallery));
                    loadGallery();
                    loadGalleryAdmin();
                    loadAllDataCarousel();
                    document.getElementById('gallery-folder').value = '';
                    document.getElementById('gallery-upload').value = '';
                    document.getElementById('image-caption').value = '';
                    alert(`${files.length} images uploaded to ${folderName}!`);
                } catch (e) {
                    console.error('Error saving gallery:', e);
                    alert('Failed to upload images. Storage might be full.');
                }
            }
        });
    });
}

function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    const container = document.getElementById('gallery-container');
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (container) {
        container.innerHTML = Object.keys(gallery).map(folder => {
            const firstImage = gallery[folder][0]?.media || '';
            return `
                <div class="folder">
                    ${firstImage ? `<img src="${firstImage}" alt="${folder}">` : ''}
                    <h4 onclick="toggleFolder(this)">${folder}</h4>
                    ${isAdmin ? `
                        <div class="folder-controls">
                            <button onclick="editGalleryFolder('${folder}')">Edit</button>
                            <button onclick="deleteGalleryFolder('${folder}')">Delete</button>
                        </div>
                    ` : ''}
                    <div class="folder-content">
                        ${gallery[folder].map(item => `
                            <div class="gallery-item" onclick="event.stopPropagation(); openFullscreen('${item.media}')">
                                <img src="${item.media}" alt="${item.caption}">
                                <p class="gallery-caption">${item.caption}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function loadGalleryAdmin() {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    const container = document.getElementById('gallery-list');
    if (container) {
        container.innerHTML = Object.keys(gallery).map(folder => `
            <div class="item">
                <span>${folder} (${gallery[folder].length} items)</span>
                <button onclick="deleteGalleryFolder('${folder}')">Delete</button>
            </div>
        `).join('');
    }
}

function editGalleryFolder(folder) {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Gallery Folder: ${folder}</h4>
        <input type="text" id="edit-gallery-folder" value="${folder}">
        <button onclick="saveGalleryFolderEdit('${folder}')">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveGalleryFolderEdit(oldFolder) {
    const gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    const newFolder = document.getElementById('edit-gallery-folder').value.trim();
    if (!newFolder) {
        alert('Folder name cannot be empty.');
        return;
    }
    if (newFolder !== oldFolder && gallery[newFolder]) {
        alert('Folder name already exists.');
        return;
    }
    gallery[newFolder] = gallery[oldFolder];
    delete gallery[oldFolder];
    localStorage.setItem('gallery', JSON.stringify(gallery));
    loadGallery();
    loadGalleryAdmin();
    loadAllDataCarousel();
    document.querySelector('.edit-modal').remove();
}

function deleteGalleryFolder(folder) {
    let gallery = JSON.parse(localStorage.getItem('gallery')) || {};
    delete gallery[folder];
    localStorage.setItem('gallery', JSON.stringify(gallery));
    loadGallery();
    loadGalleryAdmin();
    loadAllDataCarousel();
}

// Blogs
function addBlog() {
    const folderName = document.getElementById('blog-folder').value;
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;

    if (!folderName || !title || !content) {
        alert('Please fill in all Blog details.');
        return;
    }

    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    blogs[folderName] = blogs[folderName] || [];
    blogs[folderName].push({ id: Date.now(), title, content });
    localStorage.setItem('blogs', JSON.stringify(blogs));
    loadBlogs();
    loadBlogsAdmin();
    loadAllDataCarousel();
    document.getElementById('blog-folder').value = '';
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-content').value = '';
    alert('Blog added successfully!');
}

function loadBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    const container = document.getElementById('blog-container');
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (container) {
        container.innerHTML = Object.keys(blogs).map(folder => `
            <div class="folder">
                <h4 onclick="toggleFolder(this)">${folder}</h4>
                ${isAdmin ? `
                    <div class="folder-controls">
                        <button onclick="editBlogFolder('${folder}')">Edit</button>
                        <button onclick="deleteBlogFolder('${folder}')">Delete</button>
                    </div>
                ` : ''}
                <div class="folder-content">
                    ${blogs[folder].map(b => `
                        <div class="blog-item">
                            <h3>${b.title}</h3>
                            <p>${b.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

function loadBlogsAdmin() {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    const container = document.getElementById('blog-list');
    if (container) {
        container.innerHTML = Object.keys(blogs).map(folder => `
            <div class="item">
                <span>${folder} (${blogs[folder].length} blogs)</span>
                <button onclick="deleteBlogFolder('${folder}')">Delete</button>
            </div>
        `).join('');
    }
}

function editBlogFolder(folder) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Blog Folder: ${folder}</h4>
        <input type="text" id="edit-blog-folder" value="${folder}">
        <button onclick="saveBlogFolderEdit('${folder}')">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveBlogFolderEdit(oldFolder) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    const newFolder = document.getElementById('edit-blog-folder').value.trim();
    if (!newFolder) {
        alert('Folder name cannot be empty.');
        return;
    }
    if (newFolder !== oldFolder && blogs[newFolder]) {
        alert('Folder name already exists.');
        return;
    }
    blogs[newFolder] = blogs[oldFolder];
    delete blogs[oldFolder];
    localStorage.setItem('blogs', JSON.stringify(blogs));
    loadBlogs();
    loadBlogsAdmin();
    loadAllDataCarousel();
    document.querySelector('.edit-modal').remove();
}

function deleteBlogFolder(folder) {
    let blogs = JSON.parse(localStorage.getItem('blogs')) || {};
    delete blogs[folder];
    localStorage.setItem('blogs', JSON.stringify(blogs));
    loadBlogs();
    loadBlogsAdmin();
    loadAllDataCarousel();
}

// Members
function addMember() {
    const folderName = document.getElementById('member-folder').value;
    const name = document.getElementById('member-name').value;
    const details = document.getElementById('member-details').value;
    const photo = document.getElementById('member-photo').files[0];

    if (!folderName || !name || !details) {
        alert('Please fill in all Member details.');
        return;
    }

    const members = JSON.parse(localStorage.getItem('members')) || {};
    members[folderName] = members[folderName] || [];
    processImageUpload(photo, (imageData) => {
        members[folderName].push({ id: Date.now(), name, details, photo: imageData });
        localStorage.setItem('members', JSON.stringify(members));
        loadMembers();
        loadMembersAdmin();
        loadAllDataCarousel();
        document.getElementById('member-folder').value = '';
        document.getElementById('member-name').value = '';
        document.getElementById('member-details').value = '';
        document.getElementById('member-photo').value = '';
        alert('Member added successfully!');
    });
}

function loadMembers() {
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const container = document.getElementById('members-container');
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (container) {
        container.innerHTML = Object.keys(members).map(folder => {
            const firstPhoto = members[folder][0]?.photo || '';
            return `
                <div class="folder">
                    ${firstPhoto ? `<img src="${firstPhoto}" alt="${folder}">` : ''}
                    <h4 onclick="toggleFolder(this)">${folder}</h4>
                    ${isAdmin ? `
                        <div class="folder-controls">
                            <button onclick="editMemberFolder('${folder}')">Edit</button>
                            <button onclick="deleteMemberFolder('${folder}')">Delete</button>
                        </div>
                    ` : ''}
                    <div class="folder-content">
                        ${members[folder].map(m => `
                            <div class="member-item">
                                ${m.photo ? `<img src="${m.photo}" alt="${m.name}" onclick="openFullscreen('${m.photo}')">` : ''}
                                <h3>${m.name}</h3>
                                <p>${m.details}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function loadMembersAdmin() {
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const container = document.getElementById('member-list');
    if (container) {
        container.innerHTML = Object.keys(members).map(folder => `
            <div class="item">
                <span>${folder} (${members[folder].length} members)</span>
                <button onclick="deleteMemberFolder('${folder}')">Delete</button>
            </div>
        `).join('');
    }
}

function editMemberFolder(folder) {
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Member Folder: ${folder}</h4>
        <input type="text" id="edit-member-folder" value="${folder}">
        <button onclick="saveMemberFolderEdit('${folder}')">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveMemberFolderEdit(oldFolder) {
    const members = JSON.parse(localStorage.getItem('members')) || {};
    const newFolder = document.getElementById('edit-member-folder').value.trim();
    if (!newFolder) {
        alert('Folder name cannot be empty.');
        return;
    }
    if (newFolder !== oldFolder && members[newFolder]) {
        alert('Folder name already exists.');
        return;
    }
    members[newFolder] = members[oldFolder];
    delete members[oldFolder];
    localStorage.setItem('members', JSON.stringify(members));
    loadMembers();
    loadMembersAdmin();
    loadAllDataCarousel();
    document.querySelector('.edit-modal').remove();
}

function deleteMemberFolder(folder) {
    let members = JSON.parse(localStorage.getItem('members')) || {};
    delete members[folder];
    localStorage.setItem('members', JSON.stringify(members));
    loadMembers();
    loadMembersAdmin();
    loadAllDataCarousel();
}

// Events
function addEvent() {
    const title = document.getElementById('event-title').value;
    const content = document.getElementById('event-content').value;
    const image = document.getElementById('event-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Event details.');
        return;
    }

    const events = JSON.parse(localStorage.getItem('events')) || [];
    processImageUpload(image, (imageData) => {
        events.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('events', JSON.stringify(events));
        loadEvents();
        loadEventsAdmin();
        loadAllDataCarousel();
        document.getElementById('event-title').value = '';
        document.getElementById('event-content').value = '';
        document.getElementById('event-image').value = '';
        alert('Event added successfully!');
    });
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('events-container');
    if (container) {
        container.innerHTML = events.length ? events.map(event => `
            <div class="section-item event-item">
                ${event.image ? `<img src="${event.image}" alt="${event.title}" onclick="openFullscreen('${event.image}')">` : ''}
                <h3>${event.title}</h3>
                <p>${event.content}</p>
            </div>
        `).join('') : '<p>No events available yet.</p>';
    }
}

function loadEventsAdmin() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const container = document.getElementById('event-list');
    if (container) {
        container.innerHTML = events.map(event => `
            <div class="item">
                <span>${event.title}</span>
                <button onclick="editEvent(${event.id})">Edit</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editEvent(id) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.id === id);
    if (!event) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Event</h4>
        <input type="text" id="edit-event-title" value="${event.title}">
        <textarea id="edit-event-content">${event.content}</textarea>
        <input type="file" id="edit-event-image" accept="image/*">
        <button onclick="saveEventEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveEventEdit(id) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const itemIndex = events.findIndex(e => e.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-event-title').value;
    const content = document.getElementById('edit-event-content').value;
    const image = document.getElementById('edit-event-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        events[itemIndex] = {
            ...events[itemIndex],
            title,
            content,
            image: imageData || events[itemIndex].image
        };
        localStorage.setItem('events', JSON.stringify(events));
        loadEvents();
        loadEventsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Event updated successfully!');
    });
}

function deleteEvent(id) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    loadEvents();
    loadEventsAdmin();
    loadAllDataCarousel();
}

// Workshops
function addWorkshop() {
    const title = document.getElementById('workshop-title').value;
    const content = document.getElementById('workshop-content').value;
    const image = document.getElementById('workshop-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Workshop details.');
        return;
    }

    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    processImageUpload(image, (imageData) => {
        workshops.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('workshops', JSON.stringify(workshops));
        loadWorkshops();
        loadWorkshopsAdmin();
        loadAllDataCarousel();
        document.getElementById('workshop-title').value = '';
        document.getElementById('workshop-content').value = '';
        document.getElementById('workshop-image').value = '';
        alert('Workshop added successfully!');
    });
}

function loadWorkshops() {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const container = document.getElementById('workshops-container');
    if (container) {
        container.innerHTML = workshops.length ? workshops.map(workshop => `
            <div class="section-item workshop-item">
                ${workshop.image ? `<img src="${workshop.image}" alt="${workshop.title}" onclick="openFullscreen('${workshop.image}')">` : ''}
                <h3>${workshop.title}</h3>
                <p>${workshop.content}</p>
            </div>
        `).join('') : '<p>No workshops available yet.</p>';
    }
}

function loadWorkshopsAdmin() {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const container = document.getElementById('workshop-list');
    if (container) {
        container.innerHTML = workshops.map(workshop => `
            <div class="item">
                <span>${workshop.title}</span>
                <button onclick="editWorkshop(${workshop.id})">Edit</button>
                <button onclick="deleteWorkshop(${workshop.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editWorkshop(id) {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const workshop = workshops.find(w => w.id === id);
    if (!workshop) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Workshop</h4>
        <input type="text" id="edit-workshop-title" value="${workshop.title}">
        <textarea id="edit-workshop-content">${workshop.content}</textarea>
        <input type="file" id="edit-workshop-image" accept="image/*">
        <button onclick="saveWorkshopEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveWorkshopEdit(id) {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const itemIndex = workshops.findIndex(w => w.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-workshop-title').value;
    const content = document.getElementById('edit-workshop-content').value;
    const image = document.getElementById('edit-workshop-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        workshops[itemIndex] = {
            ...workshops[itemIndex],
            title,
            content,
            image: imageData || workshops[itemIndex].image
        };
        localStorage.setItem('workshops', JSON.stringify(workshops));
        loadWorkshops();
        loadWorkshopsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Workshop updated successfully!');
    });
}

function deleteWorkshop(id) {
    let workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    workshops = workshops.filter(w => w.id !== id);
    localStorage.setItem('workshops', JSON.stringify(workshops));
    loadWorkshops();
    loadWorkshopsAdmin();
    loadAllDataCarousel();
}

// Projects
function addProject() {
    const title = document.getElementById('project-title').value;
    const content = document.getElementById('project-content').value;
    const image = document.getElementById('project-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Project details.');
        return;
    }

    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    processImageUpload(image, (imageData) => {
        projects.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
        loadProjectsAdmin();
        loadAllDataCarousel();
        document.getElementById('project-title').value = '';
        document.getElementById('project-content').value = '';
        document.getElementById('project-image').value = '';
        alert('Project added successfully!');
    });
}

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('projects-container');
    if (container) {
        container.innerHTML = projects.length ? projects.map(project => `
            <div class="section-item project-item">
                ${project.image ? `<img src="${project.image}" alt="${project.title}" onclick="openFullscreen('${project.image}')">` : ''}
                <h3>${project.title}</h3>
                <p>${project.content}</p>
            </div>
        `).join('') : '<p>No projects available yet.</p>';
    }
}

function loadProjectsAdmin() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if (container) {
        container.innerHTML = projects.map(project => `
            <div class="item">
                <span>${project.title}</span>
                <button onclick="editProject(${project.id})">Edit</button>
                <button onclick="deleteProject(${project.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editProject(id) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Project</h4>
        <input type="text" id="edit-project-title" value="${project.title}">
        <textarea id="edit-project-content">${project.content}</textarea>
        <input type="file" id="edit-project-image" accept="image/*">
        <button onclick="saveProjectEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveProjectEdit(id) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const itemIndex = projects.findIndex(p => p.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-project-title').value;
    const content = document.getElementById('edit-project-content').value;
    const image = document.getElementById('edit-project-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        projects[itemIndex] = {
            ...projects[itemIndex],
            title,
            content,
            image: imageData || projects[itemIndex].image
        };
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
        loadProjectsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Project updated successfully!');
    });
}

function deleteProject(id) {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
    loadProjects();
    loadProjectsAdmin();
    loadAllDataCarousel();
}

// Instructors
function addInstructor() {
    const title = document.getElementById('instructor-title').value;
    const content = document.getElementById('instructor-content').value;
    const image = document.getElementById('instructor-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Instructor details.');
        return;
    }

    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    processImageUpload(image, (imageData) => {
        instructors.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('instructors', JSON.stringify(instructors));
        loadInstructors();
        loadInstructorsAdmin();
        loadAllDataCarousel();
        document.getElementById('instructor-title').value = '';
        document.getElementById('instructor-content').value = '';
        document.getElementById('instructor-image').value = '';
        alert('Instructor added successfully!');
    });
}

function loadInstructors() {
    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    const container = document.getElementById('instructors-container');
    if (container) {
        container.innerHTML = instructors.length ? instructors.map(instructor => `
            <div class="section-item instructor-item">
                ${instructor.image ? `<img src="${instructor.image}" alt="${instructor.title}" onclick="openFullscreen('${instructor.image}')">` : ''}
                <h3>${instructor.title}</h3>
                <p>${instructor.content}</p>
            </div>
        `).join('') : '<p>No instructors available yet.</p>';
    }
}

function loadInstructorsAdmin() {
    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    const container = document.getElementById('instructor-list');
    if (container) {
        container.innerHTML = instructors.map(instructor => `
            <div class="item">
                <span>${instructor.title}</span>
                <button onclick="editInstructor(${instructor.id})">Edit</button>
                <button onclick="deleteInstructor(${instructor.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editInstructor(id) {
    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    const instructor = instructors.find(i => i.id === id);
    if (!instructor) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Instructor</h4>
        <input type="text" id="edit-instructor-title" value="${instructor.title}">
        <textarea id="edit-instructor-content">${instructor.content}</textarea>
        <input type="file" id="edit-instructor-image" accept="image/*">
        <button onclick="saveInstructorEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveInstructorEdit(id) {
    const instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    const itemIndex = instructors.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-instructor-title').value;
    const content = document.getElementById('edit-instructor-content').value;
    const image = document.getElementById('edit-instructor-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        instructors[itemIndex] = {
            ...instructors[itemIndex],
            title,
            content,
            image: imageData || instructors[itemIndex].image
        };
        localStorage.setItem('instructors', JSON.stringify(instructors));
        loadInstructors();
        loadInstructorsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Instructor updated successfully!');
    });
}

function deleteInstructor(id) {
    let instructors = JSON.parse(localStorage.getItem('instructors')) || [];
    instructors = instructors.filter(i => i.id !== id);
    localStorage.setItem('instructors', JSON.stringify(instructors));
    loadInstructors();
    loadInstructorsAdmin();
    loadAllDataCarousel();
}

// Testimonials
function addTestimonial() {
    const title = document.getElementById('testimonial-title').value;
    const content = document.getElementById('testimonial-content').value;
    const image = document.getElementById('testimonial-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Testimonial details.');
        return;
    }

    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    processImageUpload(image, (imageData) => {
        testimonials.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
        loadTestimonialsAdmin();
        loadAllDataCarousel();
        document.getElementById('testimonial-title').value = '';
        document.getElementById('testimonial-content').value = '';
        document.getElementById('testimonial-image').value = '';
        alert('Testimonial added successfully!');
    });
}

function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const container = document.getElementById('testimonials-container');
    if (container) {
        container.innerHTML = testimonials.length ? testimonials.map(testimonial => `
            <div class="section-item testimonial-item">
                ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.title}" onclick="openFullscreen('${testimonial.image}')">` : ''}
                <h3>${testimonial.title}</h3>
                <p>${testimonial.content}</p>
            </div>
        `).join('') : '<p>No testimonials available yet.</p>';
    }
}

function loadTestimonialsAdmin() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const container = document.getElementById('testimonial-list');
    if (container) {
        container.innerHTML = testimonials.map(testimonial => `
            <div class="item">
                <span>${testimonial.title}</span>
                <button onclick="editTestimonial(${testimonial.id})">Edit</button>
                <button onclick="deleteTestimonial(${testimonial.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editTestimonial(id) {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Testimonial</h4>
        <input type="text" id="edit-testimonial-title" value="${testimonial.title}">
        <textarea id="edit-testimonial-content">${testimonial.content}</textarea>
        <input type="file" id="edit-testimonial-image" accept="image/*">
        <button onclick="saveTestimonialEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveTestimonialEdit(id) {
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const itemIndex = testimonials.findIndex(t => t.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-testimonial-title').value;
    const content = document.getElementById('edit-testimonial-content').value;
    const image = document.getElementById('edit-testimonial-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        testimonials[itemIndex] = {
            ...testimonials[itemIndex],
            title,
            content,
            image: imageData || testimonials[itemIndex].image
        };
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
        loadTestimonialsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Testimonial updated successfully!');
    });
}

function deleteTestimonial(id) {
    let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    testimonials = testimonials.filter(t => t.id !== id);
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    loadTestimonials();
    loadTestimonialsAdmin();
    loadAllDataCarousel();
}

// Achievements
function addAchievement() {
    const title = document.getElementById('achievement-title').value;
    const content = document.getElementById('achievement-content').value;
    const image = document.getElementById('achievement-image').files[0];

    if (!title || !content) {
        alert('Please fill in all Achievement details.');
        return;
    }

    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    processImageUpload(image, (imageData) => {
        achievements.push({ id: Date.now(), title, content, image: imageData });
        localStorage.setItem('achievements', JSON.stringify(achievements));
        loadAchievements();
        loadAchievementsAdmin();
        loadAllDataCarousel();
        document.getElementById('achievement-title').value = '';
        document.getElementById('achievement-content').value = '';
        document.getElementById('achievement-image').value = '';
        alert('Achievement added successfully!');
    });
}

function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const container = document.getElementById('achievements-container');
    if (container) {
        container.innerHTML = achievements.length ? achievements.map(achievement => `
            <div class="section-item achievement-item">
                ${achievement.image ? `<img src="${achievement.image}" alt="${achievement.title}" onclick="openFullscreen('${achievement.image}')">` : ''}
                <h3>${achievement.title}</h3>
                <p>${achievement.content}</p>
            </div>
        `).join('') : '<p>No achievements available yet.</p>';
    }
}

function loadAchievementsAdmin() {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const container = document.getElementById('achievement-list');
    if (container) {
        container.innerHTML = achievements.map(achievement => `
            <div class="item">
                <span>${achievement.title}</span>
                <button onclick="editAchievement(${achievement.id})">Edit</button>
                <button onclick="deleteAchievement(${achievement.id})">Delete</button>
            </div>
        `).join('');
    }
}

function editAchievement(id) {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const achievement = achievements.find(a => a.id === id);
    if (!achievement) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <h4>Edit Achievement</h4>
        <input type="text" id="edit-achievement-title" value="${achievement.title}">
        <textarea id="edit-achievement-content">${achievement.content}</textarea>
        <input type="file" id="edit-achievement-image" accept="image/*">
        <button onclick="saveAchievementEdit(${id})">Save</button>
        <button onclick="this.parentElement.remove()">Cancel</button>
    `;
    document.body.appendChild(modal);
}

function saveAchievementEdit(id) {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const itemIndex = achievements.findIndex(a => a.id === id);
    if (itemIndex === -1) return;

    const title = document.getElementById('edit-achievement-title').value;
    const content = document.getElementById('edit-achievement-content').value;
    const image = document.getElementById('edit-achievement-image').files[0];

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    processImageUpload(image, (imageData) => {
        achievements[itemIndex] = {
            ...achievements[itemIndex],
            title,
            content,
            image: imageData || achievements[itemIndex].image
        };
        localStorage.setItem('achievements', JSON.stringify(achievements));
        loadAchievements();
        loadAchievementsAdmin();
        loadAllDataCarousel();
        document.querySelector('.edit-modal').remove();
        alert('Achievement updated successfully!');
    });
}

function deleteAchievement(id) {
    let achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    achievements = achievements.filter(a => a.id !== id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    loadAchievements();
    loadAchievementsAdmin();
    loadAllDataCarousel();
}
/ Program Management Functions
function addProgram() {
    const title = document.getElementById('program-title').value;
    const content = document.getElementById('program-content').value;
    const icon = document.getElementById('program-icon').value;
    const link = document.getElementById('program-link').value;
    
    if(!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const programData = {
        title,
        content,
        icon: icon || 'fas fa-star', // Default icon
        link: link || '#',
        id: 'program-' + Date.now()
    };
    
    // Save to localStorage
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    programs.push(programData);
    localStorage.setItem('programs', JSON.stringify(programs));
    
    alert('Program added successfully!');
    loadPrograms();
    
    // Clear form
    document.getElementById('program-title').value = '';
    document.getElementById('program-content').value = '';
    document.getElementById('program-icon').value = '';
    document.getElementById('program-link').value = '';
}

function loadPrograms() {
    const programList = document.getElementById('program-list');
    if(!programList) return;
    
    programList.innerHTML = '';
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    
    programs.forEach(program => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <h5>${program.title}</h5>
            <p>${program.content.substring(0, 50)}...</p>
            <button onclick="editProgram('${program.id}')">Edit</button>
            <button onclick="deleteProgram('${program.id}')">Delete</button>
        `;
        programList.appendChild(div);
    });
    
    // Also update frontend display if it exists
    updateProgramsDisplay();
}

function editProgram(id) {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    const program = programs.find(p => p.id === id);
    
    if(program) {
        document.getElementById('program-title').value = program.title;
        document.getElementById('program-content').value = program.content;
        document.getElementById('program-icon').value = program.icon;
        document.getElementById('program-link').value = program.link;
        
        // Add a temporary edit button
        const addBtn = document.querySelector('button[onclick="addProgram()"]');
        addBtn.textContent = 'Update Program';
        addBtn.onclick = function() {
            updateProgram(id);
        };
    }
}

function updateProgram(id) {
    const title = document.getElementById('program-title').value;
    const content = document.getElementById('program-content').value;
    const icon = document.getElementById('program-icon').value;
    const link = document.getElementById('program-link').value;
    
    if(!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    const index = programs.findIndex(p => p.id === id);
    
    if(index !== -1) {
        programs[index] = {
            ...programs[index],
            title,
            content,
            icon: icon || 'fas fa-star',
            link: link || '#'
        };
        
        localStorage.setItem('programs', JSON.stringify(programs));
        alert('Program updated successfully!');
        
        // Reset form and button
        document.getElementById('program-title').value = '';
        document.getElementById('program-content').value = '';
        document.getElementById('program-icon').value = '';
        document.getElementById('program-link').value = '';
        
        const addBtn = document.querySelector('button[onclick="updateProgram(\'' + id + '\')"]');
        addBtn.textContent = 'Add Program';
        addBtn.onclick = addProgram;
        
        loadPrograms();
    }
}

function deleteProgram(id) {
    if(confirm('Are you sure you want to delete this program?')) {
        const programs = JSON.parse(localStorage.getItem('programs') || '[]');
        const filteredPrograms = programs.filter(p => p.id !== id);
        localStorage.setItem('programs', JSON.stringify(filteredPrograms));
        alert('Program deleted successfully!');
        loadPrograms();
    }
}

function updateProgramsDisplay() {
    const container = document.querySelector('.programs-container');
    if(!container) return;
    
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    
    // If there are stored programs, display them instead of the default ones
    if(programs.length > 0) {
        container.innerHTML = '';
        
        programs.forEach(program => {
            const card = document.createElement('div');
            card.className = 'program-card';
            card.innerHTML = `
                <div class="program-icon">
                    <i class="${program.icon}"></i>
                </div>
                <h3>${program.title}</h3>
                <p>${program.content}</p>
                <a href="${program.link}" class="program-link">Learn More</a>
            `;
            container.appendChild(card);
        });
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load other admin content here
    if(document.querySelector('.programs-container')) {
        updateProgramsDisplay();
    }
    
    if(document.getElementById('program-list')) {
        loadPrograms();
    }
});
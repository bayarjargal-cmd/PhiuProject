const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('adminToken');

function checkAuth() {
    if (authToken) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminContents();
    } else {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
}

document.getElementById('adminLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            checkAuth();
        } else {
            alert('Нэвтрэх нэр эсвэл нууц үг буруу байна!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Алдаа гарлаа!');
    }
});

async function loadAdminContents() {
    try {
        const response = await fetch(`${API_URL}/contents`);
        const contents = await response.json();
        
        const container = document.getElementById('adminContentList');
        
        if (contents.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Мэдээлэл байхгүй байна.</div>';
            return;
        }
        
        container.innerHTML = `
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th><th>Гарчиг</th><th>Тайлбар</th><th>Төрөл</th><th>Үйлдэл</th>
                    </tr>
                </thead>
                <tbody>
                    ${contents.map(content => `
                        <tr>
                            <td>${content.id}</td>
                            <td>${escapeHtml(content.title)}</td>
                            <td>${escapeHtml(content.description.substring(0, 100))}...</td>
                            <td>${content.content_type}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editContent(${content.id})">Засах</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteContent(${content.id})">Устгах</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveContent() {
    const id = document.getElementById('contentId').value;
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        content_type: document.getElementById('contentType').value
    };
    
    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/admin/contents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/admin/contents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            alert('Амжилттай хадгаллаа!');
            bootstrap.Modal.getInstance(document.getElementById('contentModal')).hide();
            loadAdminContents();
            resetForm();
        } else {
            alert('Алдаа гарлаа!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Алдаа гарлаа!');
    }
}

async function editContent(id) {
    try {
        const response = await fetch(`${API_URL}/contents/${id}`);
        const content = await response.json();
        
        document.getElementById('contentId').value = content.id;
        document.getElementById('title').value = content.title;
        document.getElementById('description').value = content.description;
        document.getElementById('contentType').value = content.content_type;
        
        new bootstrap.Modal(document.getElementById('contentModal')).show();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteContent(id) {
    if (confirm('Та устгахдаа итгэлтэй байна уу?')) {
        try {
            const response = await fetch(`${API_URL}/admin/contents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (response.ok) {
                alert('Амжилттай устгалаа!');
                loadAdminContents();
            } else {
                alert('Алдаа гарлаа!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function resetForm() {
    document.getElementById('contentId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('contentType').value = 'general';
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    authToken = null;
    checkAuth();
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

checkAuth();
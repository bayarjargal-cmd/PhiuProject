const API_URL = 'http://localhost:5000/api';

async function loadContents() {
    try {
        const response = await fetch(`${API_URL}/contents`);
        const contents = await response.json();
        
        const contentList = document.getElementById('contentList');
        
        if (contents.length === 0) {
            contentList.innerHTML = '<div class="alert alert-info">Мэдээлэл байхгүй байна.</div>';
            return;
        }
        
        contentList.innerHTML = contents.map(content => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(content.title)}</h5>
                        <p class="card-text">${escapeHtml(content.description)}</p>
                        <span class="badge bg-secondary">${content.content_type}</span>
                        <small class="text-muted d-block mt-2">
                            ${new Date(content.created_at).toLocaleDateString('mn-MN')}
                        </small>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('contentList').innerHTML = 
            '<div class="alert alert-danger">Алдаа гарлаа. Дахин оролдоно уу.</div>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadContents();
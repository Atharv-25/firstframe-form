// ============================================
// FIRSTFRAME × DREAM BEAUTY — Creator Form
// Google Sheets Integration via Apps Script
// ============================================

// ---- CONFIG ----
// Replace this with your deployed Google Apps Script Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw0iSzxXxK22YrskjxcHTIacJVQbJ5UvQGiuLfytHUqDoustwUtKgnGLoVMRtVWevcj/exec';

// ---- Particles ----
function initParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 640 ? 12 : 20;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 120 + 40;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '-' + size + 'px';
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
}

// ---- Niche Tags ----
const selectedNiches = new Set();

document.querySelectorAll('.niche-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const val = tag.dataset.value;
        if (selectedNiches.has(val)) {
            selectedNiches.delete(val);
            tag.classList.remove('active');
        } else {
            selectedNiches.add(val);
            tag.classList.add('active');
        }
        document.getElementById('selectedNiches').value = [...selectedNiches].join(', ');
    });
});

// ---- Validation ----
function validate() {
    let valid = true;
    const fields = [
        { id: 'fullName', msg: 'Name is required' },
        { id: 'city', msg: 'City is required' },
        { id: 'instagramLink', msg: 'Instagram link is required' }
    ];

    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const err = document.getElementById(f.id + 'Error');
        el.classList.remove('error');
        if (err) err.textContent = '';

        if (!el.value.trim()) {
            el.classList.add('error');
            if (err) err.textContent = f.msg;
            valid = false;
        }
    });

    // Instagram link format (simple check)
    const instagramLink = document.getElementById('instagramLink');
    if (instagramLink.value.trim() && !/^https?:\/\//i.test(instagramLink.value.trim())) {
        instagramLink.classList.add('error');
        document.getElementById('instagramLinkError').textContent = 'Enter a valid URL (starting with http:// or https://)';
        valid = false;
    }

    return valid;
}

// ---- Form Submit ----
document.getElementById('creatorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');

    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        city: document.getElementById('city').value.trim(),
        instagramLink: document.getElementById('instagramLink').value.trim(),
        followers: document.getElementById('followers').value || 'Not specified',
        niches: document.getElementById('selectedNiches').value || 'Not specified',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
        // Use hidden iframe + form POST — most reliable for Apps Script
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEET_URL;
        form.target = 'hidden_iframe';

        // Add each field as a hidden input
        Object.entries(data).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        // Clean up and show success after a short delay
        setTimeout(() => {
            form.remove();
            iframe.remove();
            btn.classList.remove('loading');
            showSuccess();
        }, 2000);
    } catch (err) {
        console.error('Submit error:', err);
        alert('Something went wrong. Please try again.');
        btn.classList.remove('loading');
    }
});

// ---- Success ----
function showSuccess() {
    document.getElementById('successOverlay').classList.add('active');
    document.getElementById('creatorForm').reset();
    selectedNiches.clear();
    document.querySelectorAll('.niche-tag').forEach(t => t.classList.remove('active'));
    document.getElementById('selectedNiches').value = '';
}

function closeSuccess() {
    document.getElementById('successOverlay').classList.remove('active');
}

// ---- Init ----
initParticles();

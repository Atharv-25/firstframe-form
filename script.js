// ============================================
// FIRSTFRAME × DREAM BEAUTY — Creator Form
// Google Sheets Integration via Apps Script
// ============================================

// ---- CONFIG ----
// Replace this with your deployed Google Apps Script Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyFSYkPwafe7ZPVmMpP92f5R46lypHUxg9p7V7BO681mB81q7BtBAMo1cEvWU6Ak2aKTQ/exec';

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
        { id: 'email', msg: 'Valid email is required' },
        { id: 'phone', msg: 'Phone number is required' },
        { id: 'city', msg: 'City is required' },
        { id: 'address', msg: 'Address is required' },
        { id: 'pincode', msg: 'PIN Code is required' },
        { id: 'instagram', msg: 'Instagram handle is required' }
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

    // Email format
    const email = document.getElementById('email');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        document.getElementById('emailError').textContent = 'Enter a valid email';
        valid = false;
    }

    // PIN Code format (6 digits)
    const pincode = document.getElementById('pincode');
    if (pincode.value.trim() && !/^[0-9]{6}$/.test(pincode.value.trim())) {
        pincode.classList.add('error');
        document.getElementById('pincodeError').textContent = 'Enter a valid 6-digit PIN code';
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
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        address: document.getElementById('address').value.trim() + ' - ' + document.getElementById('pincode').value.trim(),
        instagram: '@' + document.getElementById('instagram').value.trim().replace(/^@/, ''),
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

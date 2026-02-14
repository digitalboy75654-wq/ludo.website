// navigation.js file ke andar ye paste karein:

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // 1. Sabse pehle purani active classes hata dein
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const homeBtn = document.querySelector('.center-fab');
    if(homeBtn) homeBtn.classList.remove('active');

    // 2. Check karein kaunsa page khula hai
    if (path.includes('social.html')) {
        const el = document.getElementById('nav-social');
        if(el) el.classList.add('active');
    } 
    else if (path.includes('ranking.html')) {
        const el = document.getElementById('nav-rank');
        if(el) el.classList.add('active');
    } 
    else if (path.includes('home.html') || path.endsWith('/')) {
        // Home button ko bhi active class dein (agar CSS mein style hai to)
        if(homeBtn) homeBtn.classList.add('active');
    } 
    else if (path.includes('friend_challenge.html')) {
        const el = document.getElementById('nav-friends');
        if(el) el.classList.add('active');
    } 
    else if (path.includes('profile.html')) {
        const el = document.getElementById('nav-profile');
        if(el) el.classList.add('active');
    }
});
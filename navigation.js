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
document.addEventListener('DOMContentLoaded', () => {
    // ... Aapka purana Active Tab Logic yahan rahega ...

    // --- 🛠️ GLOBAL HIDE FOOTER LOGIC ---
    const dock = document.querySelector('.navigation-dock');
    if (!dock) return; // Agar page par dock nahi hai to ruk jao

    // Function jo scroll ko handle karega
    const handleScroll = (target) => {
        const scrollHeight = target.scrollHeight || document.documentElement.scrollHeight;
        const scrollTop = target.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = target.clientHeight || window.innerHeight;

        // Debugging: Console mein check karne ke liye (Optional)
        // console.log(scrollTop + clientHeight, scrollHeight);

        // Agar user bottom se 20px ke faslay par hai
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            dock.style.transform = 'translateX(-50%) translateY(120px)';
            dock.style.opacity = '0';
            dock.style.pointerEvents = 'none'; // Buttons click na hon
        } else {
            dock.style.transform = 'translateX(-50%) translateY(0)';
            dock.style.opacity = '1';
            dock.style.pointerEvents = 'auto';
        }
    };

    // Har mumkin scroll hone wali cheez par listener lagao
    window.addEventListener('scroll', () => handleScroll(document.documentElement), { passive: true });
    
    const scrollArea = document.querySelector('.scroll-area');
    if (scrollArea) {
        scrollArea.addEventListener('scroll', () => handleScroll(scrollArea), { passive: true });
    }

    // Kuch pages (jaise Profile) mein poora 'body' scroll hota hai
    document.body.addEventListener('scroll', () => handleScroll(document.body), { passive: true });
});

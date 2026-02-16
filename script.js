// Ye function ab har page ke liye available hai
window.updateCoinUI = function(amount) {
    const el = document.getElementById('u-balance') || document.getElementById('real-bal-red') || document.getElementById('real-bal-yellow');
    const pill = document.querySelector('.coin-pill');
    
    if (!el) return;

    // ✨ Math.floor yahan lagane se har page par point khatam ho jayega
    const cleanAmount = Math.floor(amount || 0);
    
    if(el.innerText != cleanAmount) {
        el.innerText = cleanAmount;

        if (pill) {
            pill.style.background = "rgba(46, 204, 113, 0.5)";
            setTimeout(() => { pill.style.background = "rgba(0,0,0,0.6)"; }, 400);
        }
    }
};
// --- LUDO PRO DYNAMIC SETTINGS ---

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DYNAMIC FAVICON (Browser Tab Icon)
    const setFavicon = () => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = 'icon.png';
        
        // Apple Touch Icon
        let appleLink = document.querySelector("link[rel='apple-touch-icon']");
        if (!appleLink) {
            appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            document.getElementsByTagName('head')[0].appendChild(appleLink);
        }
        appleLink.href = 'icon.png';
    };

    // 2. SOCIAL MEDIA META TAGS (WhatsApp/FB Sharing)
    const setMetaTags = () => {
        const metaData = {
            "og:title": "Ludo Pro - Play & Win Cash",
            "og:description": "Doston ke sath khelein aur paise jeetein. Join now!",
            "og:image": window.location.origin + "/icon1.png", // Full URL for WhatsApp
            "og:url": window.location.href,
            "og:type": "website",
            "twitter:card": "summary_large_image",
            "twitter:image": window.location.origin + "/icon1.png"
        };

        for (let property in metaData) {
            let meta = document.querySelector(`meta[property='${property}']`) || 
                       document.querySelector(`meta[name='${property}']`);
            if (!meta) {
                meta = document.createElement('meta');
                if (property.startsWith('og:')) {
                    meta.setAttribute('property', property);
                } else {
                    meta.setAttribute('name', property);
                }
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
            meta.content = metaData[property];
        }
    };

    // Run functions
    setFavicon();
    setMetaTags();
});

// 3. WHATSAPP SHARE FUNCTION (Invite & Earn ke liye)
function shareLudo() {
    const text = encodeURIComponent("Doston! Mere sath Ludo khelein aur paise jeetein. Join karein: " + window.location.origin);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}
// Function to show Admin Popup
function showAdminPopup(message) {
    const popup = document.getElementById('adminPopup');
    const msgLabel = document.getElementById('popupMessage');
    
    // Check karein ke kya user pehle hi isay dekh kar band kar chuka hai?
    const isDismissed = localStorage.getItem('broadcastDismissed');

    if (!isDismissed) {
        msgLabel.innerText = message;
        popup.style.display = 'flex';
    }
}

// Function to close and SAVE choice
function closePopup() {
    document.getElementById('adminPopup').style.display = 'none';
    
    // Browser ki memory mein save kar lo ke user ne popup dekh liya hai
    localStorage.setItem('broadcastDismissed', 'true');
}

// Window load hone par check karein
window.onload = function() {
    const broadcastMsg = "🏆 Welcome to LUDO.LAT! \n\nGet ready for the ultimate gaming experience. Play with real players, enter elite tournaments, and turn your skills into real cash rewards. \n\nGood luck, Champion!";
    
    // 2 second ke delay ke baad dikhayen
    setTimeout(() => {
        showAdminPopup(broadcastMsg);
    }, 2000);
};
// script.js

// --- 1. Skip Count Barhane ka Logic ---
window.handleMissedTurnLogic = async function(gameData) {
    const { db, ref, get, update, GAME_ID, ENTRY_FEE, myColor, currentUser, activeColor } = gameData;

    // Sirf wohi banda skip count barhaye jiski bari timer par khatam hui
    if (activeColor !== myColor) return;

    const myPlayerRef = ref(db, `matchmaking_pool/${ENTRY_FEE}/${GAME_ID}/players/${currentUser.uid}`);

    try {
        const snap = await get(myPlayerRef);
        if (snap.exists()) {
            let missed = (snap.val().missedTurns || 0) + 1;
            await update(myPlayerRef, { missedTurns: missed });

            // 5 Skips par Winner decide karna
            if (missed >= 5) {
                const opponentColor = myColor === 'red' ? 'yellow' : 'red';
                const gameStateRef = ref(db, `matchmaking_pool/${ENTRY_FEE}/${GAME_ID}/gameState`);
                await update(gameStateRef, { winner: opponentColor });
            }
        }
    } catch (e) { console.error("Skip Update Error:", e); }
};

// --- 2. Real-time Listener (Jo dono users ko screen par dikhayega) ---
window.initSkipDisplay = function(db, ref, onValue, GAME_ID, ENTRY_FEE) {
    const playersRef = ref(db, `matchmaking_pool/${ENTRY_FEE}/${GAME_ID}/players`);

    onValue(playersRef, (snapshot) => {
        const players = snapshot.val();
        if (!players) return;

        Object.values(players).forEach(p => {
            const skipEl = document.getElementById(`skips-${p.color}`);
            if (skipEl) {
                skipEl.innerText = `Skips: ${p.missedTurns || 0}/5`;
            }
        });
    });

};

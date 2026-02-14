import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
// 🔥 FIX: 'set' aur 'onDisconnect' add kiya hai niche wali line mein
import { getDatabase, ref, onChildAdded, update, runTransaction, get, set, onDisconnect } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// --- CONFIGURATION ---
const firebaseConfig = { 
    apiKey: "AIzaSyDKhHlL52F16AP0d7j5XK9lZduEFBLKBfY", 
    authDomain: "ludo-d46ab.firebaseapp.com", 
    databaseURL: "https://ludo-d46ab-default-rtdb.firebaseio.com", 
    projectId: "ludo-d46ab" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- 🎵 Audio Function ---
const playInviteSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playTone = (freq, startTime, duration) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
            osc.connect(gain); gain.connect(audioContext.destination);
            osc.start(startTime); osc.stop(startTime + duration);
        };
        playTone(880, audioContext.currentTime, 0.3);
        playTone(880, audioContext.currentTime + 0.4, 0.3);
    } catch (e) { console.log("Audio waiting..."); }
};

// --- STATUS UPDATE LOGIC ---
function updateUserStatus(uid) {
    const statusRef = ref(db, `users/${uid}/status`);

    // 1. Agar tab close kare ya net band ho to -> OFFLINE
    onDisconnect(statusRef).set({ state: 'offline' });

    // 2. Check karein user abhi kahan hai
    if (window.location.href.includes("match2.html")) {
        // Agar Game Page par hai to -> PLAYING (Busy)
        set(statusRef, { state: 'playing' });
    } else {
        // Agar kisi aur page par hai to -> ONLINE
        set(statusRef, { state: 'online' });
    }
}

// --- GLOBAL LISTENER ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // 🔥 Status Update Call
        updateUserStatus(user.uid);

        const invitesRef = ref(db, 'invites');
        
        onChildAdded(invitesRef, async (snapshot) => {
            const invite = snapshot.val();
            const inviteId = snapshot.key;

            if (invite.to === user.uid && invite.status === 'pending') {
                const now = Date.now();
                if (now - invite.timestamp < 60000) { 
                    
                    console.log("🔔 New Invite Received form UID:", invite.from);

                    let sName = "Unknown Player";
                    let sPhoto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                    try {
                        const senderSnap = await get(ref(db, `users/${invite.from}`));
                        
                        if (senderSnap.exists()) {
                            const data = senderSnap.val();
                            // Har mumkin spelling try karo
                            sName = data.name || data.Name || data.username || data.displayName || invite.fromName || "Unknown";
                            sPhoto = data.photo || data.Photo || data.profilePic || invite.fromPhoto || sPhoto;
                        } else {
                            // Fallback
                            sName = invite.fromName || "Unknown";
                            sPhoto = invite.fromPhoto || sPhoto;
                        }
                    } catch (err) {
                        sName = invite.fromName || "Player";
                    }

                    showInvitePopup(invite, inviteId, user.uid, sName, sPhoto);
                }
            }
        });
    }
});

// --- 📱 POPUP FUNCTION ---
function showInvitePopup(invite, inviteId, myUid, sName, sPhoto) {
    if (document.getElementById('inv-popup')) return;

    playInviteSound();

    const div = document.createElement('div');
    div.id = 'inv-popup';
    
    if (!document.getElementById('popup-style')) {
        const style = document.createElement('style');
        style.id = 'popup-style';
        style.innerHTML = `
            .pro-toast {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                width: 90%; max-width: 400px; background: #1a1a2e;
                border: 2px solid #f1c40f; border-radius: 15px; padding: 15px;
                display: flex; align-items: center; gap: 15px; z-index: 10000;
                box-shadow: 0 0 20px rgba(241,196,15,0.3); color: white;
                font-family: sans-serif; animation: slideDown 0.5s ease;
            }
            .toast-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #f1c40f; object-fit:cover; }
            .toast-content { flex: 1; }
            .toast-title { color: #f1c40f; font-size: 11px; font-weight: bold; }
            .toast-name { font-size: 14px; font-weight: bold; margin: 2px 0; }
            .toast-amount { color: #2ecc71; font-weight: bold; font-size: 20px; }
            .toast-btns { display: flex; flex-direction: column; gap: 5px; }
            .t-btn { border: none; padding: 8px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 11px; }
            .t-btn-dec { background: #e74c3c; color: white; }
            .t-btn-acc { background: #2ecc71; color: black; }
            @keyframes slideDown { from { top: -100px; } to { top: 20px; } }
            @keyframes slideUp { from { top: 20px; } to { top: -100px; } }
        `;
        document.head.appendChild(style);
    }

    div.className = 'pro-toast';
    div.innerHTML = `
        <img src="${sPhoto}" class="toast-avatar" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'">
        <div class="toast-content">
            <div class="toast-title">CHALLENGE!</div>
            <div class="toast-name">${sName}</div>
            <div class="toast-amount">₹${invite.amount}</div>
        </div>
        <div class="toast-btns">
            <button id="btn-dec-${inviteId}" class="t-btn t-btn-dec">DECLINE</button>
            <button id="btn-acc-${inviteId}" class="t-btn t-btn-acc">ACCEPT</button>
        </div>
    `;
    document.body.appendChild(div);

    document.getElementById(`btn-dec-${inviteId}`).onclick = () => {
        update(ref(db, `invites/${inviteId}`), { status: 'rejected' });
        div.style.animation = "slideUp 0.4s forwards";
        setTimeout(() => div.remove(), 400);
    };

    document.getElementById(`btn-acc-${inviteId}`).onclick = async () => {
        const btn = document.getElementById(`btn-acc-${inviteId}`);
        btn.innerText = "..."; btn.disabled = true;
        
        const myBalRef = ref(db, `users/${myUid}/balance`);
        try {
            await runTransaction(myBalRef, (bal) => {
                const b = Number(bal || 0);
                return (b >= invite.amount) ? b - invite.amount : undefined;
            }).then((res) => {
                if (res.committed) {
                    update(ref(db, `invites/${inviteId}`), { status: 'accepted' });
                    window.location.href = `match2.html?gameId=${invite.gameId}&entry=${invite.amount}`;
                } else {
                    alert("Low Balance!");
                    div.remove();
                }
            });
        } catch (e) { console.error(e); div.remove(); }
    };

    setTimeout(() => { if(div) div.remove(); }, 30000);
}
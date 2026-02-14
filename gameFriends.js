// --- FRIEND SYSTEM LOGIC ---
import { ref, update, get, onValue, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Function to handle Add/Remove Friend
window.toggleFriend = async function(oppId, oppName, oppPhoto) {
    if (!currentUser || !oppId) return;
    
    const friendRef = ref(db, `users/${currentUser.uid}/friends/${oppId}`);
    const snap = await get(friendRef);

    if (snap.exists()) {
        // Agar pehle se friend hai toh Remove karein
        await set(friendRef, null);
        alert(`${oppName} removed from friends.`);
    } else {
        // Agar friend nahi hai toh Add karein
        await set(friendRef, {
            uid: oppId,
            name: oppName,
            photo: oppPhoto,
            addedAt: Date.now()
        });
        alert(`${oppName} added to friends!`);
    }
    updateFriendButtons(oppId); // UI update karein
};

// UI par button dikhane ka function
window.initFriendButtons = function(oppId, oppName, oppPhoto, oppColor) {
    const playerCard = document.getElementById(`p-${oppColor}`);
    if (!playerCard || oppId === currentUser.uid) return;

    // Check karein ke button pehle se maujood toh nahi
    if (document.getElementById(`btn-friend-${oppColor}`)) return;

    const btn = document.createElement('button');
    btn.id = `btn-friend-${oppColor}`;
    btn.style.cssText = "margin-top:5px; padding:2px 8px; font-size:10px; border-radius:10px; border:none; cursor:pointer; font-weight:bold; transition: 0.3s;";
    
    // Initial State Check
    const friendRef = ref(db, `users/${currentUser.uid}/friends/${oppId}`);
    onValue(friendRef, (snap) => {
        if (snap.exists()) {
            btn.innerHTML = '<i class="fas fa-user-minus"></i> Unfriend';
            btn.style.backgroundColor = "#ff4757";
            btn.style.color = "white";
        } else {
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Add Friend';
            btn.style.backgroundColor = "#2ecc71";
            btn.style.color = "white";
        }
    });

    btn.onclick = () => toggleFriend(oppId, oppName, oppPhoto);
    playerCard.appendChild(btn);
};

// --- Integratition with Matchmaking ---
// Jab game data load ho, tab opponent ke card par button dikhayen
// Is line ko apni `listenToLiveUpdates` function ke andar `playerIds.forEach` loop mein dalen:
/*
    if (p.uid !== currentUser.uid) {
        window.initFriendButtons(p.uid, p.name, p.photo, p.color);
    }
*/
// historyLog.js
import { ref, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

export function saveHistory(db, uid, amount, type, result) {
    if (!uid) return;
    
    const historyRef = ref(db, `users/${uid}/gameHistory`);
    
    push(historyRef, {
        type: type,
        amount: parseInt(amount),
        timestamp: Date.now(),
        result: result
    }).then(() => {
        console.log("History Saved:", type);
    }).catch((e) => {
        console.error("History Error:", e);
    });
}
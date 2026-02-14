# TODO: Fix Firebase Connection Issue in game2.html

## Steps to Complete:
- [x] Add `let unsubscribeGame = null;` variable declaration
- [x] Update `listenToLiveUpdates` function to capture the unsubscribe function
- [x] Modify `sync` function to call `unsubscribeGame()` when winner is detected
- [x] Update `exitGame` function to call `unsubscribeGame()` before exiting (No exitGame function exists; cleanup handled in sync on winner detection)

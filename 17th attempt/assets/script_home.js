
// // selectors
const darkModeSwitch = document.getElementById("dark-mode-switch");

// // state
const isPriorDarkMode = localStorage.getItem(darkModeSwitch.id);
const isBrowserDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;


// // on mount
darkModeSwitch.checked = (isPriorDarkMode == null) ? isBrowserDarkMode : (isPriorDarkMode === "true");


// // handlers
function saveDarkModePref()
{
    localStorage.setItem(darkModeSwitch.id, darkModeSwitch.checked);
    console.log(darkModeSwitch.id, darkModeSwitch.checked);
}


// // events

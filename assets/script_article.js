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
    // console.log(darkModeSwitch.id, darkModeSwitch.checked);
}


// // events



// Generate Table of Contents

const headingTiers = ["h1", "h2", "h3", "h4", "h5", "h6"];

function applyIdToDivsOfSectsOf(parentSection){
    
    const headingCounts = {h1:0, h2:0, h3:0, h4:0, h5:0, h6:0};
    
    
    const childDivs = parentSection.querySelectorAll(":scope > .indirect > .direct");
    childDivs.forEach(childDiv => {
        
        let id = "";
    
        // prefix id of parent, unless parent is main
        if (parentSection.tagName == "DIV") {
            id += parentSection.firstElementChild.id.replace(/\.[^.]+$/, '') + ".";
        }

        // get the heading of the child section and the heading type
        const heading = childDiv.firstElementChild;
        const headingTag = heading.tagName.toLowerCase();

        // validate heading and apply an indexed id to the child section
        const isHeadingValid = headingTiers.includes(headingTag);
        isHeadingValid ? headingCounts[headingTag]++ : console.log("first element of a div is not a heading");
        
        if (headingTag == "h1") {
            id += "Introduction"
        } else {
            id += headingCounts[headingTag] + "." + heading.innerHTML.replace(/ /g,"_");
        }

        childDiv.setAttribute("id", id);  


        // make the table of contents
        let contentsList = "";
        let contentsListTarget = "";

        const contentsListItem = document.createElement("li");
        const contentsAnchor = document.createElement("a");
        contentsAnchor.innerText = heading.innerHTML;
        contentsAnchor.setAttribute("href", "#" + id);
        
        if (headingTag == "h1") {
            contentsList = document.createElement("ul");
            contentsList.setAttribute("aria-label", "Table of Contents");
            document.querySelector("nav" + contentsListTarget).appendChild(contentsList).appendChild(contentsListItem).appendChild(contentsAnchor);
            
        } else if (headingCounts[headingTag] == 1) {
            contentsList = document.createElement("ol");
            contentsListTarget = " > ul" + "> ol:last-child".repeat(headingTiers.indexOf(headingTag) - 1);
            document.querySelector("nav" + contentsListTarget).appendChild(contentsList).appendChild(contentsListItem).appendChild(contentsAnchor);
        } else {
            contentsListTarget = " > ul" + "> ol:last-child".repeat(headingTiers.indexOf(headingTag));
            document.querySelector("nav" + contentsListTarget).appendChild(contentsListItem).appendChild(contentsAnchor);
        }

        // console.log(childDiv.parentElement);

        // recursive
        applyIdToDivsOfSectsOf(childDiv.parentElement);
    });
}

applyIdToDivsOfSectsOf(document.querySelector("main"));


// get aside and nav height
let asideHeight = 0;
let navHeight = 0;

function setHeights(){
    asideHeight = document.querySelector("aside").offsetHeight;
    navHeight = document.querySelector("nav > ul").clientHeight;
    
    document.documentElement.style.setProperty("--aside-height-js", asideHeight + "px");
    document.documentElement.style.setProperty("--nav-height-js", navHeight + "px");
}

setHeights();
window.addEventListener("resize", setHeights);



// Create a function to initialize the first Intersection Observer
function createObserver1() {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const contentLink = document.querySelector("nav a[href='#Introduction']");
            contentLink.style.fontWeight = (entry.isIntersecting) ? "bold" : "normal";
            contentLink.parentElement.style.borderLeftColor = (entry.isIntersecting) ? "white" : "var(--background-color)";
        });
    });
}
const observer1 = createObserver1();
observer1.observe(document.querySelector("#Introduction"));

// Observe the navigation. If in view while not sticky, don't show toggle
function createObserverContents() {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            contentsSwitch = document.querySelector("aside label[for='table-of-contents-switch']");
            contentsSwitch.style.display = (entry.isIntersecting) ? "none" : "flex";
            if (document.querySelector("#table-of-contents-switch").checked) {
                contentsSwitch.style.display = "flex";
            }
        });
    });
}
const observerContents = createObserverContents();
observerContents.observe(document.querySelector("nav"));

// Create a function to initialize the Intersection Observer
function createObserver(rootMargin) {
        return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
                const contentLink = document.querySelector("nav a[href='#" + entry.target.id +"']");
                contentLink.style.fontWeight = (entry.isIntersecting) ? "bold" : "normal";
                contentLink.parentElement.style.borderLeftColor = (entry.isIntersecting) ? "white" : "var(--background-color)";
        });
        setHeights();
    }, {
        rootMargin: rootMargin
      });
}
    
// Function to update the observer with a new rootMargin
function updateObserver() {
    // Disconnect the old observer
    if (observer) {
    observer.disconnect();
    }
    
    // Create a new observer with the updated rootMargin
    observer = createObserver(currentRootMargin);
    targetElements.forEach(div => {
        observer.observe(div);
    });
}
    
let observer;
let currentRootMargin = "-" + (asideHeight + navHeight) + "px 0px 0px 0px";  // Default rootMargin
const targetElements = document.querySelectorAll(".direct:not(#Introduction)");  // Your target element

// Create initial observer
observer = createObserver(currentRootMargin);
targetElements.forEach(div => {
    observer.observe(div);
});

// Media query to detect screen width changes
const mediaQuery = window.matchMedia('(width > calc(40ch * 3.61803 + 2rem))');

// Event listener for media query changes
mediaQuery.addEventListener('change', (event) => {
    if (event.matches) {
    // Media query is met, update rootMargin
    currentRootMargin = '0px';
} else {
    // Media query is not met, use default rootMargin
    currentRootMargin = "-" + (asideHeight + navHeight) + "px 0px 0px 0px";
    }
    
    // Update the observer with the new rootMargin
    updateObserver();
});

// Initial check for media query
if (mediaQuery.matches) {
    currentRootMargin = "-" + (asideHeight + navHeight) + "px 0px 0px 0px";
    updateObserver();
}


// while (one of)
    // detected scroll postion before nav
    // or
    // detected media query ultra wide

    // hide contents button and default it unchecked
    // contents observer rootmargin 0

// then show contents button and if checked
    // contents observer rootmargin aside+nav



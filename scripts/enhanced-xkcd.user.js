// ==UserScript==
// @name         Enhanced xkcd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://xkcd.com/*
// @grant        none
// ==/UserScript==

(function () {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const comicSubtextId = 'comicSubtext';

    function displayComicSubtext() {
        let subtext = retrieveComicSubtext();

        let subtextP = document.createElement('p');
        subtextP.appendChild(document.createTextNode(subtext));

        let subtextDiv = document.createElement('div');
        subtextDiv.id = comicSubtextId;
        subtextDiv.style.width = '80%';
        subtextDiv.style.margin = 'auto';
        subtextDiv.appendChild(document.createElement('hr'));
        subtextDiv.appendChild(subtextP);
        subtextDiv.appendChild(document.createElement('hr'));

        retrieveComicDiv().appendChild(subtextDiv);
    }

    function retrieveComicSubtext() {
        let comicImg = retrieveComicImg();

        return comicImg.title;
    }

    function retrieveComicDiv() {
        return document.getElementById('comic');
    }

    function retrieveComicImg() {
        let comicDiv = retrieveComicDiv();

        return firstOf(comicDiv.getElementsByTagName('IMG'));
    }

    function firstOf(collection) {
        if (collection.length >= 1) {
            return collection[0];
        } else {
            return null;
        }
    }

    function handleKeyPress(e) {
        if (isModified(e)) {
            return;
        }

        let key = e.key;

        if (key === 'p') {
            navigateToPreviousPage();
        } else if (key === 'n') {
            navigateToNextPage();
        } else if (key === 'r') {
            location.assign("https://c.xkcd.com/random/comic/");
        } else if (key === 'h') {
            location.assign("https://www.explainxkcd.com" + window.location.pathname);
        }
    }

    function isModified(e) {
        return e.metaKey || e.altKey || e.ctrlKey;
    }

    function navigateToPreviousPage() {
        let prevAnchor = retrieveNavLinkByRel('prev');
        location.assign(prevAnchor.href);
    }

    function navigateToNextPage() {
        let nextAnchor = retrieveNavLinkByRel('next');
        location.assign(nextAnchor.href);
    }

    function retrieveNavLinkByRel(rel) {
        return document.querySelector(`.comicNav a[rel=${rel}]`);
    }

    function addExplainButton() {
        let explainURL = "https://www.explainxkcd.com" + window.location.pathname
        let newButton = document.createElement("li")
        let buttonContent = document.createElement("a")
        buttonContent.href = explainURL
        buttonContent.innerHTML = "Explain"
        newButton.appendChild(buttonContent)
        // The desktop version has 2 navbars with class .comicNav and the mobile version has one navbar with the id #navButtons
        let navbars = document.getElementsByClassName("comicNav");
        if (navbars.length === 0) {
            navbars = [document.getElementById("navButtons")];
        }
        for (let i = 0; i < navbars.length; i++) {
            const navButtons = Array.from(navbars[i].children);
            const randomButton = navButtons.find((li => li.firstChild.textContent === "Random" || li.firstChild.textContent === "?"))
            navbars[i].insertBefore(newButton.cloneNode(true), randomButton.nextElementSibling);
        }
    }

    addExplainButton();
    displayComicSubtext();
    window.addEventListener('keypress', handleKeyPress);
})();
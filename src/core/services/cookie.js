"use strict";

export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value+";" + expires + "=" + days + "; path=/;";
    console.log("Document cookie:", document.cookie); // Ajoutez cette ligne pour voir les cookies définis
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    console.log("Cookies:", ca); // Ajoutez cette ligne pour voir les cookies disponibles
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
    console.log(`Cookie deleted: ${name}`);
    console.log("Document cookie:", document.cookie); // Ajoutez cette ligne pour voir les cookies définis
}
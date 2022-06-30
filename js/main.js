function changeLang(e) {
    let lang = e.value;
    document.cookie = 'lang=' + lang + '; SameSite=None';
    location.reload();
}
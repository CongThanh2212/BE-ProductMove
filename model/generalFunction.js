//Return string yyyy-mm-dd
function getDateNow() {
    const d = new Date()
    var year = d.getFullYear().toString()
    var month = (d.getMonth() + 1).toString()
    var day = d.getDate().toString()
    const date = year + "-" + month + "-" + day;
    return date;
}

function hash(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0 ;i<str.length ; i++) {
        ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }
    return hash;
}

// Check overtime
function overtime(sellDate, WM) {
    // sell date
    const sellDay = sellDate.getDate();
    const sellMonth = sellDate.getMonth();
    const sellYear = sellDate.getFullYear();

    // now date
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
}

module.exports = {
    getDateNow,
    overtime,
    hash
}
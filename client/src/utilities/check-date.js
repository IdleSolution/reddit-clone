// This function expects to get a JS date in a string
function checkDate(date) {
    const dateDiff = new Date().getTime() - new Date(date).getTime();
    if (dateDiff / 3600000 < 0.016) {
        return "just now";
    } else if (dateDiff / 3600000 < 1) {
        return `${Math.round(dateDiff / 60000)} minutes ago`;
    } else if (dateDiff / 3600000 < 24) {
        return `${Math.round(dateDiff / 3600000)} hours ago`;
    } else {
        return `${Math.round(dateDiff / 86400000)} days ago`;
    }
}

export default checkDate;

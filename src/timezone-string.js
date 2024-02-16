export default function () {
    let offset = new Date().getTimezoneOffset();
    let offsetDir = offset < 0 ? -1 : 1;
    offset = Math.abs(offset);
    let str = `${String(Math.floor(offset / 60)).padStart(2, "0")}:${String(
        offset % 60).padStart(2, "0")}`;

    if (offsetDir == 1) {
        str = "-" + str;
    } else {
        str = "+" + str
    }

    return str;
}
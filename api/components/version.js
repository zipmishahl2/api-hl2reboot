var salaries = {
    "hl2reboot.api": 3.0,
    "hl2reboot.vercel.app": 5.0
};

function changeObject(object) {
    for (var verison in object) {
        object[verison] += 100;
    }
}

console.dir(salaries);
changeObject(salaries);
console.dir(salaries);

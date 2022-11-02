export function deepEquals(obj1: any, obj2: any) {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (obj1.length !== obj2.length) return false;

    for (let key in obj1) {
        if (!(key in obj2)) return false;

        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

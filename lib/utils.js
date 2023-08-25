
export function isEmpty(value) {

    if(!value)
    return true;

    return Object.keys(value).length === 0
        && value.constructor === Object;
}

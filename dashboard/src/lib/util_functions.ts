
export function dist(x1:number, y1:number, x2:number, y2:number){
    return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

export function getHoverColor(color: string) {
    return color.slice(0, 1) + '7' + color.slice(2);
}

export function getClickColor(color: string) {
    return color.slice(0, 1) + '5' + color.slice(2);
}

export function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}
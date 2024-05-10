export class Vector {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle: number) {
        let newHeading = this.heading() + angle;
        let mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

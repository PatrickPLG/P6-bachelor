import {Vector} from "@/lib/shapes/vector";
import {Point} from "@/lib/shapes/point";
import type P5 from "p5";
import {dist, getClickColor, getHoverColor} from "@/lib/util_functions";
import {DEFAULT_FILL_COLOR} from "@/lib/settings";

export class Circle {
    pos: Vector
    radius: number
    isDragged: boolean
    dragEnabled: boolean
    isBeingHovered = false
    _color: string
    color: string
    dragPos: Point
    dragSize: Point
    points: Point[]

    constructor(x: number, y: number,color: string = DEFAULT_FILL_COLOR) {
        this.pos = new Vector(x, y);
        this.radius = 10;
        this.isDragged = false;
        this.dragEnabled = false;
        this.color = color;
        this._color = this.color;
        this.dragPos = new Point(0, 0);
        this.dragPos.pos = this.pos;
        this.dragSize = new Point(this.x + this.radius, this.y);
        this.points = [this.dragPos, this.dragSize];
    }

    setX(x: number) {
        this.pos.x = x;
        this.dragSize.x = this.x + this.radius;
        this.dragSize.y = this.y;
    }

    setY(y: number) {
        this.pos.y = y;
        this.dragSize.y = this.y;
        this.dragSize.x = this.x + this.radius;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    get minX() {
        return this.pos.x - this.radius;
    }

    get maxX() {
        return this.pos.x + this.radius;
    }

    get minY() {
        return this.pos.y - this.radius;
    }

    get maxY() {
        return this.pos.y + this.radius;
    }

    get centerX() {
        return this.pos.x;
    }

    get centerY() {
        return this.pos.y;
    }

    get width() {
        return this.radius * 2;
    }

    get height() {
        return this.radius * 2;
    }


    setSize(size: number) {
        this.radius = size / 2;
        this.dragSize.x = this.x + this.radius;
        this.dragSize.y = this.y;
    }

    pointsAtXY(x: number) {
        if (x < this.minX || x > this.maxX) return [];

        const dx = this.x - x;
        const rSquared = Math.pow(this.radius, 2);
        const dy = Math.pow(rSquared - dx * dx, 0.5);

        return [{x: x, y: this.y + dy}, {x: x, y: this.y - dy}];
    }

    pointsAtY(y: number) {
        if (y < this.minY || y > this.maxY) return [];

        const dy = this.y - y;
        const rSquared = Math.pow(this.radius, 2);
        const dx = Math.pow(rSquared - dy * dy, 0.5);

        return [{x: this.x + dx, y: y}, {x: this.x - dx, y: y}];
    }

    handleMousePressed(p: P5) {
        const pointPressed = this.points.find(point => point.containsXY(p.mouseX, p.mouseY));

        const isBeingPressed = this.containsXY(p.mouseX, p.mouseY);

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else if (isBeingPressed) {
            this.isDragged = true;
            this.dragPos.isBeingDragged = true;
            this.dragSize.isBeingDragged = true;
            return true;
        }
        return false;

    }

    handleMouseDragged(p: P5) {
        const pointDragged = this.points.find(point => point.isBeingDragged);

        if (pointDragged) {

            if (this.dragSize == pointDragged) {
                pointDragged.x = p.mouseX;
                this.radius = dist(pointDragged.x, pointDragged.y, this.x, this.y);
            } else if (this.dragPos == pointDragged) {
                pointDragged.set(p.mouseX, p.mouseY);
                this.dragSize.y = pointDragged.y
                this.dragSize.x = pointDragged.x + this.radius;
            }
        }
    }

    handleMouseOver(p: P5) {
        this.isBeingHovered = this.containsXY(p.mouseX, p.mouseY);
        this.points.forEach(point => point.handleMouseOver(p));
    }

    handleMouseReleased() {
        this.points.forEach(p => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    containsXY(x: number, y: number) {
        return dist(this.x, this.y, x, y) < this.radius;
    }

    setStyle(p: P5) {
        if (this.dragEnabled && this.isBeingHovered) {
            p.strokeWeight(3)
            p.stroke('#0000ff');
        } else {
            p.noStroke();
        }

        if (this.dragEnabled && this.isBeingHovered && !this.isDragged) {
            p.fill(getHoverColor(this._color));
        } else if (this.dragEnabled && this.isDragged) {
            p.fill(getClickColor(this._color));
        } else {
            p.fill(this._color);
        }
    }

    draw(p: P5) {
        this.setStyle(p)
        p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

        const isPointsActive = this.points.some(point => point.isBeingDragged || point.isBeingHovered) || this.isBeingHovered;

        if (this.dragEnabled && isPointsActive) {
           this.dragSize.draw(p);
        }
    }

}
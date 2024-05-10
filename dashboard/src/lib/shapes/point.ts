import {dist} from "@/lib/util_functions";
import P5 from "p5";
import {Vector} from "@/lib/shapes/vector";
import {
    DEFAULT_POINT_CLICK_COLOR,
    DEFAULT_POINT_FILL_COLOR, DEFAULT_POINT_HOVER_COLOR
} from "@/lib/settings";

export class Point {
    pos: Vector
    radius: number
    isDragged: boolean
    isBeingDragged = false
    isBeingHovered = false
    dragEnabled: boolean
    color: string

    constructor(x: number, y: number) {
        this.pos = new Vector(x, y);
        this.radius = 10;
        this.isDragged = false;
        this.dragEnabled = true;
        this.color = DEFAULT_POINT_FILL_COLOR;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    set x(x: number) {
        this.pos.x = x;
    }

    set y(y: number) {
        this.pos.y = y;
    }


    set(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
    }

    distanceTo(otherPoint: Point) {
        dist(this.x, this.y, otherPoint.x, otherPoint.y)
    }

    move(x: number, y: number) {
        this.pos.x = x;
        this.pos.y = y;
    }

    add(point: Point) {
        this.pos.x += point.x;
        this.pos.y += point.y;
    }

    containsXY(x: number, y: number) {
        return dist(this.x, this.y, x, y) < this.radius;
    }

    handleMousePressed(p: P5) {
        this.isDragged = this.containsXY(p.mouseX, p.mouseY)
        if (this.isDragged) {
            this.color = DEFAULT_POINT_CLICK_COLOR
        }
        return this.isDragged;
    }

    handleMouseDragged(p: P5) {
        this.set(p.mouseX, p.mouseY);
    }

    handleMouseOver(p: P5) {
        this.isBeingHovered = this.containsXY(p.mouseX, p.mouseY);
    }

    handleMouseReleased() {
        this.isDragged = false;
        this.color = DEFAULT_POINT_FILL_COLOR;
    }


    draw(p: P5) {
        if (this.isBeingDragged) {
            p.stroke(DEFAULT_POINT_CLICK_COLOR);
        } else if (this.isBeingHovered) {
            p.stroke(DEFAULT_POINT_HOVER_COLOR);
        } else {
            p.stroke(this.color);
        }
        p.strokeWeight(10);
        p.point(this.x, this.y);
    }
}

import type P5 from "p5";
import {Point} from "@/lib/shapes/point";
import {Vector} from "@/lib/shapes/vector";
import {Rect} from "@/lib/shapes/rectangle";
import {getClickColor, getHoverColor} from "@/lib/util_functions";

export class Text extends Rect {
    text: string;
    pos: Vector;
    fontSize: number;
    textStyle: P5.THE_STYLE;
    color: string;
    _color: string;
    x_align: P5.HORIZ_ALIGN
    y_align: P5.VERT_ALIGN;
    scalePoint: Point
    dragOffset: Point = new Point(0, 0)
    p: P5

    dragEnabled: boolean = true

    isBeingHovered = false
    isDragged = false


    constructor(p: P5, text: string = "", x: number = 0, y: number = 0, fontSize: number = 22, textStyle: P5.THE_STYLE = 'normal', color: string = "#000000") {
        super(x, y, 0, 0)
        this.p = p;
        this.text = text;
        this.pos = new Vector(x, y);
        this.fontSize = fontSize;
        this.textStyle = textStyle;
        this.color = color;
        this._color = this.color;
        this.x_align = 'left';
        this.y_align = 'center';
        this.scalePoint = new Point(this.pos.x + this.width, this.pos.y + this.height / 2);
        this._width = this.width + 10;
        this._height = this.height / 2
        this._y = this.pos.y - this._height / 2
    }


    get width() {
        this.setStyle();
        return this.p.textWidth(this.text);
    }

    get height() {
        this.setStyle();
        return this.p.textAscent() + this.p.textDescent();
    }

    setScalePoint() {
        this.scalePoint.set(this.pos.x + this.width, this.pos.y + this.height / 2);
    }

    setTextRect() {
        this._width = this.width + 10;
        this._height = this.height + 10;
        this._x = this.pos.x;
        this._y = this.pos.y - this._height / 2;
    }

    setX(x: number) {
        this.pos.x = x;
        this.setScalePoint()
        this.setTextRect();
    }

    setY(y: number) {
        this.pos.y = y;
        this.setTextRect();
        this.setScalePoint();
    }

    centerShape(canvasWidth: number, canvasHeight: number) {
        this.alignHorizontalCenter(canvasWidth);
        this.alignVerticalCenter(canvasHeight);
        this.setScalePoint();
        this.setTextRect();
    }

    alignVerticalCenter(canvasHeight: number) {
        this.pos.y = (canvasHeight / 2)
        this.setScalePoint();
        this.setTextRect();
    }

    alignHorizontalCenter(canvasWidth: number) {
        this.pos.x = canvasWidth / 2 - (this.width / 2);
        this.setScalePoint();
        this.setTextRect();
    }

    handleMouseOver(p: P5) {
        if (!this.dragEnabled) return false;
        const pointHovered = this.scalePoint.handleMouseOver(p);
        this.isBeingHovered = this.containsXY(p.mouseX, p.mouseY);
        return this.isBeingHovered || pointHovered;
    }

    toJSON() {
        this.setTextRect();


        return {
            "instructionType": "text",
            "text": this.text,
            "position": {
                "x": this.x * 2,
                "y": this.y * 2
            },
            width: this.width * 2,
            height: this.height * 2,
            'xAlign': 0,
            'yAlign': 0,
            "size": this.fontSize * 2,
            "textStyle": this.textStyle,
            "color": this._color
        }
    }

    handleMousePressed(p: P5) {
        if (!this.dragEnabled) return false;

        const pointPressed = this.scalePoint.handleMousePressed(p);

        if (pointPressed) {
            this.scalePoint.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const textPressed = this.containsXY(p.mouseX, p.mouseY);
            if (textPressed) {
                this.isDragged = true;
                this.dragOffset = new Point(p.mouseX - this.x, p.mouseY - this.y - this.height / 2);
                return true;
            }
        }
        return false;

    }

    handleMouseDragged(p: P5) {
        if (!this.dragEnabled) return false;
        const pointDragged = this.scalePoint.isBeingDragged
        console.log("pointDragged", pointDragged)
        if (pointDragged) {
            this.fontSize = Math.max(5, this.fontSize + p.mouseX - p.pmouseX);
            this.setScalePoint();
            this.setTextRect();
        } else if (this.isDragged) {
            this.setX(p.mouseX - this.dragOffset.x);
            this.setY(p.mouseY - this.dragOffset.y);
            this.setScalePoint();
            this.setTextRect();
        }
    }

    handleMouseReleased() {
        this.scalePoint.isBeingDragged = false;
        this.isDragged = false;
    }


    setStyle() {
        if (this.dragEnabled && this.isBeingHovered && !this.isDragged) {
            this.p.fill(getHoverColor(this._color));
        } else if (this.dragEnabled && this.isDragged) {
            this.p.fill(getClickColor(this._color));
        } else {
            this.p.fill(this._color);
        }
        this.p.textAlign(this.x_align, this.y_align);
        this.p.noStroke()
        this.p.textSize(this.fontSize);
        this.p.textStyle(this.textStyle);
    }

    draw(p: P5) {
        this.setStyle();
        p.text(this.text, this.pos.x, this.pos.y);

        if (this.isBeingHovered || this.isDragged) {
            this.scalePoint.draw(p);
        }

        //p.rect(this._x, this._y, this._width, this._height)

    }


}


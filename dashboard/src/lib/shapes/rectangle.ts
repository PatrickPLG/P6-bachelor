import P5 from 'p5';
import {Point} from './point';
import {DEFAULT_CLICK_COLOR, DEFAULT_FILL_COLOR} from "@/lib/settings";
import {getClickColor, getHoverColor} from "@/lib/util_functions";

export class Rect {
    _x: number;
    _y: number;
    _width: number;
    _height: number;


    constructor(x: number, y: number, p_nWidth: number, p_nHeight: number) {
        this._x = x;
        this._y = y;
        this._width = p_nWidth;
        this._height = p_nHeight;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }


    get height() {
        return this._height;
    }

    get minX() {
        return this._x;
    }

    get minY() {
        return this._y;
    }

    get maxX() {
        return this._x + this._width;
    }

    get maxY() {
        return this._y + this._height;
    }

    get centerX() {
        return this._x + this._width / 2;
    }

    get centerY() {
        return this._y + this._height / 2;
    }

    move(x: number, y: number) {
        this._x += x;
        this._y += y;
    }

    copy() {
        return new Rect(this._x, this._y, this._width, this._height);
    }

    localRect() {
        return new Rect(0, 0, this.width, this.height);
    }

    contains(otherRect: Rect) {
        return this.minX < otherRect.minX && this.maxX > otherRect.maxX
            && this.minY < otherRect.minY && this.maxY > otherRect.maxY;
    }

    expandToIncludeRect(otherRect: Rect) {
        let maxX = this.maxX;
        let maxY = this.maxY;

        this._x = Math.min(this._x, otherRect._x);
        this._y = Math.min(this._y, otherRect._y);

        maxX = Math.max(maxX, otherRect.maxX);
        maxY = Math.max(maxY, otherRect.maxY);

        this._width = maxX - this._x;
        this._height = maxY - this._y;
    }

    containsXY(x: number, y: number) {
        return this.minX <= x && x < this.maxX
            && this.minY <= y && y < this.maxY;
    }

    getConcentric(scale: number) {
        let newX = this.x - (scale - 1) * this.width / 2;
        let newY = this.y - (scale - 1) * this.height / 2;
        return new Rect(newX, newY, this.width * scale, this.height * scale);
    }
}

export class Rectangle extends Rect {
    color: string;
    _color: string;
    isDragged: boolean;
    dragEnabled: boolean;
    dragArea: Rect;
    dragOffset: Point | undefined;
    isBeingHovered = false;
    roundness = 0;

    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
    points: Point[];

    constructor(x: number, y: number, p_nWidth: number, p_nHeight: number, color: string = DEFAULT_FILL_COLOR) {
        super(x, y, p_nWidth, p_nHeight);

        this.topLeft = new Point(0, 0);
        this.topRight = new Point(0, 0);
        this.bottomRight = new Point(0, 0);
        this.bottomLeft = new Point(0, 0);

        this.points = [];
        this.points.push(this.topLeft);
        this.points.push(this.topRight);
        this.points.push(this.bottomRight);
        this.points.push(this.bottomLeft);

        this.computePoints();
        this.dragEnabled = true;
        this.dragArea = this;
        this.dragOffset = undefined;
        this.isDragged = false;
        this.color = color;
        this._color = this.color;
    }


    setWidth(newWidth: number) {
        //set width with points
        let deltaWidth = this.width - newWidth;
        this.topRight.x -= deltaWidth;
        this.bottomRight.x -= deltaWidth;
        this._width = newWidth;
        console.log(this.width)
        this.computePosAndSize();
    }

    setHeight(newHeight: number) {
        //set height with points
        let deltaHeight = this.height - newHeight;
        this.bottomLeft.y -= deltaHeight;
        this.bottomRight.y -= deltaHeight;
        this._height = newHeight;
        this.computePosAndSize();
    }

    setX(newX: number) {
        let deltaX = this.x - newX;
        this.topLeft.x -= deltaX;
        this.topRight.x -= deltaX;
        this.bottomRight.x -= deltaX;
        this.bottomLeft.x -= deltaX;
        this._x = newX;
        this.computePosAndSize();
    }

    setY(newY: number) {
        let deltaY = this.y - newY;
        this.topLeft.y -= deltaY;
        this.topRight.y -= deltaY;
        this.bottomRight.y -= deltaY;
        this.bottomLeft.y -= deltaY;
        this._y = newY;
        this.computePosAndSize();
    }

    setRoundness(roundness: string) {
        this.roundness = parseInt(roundness)
    }


    setSize(newSize: number) {
        let deltaWidth = this.width - newSize;
        let deltaHeight = this.height - newSize;

        // Maintain location
        this._x += deltaWidth / 2;
        this._y += deltaHeight / 2;

        this._width = newSize;
        this._height = newSize;
    }

    computePoints() {
        this.topLeft.set(this.minX, this.minY);
        this.topRight.set(this.maxX, this.minY);
        this.bottomRight.set(this.maxX, this.maxY);
        this.bottomLeft.set(this.minX, this.maxY);
    }

    centerShape(canvasWidth: number, canvasHeight: number) {
        this._x = (canvasWidth - this.width) / 2;
        this._y = (canvasHeight - this.height) / 2;
        this.computePoints();
    }

    alignHorizontalCenter(canvasWidth: number) {
        this._x = (canvasWidth - this.width) / 2;
        this.computePoints();
    }

    alignVerticalCenter(canvasHeight: number) {
        this._y = (canvasHeight - this.height) / 2;
        this.computePoints();
    }

    toJSON() {
        return {
            "instructionType": "rectangle",
            "position": {
                "x": this.x * 2,
                "y": this.y * 2
            },
            "width": this.width * 2,
            "height": this.height * 2,
            "color": this._color,
            "round": this.roundness * 2
        }
    }

    computePosAndSize() {
        const allX = this.points.map(p => p.x);
        const allY = this.points.map(p => p.y);

        const minX = Math.min(...allX);
        const minY = Math.min(...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);

        this._x = minX;
        this._y = minY;
        this._width = maxX - minX;
        this._height = maxY - minY;
    }

    handleMouseOver(p: P5) {
        this.points.forEach(point => point.handleMouseOver(p));
        this.isBeingHovered = this.containsXY(p.mouseX, p.mouseY);

    }

    handleMousePressed(p: P5) {
        const pointPressed = this.points.find(point => point.containsXY(p.mouseX, p.mouseY));

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const dragAreaPressed = this.dragArea.containsXY(p.mouseX, p.mouseY);
            if (dragAreaPressed) {
                this.isDragged = true;
                this.dragOffset = new Point(p.mouseX - this.x, p.mouseY - this.y);
                return true;
            }
        }
        return false;
    }

    handleMouseDragged(p: P5) {
        const pointDragged = this.points.find(point => point.isBeingDragged);

        if (pointDragged) {
            pointDragged.set(p.mouseX, p.mouseY);

            if (this.topLeft == pointDragged) {
                this.bottomLeft.x = pointDragged.x;
                this.topRight.y = pointDragged.y;

            } else if (this.topRight == pointDragged) {
                this.bottomRight.x = pointDragged.x;
                this.topLeft.y = pointDragged.y;

            } else if (this.bottomRight == pointDragged) {
                this.topRight.x = pointDragged.x;
                this.bottomLeft.y = pointDragged.y;

            } else if (this.bottomLeft == pointDragged) {
                this.topLeft.x = pointDragged.x;
                this.bottomRight.y = pointDragged.y;
            }
            this.computePosAndSize();
        } else {
            if (this.dragOffset) {
                this._x = p.mouseX - this.dragOffset.x;
                this._y = p.mouseY - this.dragOffset.y;
                this.computePoints();
            } else {
                this._x = p.mouseX
                this._y = p.mouseY
                this.computePoints();
            }

        }
    }

    handleMouseReleased() {
        this.points.forEach(point => {
            point.isBeingDragged = false;
        });
        this.isDragged = false;
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

        p.rectMode(p.CORNER)
        p.rect(this.x, this.y, this.width, this.height, this.roundness);

        const isPointsActive = this.points.some(point => point.isBeingDragged || point.isBeingHovered) || this.isBeingHovered;


        if (this.dragEnabled && isPointsActive && !this.isDragged) {
            this.points.forEach(point => point.draw(p));
        }
    }

}


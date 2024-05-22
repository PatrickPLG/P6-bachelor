import P5 from 'p5';
import {DEFAULT_FILL_COLOR} from "../settings";
import {Point} from "./point";
import {getHoverColor} from "chart.js/helpers";
import {getClickColor} from "../util_functions";
import {Rect} from "./rectangle";


export class Image extends Rect {
  color: string;
  _color: string;
  isDragged: boolean;
  dragEnabled: boolean;
  dragArea: Rect;
  dragOffset: Point | undefined;
  isBeingHovered = false;
  roundness = 0;
  base64: string;
  img: P5.Image;

  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
  points: Point[];

  constructor(x: number, y: number, p_nWidth: number, p_nHeight: number, color: string = DEFAULT_FILL_COLOR, base64: string, p: P5) {
    super(x, y, p_nWidth, p_nHeight);
    this.base64 = base64;
    this.img = p.loadImage(this.base64, (img) => {

      this.scaleToFitCanvas()
    })


    /* this._width = this.img.width;
     this._height = this.img.height;*/

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

  scaleToFitCanvas() {

    if (this.img.width > 1920 / 2 && this.img.height > 1080 / 2) {
      this.img.resize(1920 / 2, 0)
      this.img.resize(0, 1080 / 2)
    } else if (this.img.width > this.img.height) {
      this.img.resize(1920 / 2, 0)
    } else {
      this.img.resize(0, 1080 / 2)
    }
    this.setWidth(this.img.width)
    this.setHeight(this.img.height)
    this.centerShape(1920 / 2, 1080 / 2)
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
      "instructionType": "image",
      "position": {
        "x": this.x * 2,
        "y": this.y * 2
      },
      "width": this.width * 2,
      "height": this.height * 2,
      "base64": this.base64.substring(22)
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
    if (!this.dragEnabled) return false;

    let pointHovered = false;
    this.points.forEach(point => {
      if (point.handleMouseOver(p)) {
        pointHovered = true;
      }
    });
    this.isBeingHovered = this.containsXY(p.mouseX, p.mouseY);

    return this.isBeingHovered || pointHovered;
  }

  handleMousePressed(p: P5) {
    if (!this.dragEnabled) return false;

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
    if (!this.dragEnabled) return false;

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


  draw(p: P5) {

    p.imageMode(p.CORNER)
    //p.rect(this.x, this.y, this.width, this.height, this.roundness);
    p.image(this.img, this.x, this.y, this.width, this.height)
    const isPointsActive = this.points.some(point => point.isBeingDragged || point.isBeingHovered) || this.isBeingHovered;


    if (this.dragEnabled && isPointsActive && !this.isDragged) {
      this.points.forEach(point => point.draw(p));
    }
  }

}


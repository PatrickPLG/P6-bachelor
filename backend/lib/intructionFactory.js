

class instructionFactory {
    instructions = [];

    constructor() {
        this.instructions = [];
    }

    getInstructions() {
       //return instructions as json array
        return this.instructions;
    }

    addCircle(color, x, y, size) {
        this.instructions.push(new CircleInstruction(color, x, y, size));
    }

    addRectangle(color, x, y, width, height) {
        this.instructions.push(new RectangleInstruction(color, x, y, width, height));
    }

    addTriangle(color, x1, y1, x2, y2, x3, y3) {
        this.instructions.push(new TriangleInstruction(color, x1, y1, x2, y2, x3, y3));
    }

    addEllipse(color, x, y, width, height) {
        this.instructions.push(new EllipseInstruction(color, x, y, width, height));
    }

    addText(color, x, y, width, height, size, text) {
        this.instructions.push(new TextInstruction(color, x, y, width, height, size, text));
    }

    addImage(base64) {
        console.log('not implemented')
    }
}


class CircleInstruction {
    instructionType = 'circle';
    color = '#FFFFFF';
    position = {x: 0, y: 0};
    size = 0;

    constructor(color, x,y, size) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.size = size;
    }
}

class RectangleInstruction {
    instructionType = 'rectangle';
    color = '#FFFFFF';
    position = {x: 0, y: 0};
    width = 0;
    height = 0;

    constructor(color, x,y, width, height) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
    }

}

class TriangleInstruction {
    instructionType = 'triangle';
    color = '#FFFFFF';
    points = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];

    constructor(color, x1, y1, x2, y2, x3, y3) {
        this.color = color;
        this.points[0].x = x1;
        this.points[0].y = y1;
        this.points[1].x = x2;
        this.points[1].y = y2;
        this.points[2].x = x3;
        this.points[2].y = y3;
    }
}

class EllipseInstruction {
    instructionType = 'ellipse';
    color = '#FFFFFF';
    position = {x: 0, y: 0};
    width = 0;
    height = 0;

    constructor(color, x,y, width, height) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
    }
}

class TextInstruction {
    instructionType = 'text';
    color = '#FFFFFF';
    position = {x: 0, y: 0};
    size = 0;
    width = 0;
    height = 0;
    text = '';

    constructor(color, x,y, width, height, size, text) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
        this.size = size;
        this.text = text;
    }
}

class ImageInstruction {
    instructionType = 'image';
    base64 = '';
}

module.exports = {
    instructionFactory
};
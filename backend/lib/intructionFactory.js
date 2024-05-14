

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

    addRectangle(color, x, y, width, height,round) {
        this.instructions.push(new RectangleInstruction(color, x, y, width, height,round));
    }

    addTriangle(color, x1, y1, x2, y2, x3, y3) {
        this.instructions.push(new TriangleInstruction(color, x1, y1, x2, y2, x3, y3));
    }

    addEllipse(color, x, y, width, height) {
        this.instructions.push(new EllipseInstruction(color, x, y, width, height));
    }

    addText(color, x, y, size, text) {
        this.instructions.push(new TextInstruction(color, x, y, size, text));
    }

    addImage(base64, x, y, width, height) {
        this.instructions.push(new ImageInstruction(base64, x, y, width, height));
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
    round = 0;
    constructor(color, x,y, width, height,round) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.width = width;
        this.height = height;
        this.round = round;
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
    text = '';
    xAlign = 0;
    yAlign = 0;

    constructor(color, x,y, size, text,align) {
        this.color = color;
        this.position.x = x;
        this.position.y = y;
        this.size = size;
        this.text = text;
    }
}

class ImageInstruction {
    instructionType = 'image';
    base64 = '';
    position = {x: 0, y: 0};


constructor(base64, x, y, width, height) {
        this.base64 = base64;
        this.width = width;
        this.height = height;
        this.position.x = x;
        this.position.y = y;
    }

}

module.exports = {
    instructionFactory
};
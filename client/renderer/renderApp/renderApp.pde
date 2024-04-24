




JSONArray json;

void setup() {
  size(640, 360);
 
}

void draw() {
  background(255);
   loadData();
}

void loadData() {
  // Load JSON file
  // Temporary full path until path problem resolved.
  json = loadJSONArray("data.json");

  for (int i = 0; i < json.size(); i++) {
    JSONObject instruction = json.getJSONObject(i);
    println(instruction);

    String _shape = instruction.getString("shape");


    int _color = color(instruction.getInt("color"));
    float _posX = instruction.getJSONObject("position").getFloat("x");
    float _posY = instruction.getJSONObject("position").getFloat("y");

    if (_shape.equals("circle")) {
      println("drawing circle...");
      float _size = instruction.getFloat("size");
      fill(_color);
      ellipse(_posX, _posY, _size, _size);
    } else if (_shape.equals("rectangle")) {
            println("drawing rectangle...");

      float _width = instruction.getFloat("width");
      float _height = instruction.getFloat("height");
      fill(_color);
      rect(_posX, _posY, _width, _height);
    }
  }
}

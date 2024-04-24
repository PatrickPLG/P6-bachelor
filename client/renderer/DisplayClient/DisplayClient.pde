import java.util.Base64;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import processing.core.PApplet;
import processing.data.JSONArray;
import processing.data.JSONObject;



public class DisplayClient extends PApplet {

  JSONArray json;

  public static void main(String[] args) {
    PApplet.main("DisplayClient");
  }


  public void settings() {
    size(600, 400);
  }

  public void setup() {
    background(255);
  }

  public void draw() {
    loadData();
  }


  void loadData() {
    // Load JSON file
    // Temporary full path until path problem resolved.
    json = loadJSONArray("/home/mosfet/Projects/P6-bachelor/client/renderer/DisplayClient/instructions.json");

    for (int i = 0; i < json.size(); i++) {
      JSONObject instruction = json.getJSONObject(i);
      String shape = instruction.getString("shape");

      switch (shape) {
      case "circle":
        drawCircle(instruction);
        break;
      case "rectangle":
        drawRectangle(instruction);
        break;
      case "ellipse":
        drawEllipse(instruction);
        break;
      case "triangle":
        drawTriangle(instruction);
        break;
      default:
        println("Unsupported shape: " + shape);
      }
    }
  }


  void drawCircle(JSONObject instruction) {
    int colorValue = getColor(instruction.getString("color"));
    float posX = instruction.getJSONObject("position").getFloat("x");
    float posY = instruction.getJSONObject("position").getFloat("y");
    float size = instruction.getFloat("size");
    ellipse(posX, posY, size, size);
    fill(colorValue);
  }

  void drawRectangle(JSONObject instruction) {
    int colorValue = getColor(instruction.getString("color"));
    float posX = instruction.getJSONObject("position").getFloat("x");
    float posY = instruction.getJSONObject("position").getFloat("y");
    float _width = instruction.getFloat("width");
    float _height = instruction.getFloat("height");
    rect(posX, posY, _width, _height);
        fill(colorValue);

  }

  void drawEllipse(JSONObject instruction) {
    int colorValue = getColor(instruction.getString("color"));
    float posX = instruction.getJSONObject("position").getFloat("x");
    float posY = instruction.getJSONObject("position").getFloat("y");
    float _width = instruction.getFloat("width");
    float _height = instruction.getFloat("height");
    ellipse(posX, posY, _width, _height);
    fill(colorValue);
  }

  void drawTriangle(JSONObject instruction) {
    int colorValue = getColor(instruction.getString("color"));
    JSONArray points = instruction.getJSONArray("points");
    if (points.size() == 3) {
      float x1 = points.getJSONObject(0).getFloat("x");
      float y1 = points.getJSONObject(0).getFloat("y");
      float x2 = points.getJSONObject(1).getFloat("x");
      float y2 = points.getJSONObject(1).getFloat("y");
      float x3 = points.getJSONObject(2).getFloat("x");
      float y3 = points.getJSONObject(2).getFloat("y");
      triangle(x1, y1, x2, y2, x3, y3);
      fill(colorValue);
    } else {
      println("Invalid number of points for triangle.");
    }
  }


  PImage base64ToPImage(String base64) {
    try {
      byte[] imageBytes = Base64.getDecoder().decode(base64);
      ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
      BufferedImage bImage = ImageIO.read(bis);
      return bufferedImageToPImage(bImage);
    }
    catch (Exception e) {
      println("Error loading image: " + e.getMessage());
      return null;
    }
  }

  PImage bufferedImageToPImage(BufferedImage bImage) {
    PImage img = createImage(bImage.getWidth(), bImage.getHeight(), ARGB);
    bImage.getRGB(0, 0, img.width, img.height, img.pixels, 0, img.width);
    img.updatePixels();
    return img;
  }

  int getColor(String hex) {
    int colorInt = unhex(hex.substring(1)); // Remove '#' and convert hex to int
    println(colorInt, hex.substring(1));
    return colorInt;
  }
}

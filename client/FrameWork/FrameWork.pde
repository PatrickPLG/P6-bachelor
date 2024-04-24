PImage currentImage;
String currentImageName = "";
int checkInterval = 5000;
int lastChecked = 0; 

void setup() {
  size(1920, 1080);
  loadImageFromJSON();
}

void draw() {
  background(255);
  if (millis() - lastChecked > checkInterval) {
    lastChecked = millis();
    loadImageFromJSON();
  }
  if (currentImage != null) {
    image(currentImage, 0, 0, width, height);
  }
}

void loadImageFromJSON() {
  try {
    String path = "D:/P6 Bachelor proj/P6-bachelor/client/FrameWork/settings.json";
    JSONObject json = loadJSONObject(path);
    String imageName = json.getString("image");
    if (!imageName.equals(currentImageName)) { 
      currentImageName = imageName;
      currentImage = loadImage("artwork/" + imageName); 
    }
  } catch (Exception e) {
    println("Failed to load or parse JSON");
  }
}


import peasy.*;
 
PeasyCam cam;
Table phenoDat;
int rowCount;
float[] uberons;
float[] phenotypes;
float[] presences;
String[] names;
color black=color(0,0,0);
color white=color(255,255,255);
 
void setup() {
  size(500,500,P3D);
  phenoDat=new Table("PhenoDat short - Sheet1.tsv");
  rowCount=phenoDat.getRowCount();
  cam = new PeasyCam(this, 500);
  cam.setMinimumDistance(100);
  cam.setMaximumDistance(1000);
 
}
void draw() { 
  uberons=new float[rowCount];
  phenotypes=new float[rowCount];
  presences=new float[rowCount];
  names=new String[rowCount];
 
  rotateX(-.001);
  rotateY(-.001);
  background(black);
  translate(0,0,0);
 
  pushMatrix();
  fill(200);
  rect(0,0,200,200);
 
  // asse x
  stroke(0,100,0); 
  line(0, 0, 0, 150, 0, 0);
  fill(white);
  text("Uberon",140,-5,0); //x axis
 
  for (int i=10;i<200;i=i+10){
    stroke(200);
    line(0, 0, i, 200, 0, i);
    line(0, 0, i, 0, 200, i);
    line(i, 0, 0, i, 0, 200);
    line(0, i, 0, 0, i, 200);
  }

 
  stroke(255,0,0);
  line(0, 0, 0, 0, 150, 0);
 
  pushMatrix();
  rotate(-HALF_PI);
  fill(white);
  text("Phenotype",-160,-5,0); //y axis
  popMatrix();
 

  stroke(0,0,255);
  line(0, 0, 0, 0, 0, 150);
  pushMatrix();
  rotateY(-HALF_PI);
  fill(white);
  text("Presence",140,-5,0); //z axis
  popMatrix();


for (int i=0; i<rowCount; i++){
  float phenoTot=phenoDat.getInt(i,2);
  float uberon=phenoDat.getInt(i,0);
  float presence=phenoDat.getInt(i,3);
  String anatomy=phenoDat.getString(i,1);
  
  // information for mouse click, using original data
  float uberonOrig=map(uberon,0,55,0,200);
  float presenceOrig=map(presence,0,4989,0,200);
  float phenoTotOrig=map(phenoTot,0, 3976, 0, 200);
  uberons[i]=uberonOrig;
  presences[i]=presenceOrig;
  phenotypes[i]=phenoTotOrig;
  
   // translate data to be graphed, relative movement accounted for
  if (i!=0){
    uberon=uberon-phenoDat.getInt(i-1,0);
    phenoTot=phenoTot-phenoDat.getInt(i-1,2);
    presence=presence-phenoDat.getInt(i-1,3);
  }
  names[i]=anatomy;
 
  
  uberon=map(uberon,0,55,0,200);
  phenoTot=map(phenoTot,0, 3976, 0, 200);
  presence=map(presence, 0, 4989, 0, 200); 
  
  translate(uberon, phenoTot, presence);
  noStroke();
  lights();
  fill(0,255,0);
  sphere(5);
  
}
print(names[0]);
for (int i=0; i<rowCount;i++){
  float x=screenX(uberons[i],phenotypes[i],presences[i]);
  float y=screenY(uberons[i],phenotypes[i],presences[i]);
  if (mouseX<x+5 && mouseX>x-5 && mouseY<y+5 && mouseY>y-5){
    print("Yes");
    text(names[i],screenX(uberons[i],phenotypes[i],presences[i]),screenY(uberons[i],phenotypes[i],presences[i]));
  }
}
 

 
translate(0,0,50);
popMatrix();
 
printCamera();
}
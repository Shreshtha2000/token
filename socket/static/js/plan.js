var homec = [-1, -1];
var gpslat,gpslon;
var socket;
        $(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/test');

    socket.on('gpsilat', function(msg) {
     let num = parseFloat(msg.message);
    gpslat = num / 10000000.00;
    if(homec[1]==-1)
     {

    homec[1] = gpslat;
    sethomepos();
  }

    });


    socket.on('gpsilon', function(msg) {
    let num = parseFloat(msg.message);
     gpslon = num / 10000000.00;
     if(homec[0]==-1){
    homec[0] = gpslon;
    sethomepos();
      }
    console.log(homec);});
});
//hloc();





/*function hloc(){
while(homec[0]==0 || homec[1]==0)
{

  socket.on('gpsilat', function(msg) {
     let num = parseFloat(msg.message);
    gpslat = num / 10000000.00;
    homec[1] = gpslat;});
  socket.on('gpsilon', function(msg) {
    let num = parseFloat(msg.message);
    num = num.toFixed(2);
     gpslon = num / 10000000.00;
    homec[0] = gpslon;});
}
    }*/

var sd = [];
const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});


var home = new ol.Feature({
  geometry : new ol.geom.Point(ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857')),
});
home.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'https://www.clipartmax.com/png/small/5-51701_marker-icon-google-maps.png',
      size:[500,500],
      scale : 0.08,
    }),
  })
);

var source = new ol.source.Vector({features : [home]});

var vector = new ol.layer.Vector({
  source: source,
});



const map = new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10,
  }),
});
console.log(typeof map);


function sethomepos()
{
map.removeLayer(vector);
home = new ol.Feature({
  geometry : new ol.geom.Point(ol.proj.transform(homec, 'EPSG:4326', 'EPSG:3857')),
});
home.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'https://www.clipartmax.com/png/small/5-51701_marker-icon-google-maps.png',
      size:[500,500],
      scale : 0.08,
    }),
  })
);
source = new ol.source.Vector({features : [home]});
vector = new ol.layer.Vector({
  source: source,
});
map.addLayer(vector);
map.getView().setCenter(ol.proj.transform(homec, 'EPSG:4326', 'EPSG:3857'))
let draw; // global so we can remove it later
    draw = new ol.interaction.Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);
}

var calcords = [];


var tpc = [];



let draw; // global so we can remove it later
    draw = new ol.interaction.Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);

source.on('addfeature', function(evt){
    var feature = evt.feature;
    var coords = feature.getGeometry().getCoordinates();
        console.log(coords['0']);
        calcords = [];
        for(let i = 0; i< coords['0'].length;i++)
          calcords.push(ol.proj.transform(coords['0'][i],'EPSG:3857', 'EPSG:4326' ));
       // console.log(calcords);
        //initiator();
        tpc.push(calcords)        
//        console.log(calcords);

});

function removelayer()
{
map.removeLayer(vectorLineLayer);
};

document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});
document.getElementById('remove').addEventListener('click',removelayer,false);
document.getElementById('survey').addEventListener('click',start,false);
document.getElementById('upload').addEventListener('click',uploadmiss,false);

function uploadmiss()
{
socket.emit("da",{data:misslist});
socket.emit("line",{data:fdlcc});
};
var sv ;
var lv;
var linebear = [];
var lb;
var pd = [];
var mind,maxd;
var totald;
var dc = [];
var vlc = [];
var vlr =[];
var midp = [];
var totall;
var linec =[];
var featureLine;
var vectorLine;
var vectorLineLayer;
var flc = [];
var flb = [];
var fsv = [];
var fdlc = [];
var fdlcc=[];
var sidedist;
var frontdist;
var campoints =[];
var misslist=[];



function start()
{
  



  var speed=5;
var altitude = 100;
var sidol = 50;
var frontol = 50;
var focl = 20;
var gsd;
var sensw = 23.5;
var sensh = 15.6;
var imagh = 4000;
var imagw = 6000;
altitude = document.getElementById("alt").value;
altitude=parseInt(altitude)
speed = document.getElementById("speed").value;
frontol = document.getElementById("fol").value;
sidol = document.getElementById("sol").value;
gsd = altitude*100*sensh/focl/imagh;
//console.log(gsd);
var groundw = gsd*imagw/100;
var groundh = gsd*imagh/100;
sidedist = (100-sidol)*groundw/100;
frontdist = (100-frontol)*groundh/100;
console.log(sidedist);
console.log(frontdist);
//console.log(tpc);
for(let i=0;i<tpc.length;i++)
{
  calcords = tpc[i];
  fsv.push(i);
  initiator();
  console.log(calcords)
  
}
//console.log(flb);
//console.log(flc);
//console.log(fsv);

var hd =[];
for(let i=0;i<fsv.length;i=i+2)
{
  var dist;
  var dist1;
  //console.log(flc[fsv[i]])
  //console.log(flc[fsv[i]][fsv[i+1]])
  //console.log(flc[fsv[i]][fsv[i+1]][0])
  //console.log(flc[fsv[i]][fsv[i+1]][0][0]);
dist = distancecalc(flc[fsv[i]][fsv[i+1]][0][0],flc[fsv[i]][fsv[i+1]][0][1],homec[0],homec[1]);
if(dist<0)
  dist = -1*dist;
dist1 = distancecalc(flc[fsv[i]][fsv[i+1]][1][0],flc[fsv[i]][fsv[i+1]][1][1],homec[0],homec[1]);
if(dist1<0)
  dist1 = -1*dist1;
if(dist1<dist)
  hd.push(dist1*-1);
else
  hd.push(dist);
}

var min;
if(hd[0]<0)
  { cn =1;
    min = -1*hd[0];}
else
  {min = hd[0];
    cn =0;}
var pos = 0;
var cn;
for(let i=1;i<hd.length;i++)
{
  if(hd[i]<0)
  {
    if(-1*hd[i]<min)
    {
      pos = i;
      cn = 1;
    }
  }
  else
  {
    if(hd[i]<min)
    {
      pos = i;
      cn = 0;
    }
  }
}

fdlc.push(homec);
fdlc.push(flc[pos][fsv[2*pos+1]][cn]);
fdlc.push(flc[pos][fsv[2*pos+1]][-1*(cn-1)]);

for(let i = fsv[2*pos+1]+1;i<flc[pos].length;i++)
{
 // console.log("inside");
dist = distancecalc(flc[pos][i][0][0],flc[pos][i][0][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist<0)
dist=-1*dist;
dist1 =  distancecalc(flc[pos][i][1][0],flc[pos][i][1][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist1<0)
dist1=-1*dist1;
if(dist1<dist)
  {fdlc.push(flc[pos][i][1]);
    fdlc.push(flc[pos][i][0]);
  }
else{
  fdlc.push(flc[pos][i][0]);
    fdlc.push(flc[pos][i][1]);
}
  
}

for(let i=0;i<fsv[2*pos+1];i++)
{
 // console.log("in here");
  dist = distancecalc(flc[pos][i][0][0],flc[pos][i][0][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist<0)
dist=-1*dist;
dist1 =  distancecalc(flc[pos][i][1][0],flc[pos][i][1][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist1<0)
dist1=-1*dist1;
if(dist1<dist)
  {fdlc.push(flc[pos][i][1]);
    fdlc.push(flc[pos][i][0]);
  }
else{
  fdlc.push(flc[pos][i][0]);
    fdlc.push(flc[pos][i][1]);
}

}

for(let i =0; i<fsv[2*pos];i++)
{
  //console.log(i);
  //console.log(pos);
  //console.log(fsv);
  //console.log(fsv[2*pos]);
  for(let j=0; j<flc[i].length;j++)
  {
      dist = distancecalc(flc[i][j][0][0],flc[i][j][0][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist<0)
dist=-1*dist;
dist1 =  distancecalc(flc[i][j][1][0],flc[i][j][1][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist1<0)
dist1=-1*dist1;
if(dist1<dist)
  {fdlc.push(flc[i][j][1]);
    fdlc.push(flc[i][j][0]);
  }
else{
  fdlc.push(flc[i][j][0]);
    fdlc.push(flc[i][j][1]);
}
  }
}
for(let i =fsv[2*pos]+1; i<flc.length;i++)
{
  //console.log(fsv[2*pos]+1);
  //console.log(flc[i].length);
  for(let j=0; j<flc[i].length;j++)
  {
      dist = distancecalc(flc[i][j][0][0],flc[i][j][0][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist<0)
dist=-1*dist;
dist1 =  distancecalc(flc[i][j][1][0],flc[i][j][1][1],fdlc[fdlc.length-1][0],fdlc[fdlc.length-1][1]);
if(dist1<0)
dist1=-1*dist1;
if(dist1<dist)
  {fdlc.push(flc[i][j][1]);
    fdlc.push(flc[i][j][0]);
  }
else{
  fdlc.push(flc[i][j][0]);
    fdlc.push(flc[i][j][1]);
}
  }
}
fdlcc.push(homec);
for(let i=1;i<fdlc.length;i++)
{
  if(i%2==0)
  {
    fdlcc.push(fdlc[i]);
    let bear = bearingcalc(fdlc[i-1][0],fdlc[i-1][1],fdlc[i][0],fdlc[i][1]);
    fdlcc.push(corddb(fdlc[i],bear,190));
  }
  else
  {
      let bear = bearingcalc(fdlc[i+1][0],fdlc[i+1][1],fdlc[i][0],fdlc[i][1])
    fdlcc.push(corddb(fdlc[i],bear,70));
       fdlcc.push(fdlc[i]);
  }

}

fdlcc.push(homec);
//console.log(fdlc);



for(let i=0;i<fdlcc.length-1;i++)
{
  lineonmap(fdlcc[i],fdlcc[i+1]);
}

var arrp =[];
arrp.push(1);
arrp.push(0);
arrp.push(16);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(fdlcc[0][1]);
arrp.push(fdlcc[0][0]);
arrp.push(678);
arrp.push(1);

misslist.push(arrp);

var arrp =[];
arrp.push(0);
arrp.push(3);
arrp.push(22);
arrp.push(20);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(100);
arrp.push(1);

misslist.push(arrp);
for(let i=1;i<fdlcc.length-1;i++)
{
            arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(16);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(fdlcc[i][1]);
arrp.push(fdlcc[i][0]);
arrp.push(altitude);
arrp.push(1);
misslist.push(arrp);

if(i==1)
{
 arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(178);
arrp.push(0);
arrp.push(speed);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(1);
misslist.push(arrp);
i=i+1;
            arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(16);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(fdlcc[i][1]);
arrp.push(fdlcc[i][0]);
arrp.push(altitude);
arrp.push(1);
misslist.push(arrp);
}
    if(i%2==0)
    {

        arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(206);
arrp.push(frontdist);
arrp.push(0);
arrp.push(1);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(1);
misslist.push(arrp);
    }
    else
    {

       arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(206);
arrp.push(0);
arrp.push(0);
arrp.push(1);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(1);
misslist.push(arrp);
i=i+1;
            arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(16);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(fdlcc[i][1]);
arrp.push(fdlcc[i][0]);
arrp.push(altitude);
arrp.push(1);
misslist.push(arrp);
i=i+1;
            arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(16);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(fdlcc[i][1]);
arrp.push(fdlcc[i][0]);
arrp.push(altitude);
arrp.push(1);
misslist.push(arrp);
    }

       

}
arrp=[];
arrp.push(0);
arrp.push(3);
arrp.push(206);
arrp.push(0);
arrp.push(0);
arrp.push(1);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(0);
arrp.push(1);
misslist.push(arrp);
//console.log(hd);
console.log(misslist);

for(let i=1;i<fdlc.length-1;i=i+2)
{
  var brng = bearingcalc(fdlc[i][0],fdlc[i][1],fdlc[i+1][0],fdlc[i+1][1]);

    var cpol;
    var len = distancecalc(fdlc[i][0],fdlc[i][1],fdlc[i+1][0],fdlc[i+1][1])
    cpol = Math.floor(len/100);
    //console.log(cpol);
    //console.log(i);
    //console.log(i+1);
    var k;
    for( k =1;k<cpol;k++)
    {
      //console.log("here in cam00");
      var co = corddb(fdlc[i],brng,k*100);
      campoints.push(co);
    }
  
}
var totaldi=0;
for(let i=0; i<fdlcc.length-1;i++)
{
  var distt = distancecalc(fdlcc[i][0],fdlcc[i][1],fdlcc[i+1][0],fdlcc[i+1][1])
  if(distt<0)
    distt=-1*distt;
  console.log(distt);
  totaldi = totaldi+distt;
}
document.getElementById("distance").innerHTML="Distance : " + (totaldi/1000).toFixed(2)+" Kilometers";

var totalti = totaldi/speed;
totalti = parseInt(totalti);
var tifl = totalti/60;
var tice = totalti%60;
var sec = tice/100*60;
document.getElementById("time").innerHTML="Travelling time: " + tifl.toFixed()+" Minutes "+ (sec).toFixed()+" Seconds";
//console.log(campoints);

for(let i=0;i<campoints.length;i++)
{

var cammark = new ol.Feature({
  geometry : new ol.geom.Point(ol.proj.transform(campoints[i], 'EPSG:4326', 'EPSG:3857')),
});

cammark.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'red'})
          }),
  })
);

var sourcecam = new ol.source.Vector({features : [cammark]});

var vectorcam = new ol.layer.Vector({
  source: sourcecam,
});

map.addLayer(vectorcam);

}

//console.log(distancecalc(campoints[0][0],campoints[0][1],campoints[1][0],campoints[1][1]));
//console.log(distancecalc(fdlc[3][0],fdlc[3][1],fdlc[2][0],fdlc[2][1]));

}

function lineonmap(point1,point2)
{
  var arr =[];
  arr.push(ol.proj.transform(point1, 'EPSG:4326', 'EPSG:3857'));
  arr.push(ol.proj.transform(point2, 'EPSG:4326', 'EPSG:3857'));

  featureLine = new ol.Feature({
    geometry: new ol.geom.LineString(arr)
});

 vectorLine = new ol.source.Vector({});
vectorLine.addFeature(featureLine);
 vectorLineLayer = new ol.layer.Vector({
    source: vectorLine,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
        stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 })
    })
});

map.addLayer(vectorLineLayer);

var firstPoint = ol.proj.transform(point1, 'EPSG:4326', 'EPSG:3857');
    var secondPoint = ol.proj.transform(point2, 'EPSG:4326', 'EPSG:3857');
    var slope = ((secondPoint[1] - firstPoint[1]) / (secondPoint[0] - firstPoint[0]));
    var angle = Math.atan(slope);
    var rotation;

    //Shifting the graph Origin to point of start point
    secondPoint[0] = secondPoint[0] - firstPoint[0];
    secondPoint[1] = secondPoint[1] - firstPoint[1];
    //Fourth quadrant
    if (secondPoint[0] > 0 && secondPoint[1] < 0) {
        rotation = (Math.PI / 2 - angle);
    }
    //Second quadrant
    else if (secondPoint[0] < 0 && secondPoint[1] > 0) {
        rotation = -(Math.PI / 2 + angle);
    }
    //Third quadrant
    else if (secondPoint[0] < 0 && secondPoint[1] < 0) {
        rotation = 3 * Math.PI / 2 - angle;
    }
    //First quadrant
    else if (secondPoint[0] > 0 && secondPoint[1] > 0) {
        rotation = angle;
    }
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAdpJREFUOBGFVDtOA0EMnewGCS7ACeAYUIISEtpAxRGgRaLlFijiFkCAlgqJDokT0CAqJD7ZxLznsScT2GR35IzXnzdvbG9CWPZIKOhuS3u3lLKroWZbllbvyxIB9gB5TIGZL9kaFQltxoDdDsB8dTTPfI0YKUBCy3VA3SQ4Ke/cHrKYZFuoSFihD0AdBZtmv1L2NM9iFmIkR3YyYEYKJeUYO4XrPovVpqX3WmXGbs8ACDIx8Vrua24jy6x7APDa/UDnpSnUufJaLmFp3UNCzq5KcFJWBkjQvrHUafh/23p23wbgDAnktgaWM3bdjAVr52C+T9QSr+4d/8NyvrO3Buj1ciDfCeW+nGWa3YAh9bnrNbBzUDL35SwVowBYge9ibEU9sb1Se3wRbBMT6iTAzlaqhxBziKH2Gbt+OjN2kx3lMJOVL+q00Zd3PLHM2R3biV/KAV8edha7JUGeKNTNRh/ZfkL4xFy/KU7z2uW1oc4GHSJ1DbIK/QAyguTsfBLi/yXhEXAN8fWOD22Iv61t+uoe+LYQfQF5S1lSXmksDAMaCyleIGdgsjkHwhqz2FG0k8kvYQM5p5BnAx608HKOgNdpmF6iQh8aHOeS9atgi511lDofSlKE4ggh679ecGIXq+UAsgAAAABJRU5ErkJggg==',
            rotation: rotation
        }))
    });
    var endPoint = ol.proj.transform(point2, 'EPSG:4326', 'EPSG:3857');
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(endPoint)
    });
    iconFeature.setStyle(iconStyle);
    var vectorLin = new ol.source.Vector({});
    vectorLin.addFeature(iconFeature);

var vectorLayerpoint = new ol.layer.Vector({ source: vectorLin});
map.addLayer(vectorLayerpoint);


}

function initiator(){
lv =0;
sv=0;
linebear=[];
lb =0;
pd = [];
mind =0;
maxd = 0;
totald = 0;
dc =[];
vlc = [];
vlr =[];
midp=[];
totall =0;
linec=[];
sd =[];
lv = sidelength(calcords);
sv = mindist(calcords,homec);
lb = bearing(calcords);
midp = midpoint();
//console.log(midp);
perpendiculard();
netvertl()
console.log(pd);
//console.log(totald/100);
for(let i = 0 ;i < pd.length;i++)
  dc.push(pd[i]/sidedist);

dc.push(dc[0]);

//console.log(dc);
for(let i = 0 ;i < dc.length-1;i++)
  if(dc[i]>0 )
    if(dc[i+1]>0)
      if(dc[i]>dc[i+1])
        vlc.push(dc[i]-dc[i+1]);
      else
        vlc.push(dc[i+1]-dc[i]);
    else
      vlc.push(dc[i]-dc[i+1]);
  else
    if(dc[i+1]>0)
      vlc.push(dc[i+1]-dc[i]);
    else 
      if(dc[i+1]<dc[i])
        vlc.push(dc[i]-dc[i+1]);
      else
        vlc.push(dc[i+1]-dc[i]); 
//console.log(vlc);
linemarker()
//console.log(calcords);
//console.log(lv);
//console.log(pd);
console.log(vlr);
totall=Math.floor(totald/sidedist);
console.log(totall);
console.log(totald);
console.log(totald*Math.PI/180);
//console.log(sidedist);
//console.log(totald/100)

linecordgen();
//console.log(linec);
//maplines();
flb.push(lb);
//console.log(linec);
flc.push(linec);
if(dc[sv]>0)
var numb = parseInt(dc[sv]);
else
var numb= parseInt(-1*dc[sv]+maxd/sidedist);
if(numb>=vlr.length)
  numb = numb-1;
fsv.push(numb);
}

function maplines(){
/*  var hol =[]
if(vlr[sv][0]>=vlr[sv][1])
{
 // console.log("here");
  hol.push(ol.proj.transform(homec, 'EPSG:4326', 'EPSG:3857'));
 // console.log(Math.floor(vlr[sv][0])-1);
  if(Math.floor(vlr[sv][0])-1<0)
    hol.push(ol.proj.transform(linec[0][0], 'EPSG:4326', 'EPSG:3857'));
  else
  hol.push(ol.proj.transform(linec[Math.floor(vlr[sv][0])-1][0], 'EPSG:4326', 'EPSG:3857'));

}
else
{
 // console.log("also here");
  hol.push(ol.proj.transform(homec, 'EPSG:4326', 'EPSG:3857'));
//  console.log(Math.ceil(vlr[sv][0]));
  if(Math.ceil(vlr[sv][0])>linec.length)
      hol.push(ol.proj.transform(linec[linec.length][0], 'EPSG:4326', 'EPSG:3857'));
    else
  hol.push(ol.proj.transform(linec[Math.ceil(vlr[sv][0])][0], 'EPSG:4326', 'EPSG:3857'));
  
}


  featureLine = new ol.Feature({
    geometry: new ol.geom.LineString(hol)
});
//  console.log(hol);

 vectorLine = new ol.source.Vector({});
vectorLine.addFeature(featureLine);
 vectorLineLayer = new ol.layer.Vector({
    source: vectorLine,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
        stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 })
    })
});

map.addLayer(vectorLineLayer);*/
for(let i=0;i<linec.length;i++)
{
  var arr=[];
  for(let j=0;j<2;j++)
  {
    arr.push(ol.proj.transform(linec[i][j], 'EPSG:4326', 'EPSG:3857'));
  }
  featureLine = new ol.Feature({
    geometry: new ol.geom.LineString(arr)
});

 vectorLine = new ol.source.Vector({});
vectorLine.addFeature(featureLine);
 vectorLineLayer = new ol.layer.Vector({
    source: vectorLine,
    style: new ol.style.Style({
        fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
        stroke: new ol.style.Stroke({ color: '#00FF00', width: 2 })
    })
});

map.addLayer(vectorLineLayer);

}

}

function linecordgen()
{
var count =0;
for(let i=0;i<totall;i++){
    var arr1 = [];
    var c = 0;
for(let j=0; j<vlr.length;j++)
{
  var arr = [];
  if(vlr[j][0].length>1)
  {
    console.log("hereform");
    for(let k = 0;k<2;k++)
    {
        if(vlr[j][k][0]>vlr[j][k][1])
  {

    //console.log(j);
    if((i+1) <= vlr[j][k][0] && (i+1)>vlr[j][k][1])
    {
      var num = vlr[j][k][0]-(i+1);
      var den = vlc[j];
      var dist = num*sd[j]/den;
      arr = cordfdb(dist,j);
      if(c>1){
  //      console.log("C>2");
      c = 0;
      linec.push(arr1);
      arr1 =[];
      arr1.push(arr);
      c++;
    }
    else
    {
//      console.log(c);
      arr1.push(arr);
      c++;
    }
    }

  }
  else
  {
    //console.log(j);
    if((i+1)>vlr[j][k][0] && (i+1)<=vlr[j][k][1])
    {
      console.log("hereu")
      if(vlr[j][k][1]<= maxd/sidedist)
      {
        console.log("hereus");
        var num =(i+1)- vlr[j][k][0]-1*dc[j];
      var den = vlc[j];
      var dist = num*sd[j]/den;
      arr = cordfdb(dist,j);
      if(c>1){
      //  console.log("c>2");
      c = 0;
      linec.push(arr1);
      arr1 =[];
      arr1.push(arr);
      c++;
    }
    else
    {
    //  console.log(c);
      arr1.push(arr);
      c++;
    }
      }
      else{
      var num =(i+1)- vlr[j][k][0]+dc[j];
      var den = vlc[j];
      var dist = num*sd[j]/den;
      arr = cordfdb(dist,j);
      if(c>1){
      //  console.log("c>2");
      c = 0;
      linec.push(arr1);
      arr1 =[];
      arr1.push(arr);
      c++;
    }
    else
    {
    //  console.log(c);
      arr1.push(arr);
      c++;
    }

  }
    
    }

  }

    }
  }
  else
  {
  if(vlr[j][0]>vlr[j][1])
  {

    //console.log(j);
    if((i+1) <= vlr[j][0] && (i+1)>vlr[j][1])
    {
      var num = vlr[j][0]-(i+1);
      var den = vlc[j];
      var dist = num*sd[j]/den;
      arr = cordfdb(dist,j);
      if(c>1){
    //    console.log("C>2");
      c = 0;
      linec.push(arr1);
      arr1 =[];
      arr1.push(arr);
      c++;
    }
    else
    {
  //    console.log(c);
      arr1.push(arr);
      c++;
    }
    }

  }
  else
  {
    //console.log(j);
    if((i+1)>vlr[j][0] && (i+1)<=vlr[j][1])
    {
      var num =(i+1)- vlr[j][0];
      var den = vlc[j];
      var dist = num*sd[j]/den;
      arr = cordfdb(dist,j);
      if(c>1){
//        console.log("c>2");
      c = 0;
      linec.push(arr1);
      arr1 =[];
      arr1.push(arr);
      c++;
    }
    else
    {
//      console.log(c);
      arr1.push(arr);
      c++;
    }
    }

  }
}
}
linec.push(arr1);
}
}

function cordfdb(d,vert)
{
const R = 6371e3;
var brng = linebear[vert];
var φ1 = calcords[vert][1];
//console.log(φ1);
//console.log(d);
//console.log(brng);
var λ1 = calcords[vert][0];
const φ2 = Math.asin( Math.sin(φ1*Math.PI/180)*Math.cos(d/R)+Math.cos(φ1*Math.PI/180)*Math.sin(d/R)*Math.cos(brng*Math.PI/180) )*180/Math.PI;
const λ2 = λ1 + Math.atan2(Math.sin(brng*Math.PI/180)*Math.sin(d/R)*Math.cos(φ1*Math.PI/180),Math.cos(d/R)-Math.sin(φ1*Math.PI/180)*Math.sin(φ2*Math.PI/180))*180/Math.PI;
var arr =[];
arr.push(λ2);
arr.push(φ2);
//console.log(arr);
return arr;
}

function corddb(pcords,bearing,d){
const R = 6371e3;

var brng = bearing;
var φ1 = pcords[1];
//console.log(φ1);
//console.log(d);
//console.log(brng);
var λ1 = pcords[0];
const φ2 = Math.asin( Math.sin(φ1*Math.PI/180)*Math.cos(d/R)+Math.cos(φ1*Math.PI/180)*Math.sin(d/R)*Math.cos(brng*Math.PI/180) )*180/Math.PI;
const λ2 = λ1 + Math.atan2(Math.sin(brng*Math.PI/180)*Math.sin(d/R)*Math.cos(φ1*Math.PI/180),Math.cos(d/R)-Math.sin(φ1*Math.PI/180)*Math.sin(φ2*Math.PI/180))*180/Math.PI;
var arr =[];

arr.push(λ2);
arr.push(φ2);
//console.log(arr);
return arr;
}

function midpoint()
{
var  φ1 = calcords[lv][1];
var λ1 = calcords[lv][0];
var λ2 = calcords[lv+1][0];
var φ2 = calcords[lv+1][1];
var arr =[];
const Bx = Math.cos(φ2*Math.PI/180) * Math.cos((λ2-λ1)*Math.PI/180);
const By = Math.cos(φ2*Math.PI/180) * Math.sin((λ2-λ1)*Math.PI/180);
const φ3 = Math.atan2(Math.sin(φ1*Math.PI/180) + Math.sin(φ2*Math.PI/180),Math.sqrt( (Math.cos(φ1*Math.PI/180)+Bx)*(Math.cos(φ1*Math.PI/180)+Bx) + By*By ) )*180/Math.PI;
const λ3 = λ1 + Math.atan2(By, Math.cos(φ1*Math.PI/180) + Bx)*180/Math.PI;


arr.push(λ3);
arr.push(φ3);
return arr;
}

function linemarker()
{
for(let i=0;i<vlc.length;i++)
{
  var arr = [];
  if(dc[i+1]<0)
  {
    if(dc[i]<0)
      {if(dc[i]>dc[i+1])
        {
          arr.push(-1*dc[i+1]-vlc[i]+maxd/sidedist);
          arr.push(-1*dc[i+1]+maxd/sidedist);
        }

      else
      {
        arr.push(-1*dc[i]+maxd/sidedist);
        arr.push(-1*dc[i]-vlc[i]+maxd/sidedist);
      }}
      else if(dc[i]==0)
        {

          arr.push(maxd/sidedist);
          arr.push(-1*dc[i+1]+maxd/sidedist);
        }
      else
      {
        var arr1 =[];
        arr.push(dc[i]);
        arr.push(0);
        arr1.push(arr);
        arr =[];
        arr.push(maxd/sidedist)
        arr.push(-1*dc[i+1]+maxd/sidedist);
        arr1.push(arr);
        arr = arr1;
      }
}
  else if(dc[i+1]==0)
  {
    if(dc[i]<0)
    {

      arr.push(-1*dc[i]+maxd/sidedist);
      arr.push(maxd/sidedist);
    }
    else
      {arr.push(vlc[i]);
      arr.push(0);}
  }

  else
  {
    if(dc[i]<0)
    { var arr1 = [];
      arr.push(-1*dc[i]+maxd/sidedist);
    arr.push(maxd/sidedist);
    arr1.push(arr);
    arr = [];
    arr.push(0);
    arr.push(dc[i+1]);
    arr1.push(arr);
    arr=arr1;
  }
    else
    {
      if(dc[i+1]>dc[i])
      {
        arr.push(dc[i]);
        arr.push(dc[i]+vlc[i]);
      }
      else
      {
        arr.push(dc[i]);
        arr.push(dc[i]-vlc[i]);
      }
    }


  }
vlr.push(arr);

}}
function netvertl()
{
mind = pd[0];
maxd = pd[0];

for(let i =0;i<pd.length;i++)
{ //console.log(pd[i]);
  if(mind>pd[i])
    mind=pd[i];
  else if(maxd<pd[i])
    maxd = pd[i];
}
if(mind<=0 && maxd>=0)
  totald=maxd-mind;
else if(mind<=0 && maxd<=0)
  totald=-1*(mind);
else if(mind>=0 && maxd >=0)
  totald = maxd;
else if (mind>=0 && maxd<=0)
  totald = mind-maxd;

}

function perpendiculard(){

for(let i=0;i<lv;i++)
  {pd.push(distancecalc(calcords[i][0],calcords[i][1],calcords[lv][0],calcords[lv][1])*Math.sin((lb - bearingcalc(calcords[lv][0],calcords[lv][1],calcords[i][0],calcords[i][1]))*Math.PI/180));
  }
pd.push(0);
pd.push(0);

for(let i = lv+2;i<calcords.length-1;i++)
  pd.push(distancecalc(calcords[i][0],calcords[i][1],calcords[lv][0],calcords[lv][1])*Math.sin((lb - bearingcalc(calcords[lv][0],calcords[lv][1],calcords[i][0],calcords[i][1]))*Math.PI/180));

//console.log(pd);
}

function bearing(cords)
{
var i;
var lat1,lat2,lon1,lon2;
for(i=0;i<cords.length-1;i++)
{
lat1 = cords[i][0];
lon1 = cords[i][1];
lat2 = cords[i+1][0];
lon2 = cords[i+1][1];

linebear.push(bearingcalc(lat1,lon1,lat2,lon2)); // in degrees 

}
//console.log(linebear);
return linebear[lv];
}

function bearingcalc(lon1,lat1,lon2,lat2)
{

const y = Math.sin((lon2-lon1)*Math.PI/180) * Math.cos(lat2*Math.PI/180);

const x = Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180) -Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos((lon2-lon1)*Math.PI/180);
const θ = Math.atan2(y, x);
return (θ*180/Math.PI + 360) % 360;
}
function mindist(cords,homel)
{
var l = cords.length;
var i;
var min, vn;
min = distancecalc(cords[0][0],cords[0][1],homel[0],homel[1]);
vn = 0;
//console.log(l);
for(i=1;i<l-1;i++)
{
  let calcd = distancecalc(cords[i][0],cords[i][1],homel[0],homel[1]);
  if(calcd<0)
    calcd = -1*calcd;
    if(calcd<min)
    {
        min = calcd;
        vn = i; 
    }
}

//console.log(min);
//console.log(vn);
return vn;

}

function sidelength(cords){
//  console.log(cords);
var i,l;
var max = 0;
var vn = 0;
var calcd;
l = cords.length;
//console.log(l);
//console.log("transformed coords")
//console.log(ol.proj.transform([80.6350, 7.2964], 'EPSG:4326', 'EPSG:3857'));
//console.log("transformed back coords")
//console.log(ol.proj.transform([8976247.140115617, 814435.80921161],'EPSG:3857', 'EPSG:4326' ));
for(i=0;i<l-1;i++)
{  calcd = distancecalc(cords[i][0],cords[i][1],cords[i+1][0],cords[i+1][1]);
  sd.push(calcd);
    if(calcd > max)
      {max = calcd;
        vn = i;}
}
console.log(sd);
//console.log(max);
//console.log(vn);
return vn;
}


function distancecalc(lon1,lat1,lon2,lat2)
{

//console.log(lat1);
//console.log(lon1);
const R = 6371e3; // metres
var φ1 = lat1 *Math.PI/180; // φ, λ in radians
var φ2 = lat2 *Math.PI/180;
var Δφ = (lat2-lat1)*Math.PI/180 ;
var Δλ = (lon2-lon1)*Math.PI/180;
//console.log(φ1)

var a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)* Math.cos(φ2) *Math.sin(Δλ/2) * Math.sin(Δλ/2);
//console.log(a)
var c = 2 * Math.asin(Math.sqrt(a));
//console.log(c)
var d = R * c;
return d;
//console.log(d)
}
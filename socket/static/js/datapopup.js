
var socket;
var arr=[];

function createdatapopup(datasid)
{
let dat1,dat2;
var pop=open("/datapopup", "Popup2", "width=900,height=600");
//dat1=JSON.stringify(dataid);
pop.onload=()=>{
pop.dataid=datasid;

}
//dat2=JSON.stringify(datasid);
//sessionStorage.setItem('id1',dat1 )
//sessionStorage.setItem('id2',dat2 );
console.log(dat2);
}

function gotchecked(listname,listid)
{
	let dat1,dat2;
	dat1 = 	listid;
	//dat2 = sessionStorage.getItem('id2')
	//dat2 = sessionStorage.getItem('id2');
	//sessionStorage.clear();
	dat2 = dataid;
	console.log(dat2)
	arr.push(listname);
	dat1=dat1.replaceAll('"', '');
	dat2=dat2.replaceAll('"', '');
	arr.push(dat1);
	arr.push(dat2);
	socket.emit("popup",{data:arr});
	arr=[];
	window.close();
}

$(document).ready(function(){
    //connect to the socket server.
    socket = io.connect('http://' + document.domain + ':' + location.port + '/test');

});

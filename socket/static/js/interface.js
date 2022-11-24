                        var deg2rad = Math.PI / 180;
                        var rad2deg = 180 / Math.PI;

                        var src = "#";

                        isarmed = "";
                        var pitch = 0;
                        var roll = 0;
                        var yaw = 0;
                        var lineda;

                        var airspeed = "0.0";
                        var groundspeed = "0.0";
                        var distance = "0.0";
                        var altitude = "0.00";
                        var fmode = "Unknown"
                        var vibx = 0;
                        var viby = 0;
                        var vibz = 0;

                        var esrvv = 0;
                        var esrphv = 0;
                        var esrcv = 0;
                        var esrpvv = 0;
                        var esrtav = 0;
                        var esrav = 0;

                        var vibr = "";
                        var ekf = "";

                        var failmes = []
                        var failm = "";
                        var fails = "";
                        var failc = 0

                        var db1 = "ay";
                        var db2 = "ar";
                        var db3 = "ap";
                        var db4 = "gpsialt";
                        var db5 = "mcowpd";
                        var db6 = "ays";

                        var gpslat = 0;
                        var gpslon = 0;

                        var jsoncount = 0;
                        var markers = [];
                        var wpmarkers = [];
                        var flightPath;
                        var pathHistoryPoly;
                        var pathHistory = [];
                        var socket;
                        var socket2;

                        var line1item = "cs.altasl";
                        var line2item = "cs.ter_alt";

                        var img = document.getElementById("images");

                        function assigndiv(sname, num) {
                            if (db1 == sname)
                                document.getElementById("pdb1").innerHTML = num;
                            else if (db2 == sname)
                                document.getElementById("pdb2").innerHTML = num;
                            else if (db3 == sname)
                                document.getElementById("pdb3").innerHTML = num;
                            else if (db4 == sname)
                                document.getElementById("pdb4").innerHTML = num;
                            else if (db5 == sname)
                                document.getElementById("pdb5").innerHTML = num;
                            else if (db6 == sname)
                                document.getElementById("pdb6").innerHTML = num;
                        }

                        function graphitem(item) {
                            line1item = "cs." + item;
                        }

                        function init() {
                            setInterval(function() {

                                img.src = src;
                            }, 1);

                            setInterval(function() {

                                if (failc < failmes.length) {
                                    failm = failmes[failc];
                                    failc++;
                                } else
                                    failc = 0

                            }, 5000);

                            var smoothie = new SmoothieChart();

                            smoothie.streamTo(document.getElementById("graphcanvas"), 250);

                            // Data
                            var line1 = new TimeSeries();
                            var line2 = new TimeSeries();

                            // Add to SmoothieChart
                            smoothie.addTimeSeries(line1);
                            smoothie.addTimeSeries(line2);
                            if (window["WebSocket"]) {
                                var host = "http://" + window.location.hostname + ":5000/test";
                                if (window.location.hostname == "")
                                    host = "http://localhost:5000/test";
                                try {
                                    socket2 = io.connect('http://192.168.0.124:5005/video');
                                    socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
                                    socket2.emit("helloo", { data: "23" });
                                    socket.on('ar', function(msg) {
                                        sname = 'ar';
                                        let num = parseFloat(msg.message);
                                        num = num * 180 / Math.PI;
                                        roll = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ap', function(msg) {
                                        sname = 'ap';
                                        let num = parseFloat(msg.message);
                                        num = num * 180 / Math.PI;
                                        pitch = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on("armstatus", function(msg) {
                                        isarmed = msg.message;
                                    })
                                    socket.on('ay', function(msg) {
                                        sname = 'ay';
                                        let num = parseFloat(msg.message);
                                        num = num * 180 / Math.PI;
                                        yaw = num;
                                        if (num < 0)
                                            num = (num + 360.00);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                        /*if (yaw < 0)
                                            document.getElementById("yaw").innerHTML = (yaw + 360.00).toFixed(2)
                                        else
                                            document.getElementById("yaw").innerHTML = yaw.toFixed(2);*/
                                    });
                                    socket.on('ars', function(msg) {
                                        sname = 'ars';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('aps', function(msg) {
                                        sname = 'aps';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ays', function(msg) {
                                        sname = 'ays';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('gpsi', function(msg) {
                                        sname = 'gpsi';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('mode', function(msg) {
                                        let num = msg.message;
                                        fmode = num;
                                    })
                                    socket.on('gpsitb', function(msg) {
                                        sname = 'gpstb';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('gpsilon', function(msg) {
                                        sname = 'gpsilon';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        gpslon = num / 10000000.00;
                                        getPosition();
                                        assigndiv(sname, num);

                                    });
                                    socket.on('linedata',function(msg){
                                        console.log("HEREHEHEHREHE")
                                        console.log(msg.message);
                                        lineda=msg.message;
                                        displaylines();
                                    })
                                    socket.on('gpsihdg', function(msg) {
                                        sname = 'gpsihdg';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('gpsivz', function(msg) {
                                        sname = 'gpsivz';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('gpsivy', function(msg) {
                                        sname = 'gpsivy';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('gpsivx', function(msg) {
                                        sname = 'gpsivx'
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });

                                    socket.on('gpsiralt', function(msg) {
                                        sname = 'gpsiralt';
                                        let num = parseFloat(msg.message);
                                        num = num / 1000.00;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('gpsialt', function(msg) {
                                        sname = 'gpsialt';
                                        let num = parseFloat(msg.message);
                                        num = num / 1000.00;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                        altitude = num;
                                    });
                                    socket.on('gpsilat', function(msg) {
                                        sname = 'gpsilat';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        gpslat = num / 10000000.00;
                                        assigndiv(sname, num);
                                        getPosition();
                                    });
                                    socket.on('sys', function(msg) {
                                        sname = 'sys';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysocse', function(msg) {
                                        sname = 'sysocse';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });

                                    socket.on('sysocsp', function(msg) {
                                        sname - 'sysocsp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysocsh', function(msg) {
                                        sname = 'sysocsh';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('syscb', function(msg) {
                                        sname = 'syscsb';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysvb', function(msg) {
                                        sname = 'sysvb';
                                        let num = parseFloat(msg.message);
                                        num = num / 1000.00;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysbr', function(msg) {
                                        sname = 'sysbr';
                                        let num = parseFloat(msg.message);
                                        num = num / 1000.00;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysdrc', function(msg) {
                                        sname = 'sysdrc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysecomm', function(msg) {
                                        sname = 'sysecomm';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysecount', function(msg) {
                                        sname = 'sysecount';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sysload', function(msg) {
                                        sname = 'sysload';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ps', function(msg) {
                                        sname = 'ps'
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('psvs', function(msg) {
                                        sname = 'psvs';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('psflags', function(msg) {
                                        sname = 'psflags';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('psvcc', function(msg) {
                                        sname = 'psvcc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('mi', function(msg) {
                                        sname = 'mi';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('mifm32', function(msg) {
                                        sname = 'mifm32';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('mifm', function(msg) {
                                        sname = 'mifm';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('mibv', function(msg) {
                                        sname = 'mibv';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('nco', function(msg) {
                                        sname = 'nco';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('nconr', function(msg) {
                                        sname = 'nconr';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mconb', function(msg) {
                                        sname = 'mconb';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mcotb', function(msg) {
                                        sname = 'mcotb';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mcowpd', function(msg) {
                                        sname = 'mcowpd';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                        distance = (num / 1000).toFixed(2);
                                    });
                                    socket.on('mcoalte', function(msg) {
                                        sname = 'mcoalte';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mcoaspde', function(msg) {
                                        sname = 'mcoaspde';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mcoxte', function(msg) {
                                        sname = 'mcoxte';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mconp', function(msg) {
                                        sname = 'mconp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('mcseq', function(msg) {
                                        sname = 'mcseq';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket2.on('sendimage', function(data) {

                                        src = "data:image/jpeg;base64, " + data.message;
                                    });
                                    socket.on('tstc1', function(msg) {
                                        sname = 'tstc1';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('tsts1', function(msg) {
                                        sname = 'tsts1';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sortu', function(msg) {
                                        sname = 'sortu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sorport', function(msg) {
                                        sname = 'sorport';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors1r', function(msg) {
                                        sname = 'sors1r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors2r', function(msg) {
                                        sname = 'sors2r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors3r', function(msg) {
                                        sname = 'sors3r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors4r', function(msg) {
                                        sname = 'sors4r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors5r', function(msg) {
                                        sname = 'sors5r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors6r', function(msg) {
                                        sname = 'sors6r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors7r', function(msg) {
                                        sname = 'sors7r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors8r', function(msg) {
                                        sname = 'sors8r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors9r', function(msg) {
                                        sname = 'sors9r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors10r', function(msg) {
                                        sname = 'sors10r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors11r', function(msg) {
                                        sname = 'sors11r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors12r', function(msg) {
                                        sname = 'sors12r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors13r', function(msg) {
                                        sname = 'sors13r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors14r', function(msg) {
                                        sname = 'sors14r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors15r', function(msg) {
                                        sname = 'sors15r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sors16r', function(msg) {
                                        sname = 'sors16r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rctbms', function(msg) {
                                        sname = 'rctbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rccc', function(msg) {
                                        sname = 'rccc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc1r', function(msg) {
                                        sname = 'rcc1r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc2r', function(msg) {
                                        sname = 'rcc2r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc3r', function(msg) {
                                        sname = 'rcc3r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc4r', function(msg) {
                                        sname = 'rcc4r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc5r', function(msg) {
                                        sname = 'rcc5r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc6r', function(msg) {
                                        sname = 'rcc6r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc7r', function(msg) {
                                        sname = 'rcc7r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc8r', function(msg) {
                                        sname = 'rcc8r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc9r', function(msg) {
                                        sname = 'rcc9r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc10r', function(msg) {
                                        sname = 'rcc10r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc11r', function(msg) {
                                        sname = 'rcc11r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc12r', function(msg) {
                                        sname = 'rcc12r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc13r', function(msg) {
                                        sname = 'rcc13r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc14r', function(msg) {
                                        sname = 'rcc14r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc15r', function(msg) {
                                        sname = 'rcc15r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc16r', function(msg) {
                                        sname = 'rcc16r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc17r', function(msg) {
                                        sname = 'rcc17r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcc18r', function(msg) {
                                        sname = 'rcc18r';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rcrssi', function(msg) {
                                        sname = 'rcrssi';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ritu', function(msg) {
                                        sname = 'ritu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rixacc', function(msg) {
                                        sname = 'rixacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('riyacc', function(msg) {
                                        sname = 'riyacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('rizacc', function(msg) {
                                        sname = 'rizacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('rixgyro', function(msg) {
                                        sname = 'rizgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('riygyro', function(msg) {
                                        sname = 'riygyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rizgyro', function(msg) {
                                        sname = 'rizgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rixmag', function(msg) {
                                        sname = 'rixmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('riymag', function(msg) {
                                        sname = 'riymag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('rizmag', function(msg) {
                                        sname = 'rizmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('riid', function(msg) {
                                        sname = 'riid';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ritemp', function(msg) {
                                        sname = 'ritemp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2xacc', function(msg) {
                                        sname = 'si2xacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2yacc', function(msg) {
                                        sname = 'si2yacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2zacc', function(msg) {
                                        sname = 'si2zacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si2xgyro', function(msg) {
                                        sname = 'si2xgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2ygyro', function(msg) {
                                        sname = 'si2ygyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2zgyro', function(msg) {
                                        sname = 'si2zgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2xmag', function(msg) {
                                        sname = 'si2xmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si2ymag', function(msg) {
                                        sname = 'si2ymag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si2zmag', function(msg) {
                                        sname = 'si2zmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si2tbms', function(msg) {
                                        sname = 'si2tbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si2temp', function(msg) {
                                        sname = 'si2temp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si3xacc', function(msg) {
                                        sname = 'si3xacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3yacc', function(msg) {
                                        sname = 'si3yacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3zacc', function(msg) {
                                        sname = 'si3zacc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si3xgyro', function(msg) {
                                        sname = 'si3xgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3ygyro', function(msg) {
                                        sname = 'si3ygyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3zgyro', function(msg) {
                                        sname = 'si3zgyro';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3xmag', function(msg) {
                                        sname = 'si3xmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si3ymag', function(msg) {
                                        sname = 'si3ymag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si3zmag', function(msg) {
                                        sname = 'si3zmag';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('si3tbms', function(msg) {
                                        sname = 'si3tbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('si3temp', function(msg) {
                                        sname = 'si3temp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sptbms', function(msg) {
                                        sname = 'sptbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sppabs', function(msg) {
                                        sname = 'sppabs';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sppdiff', function(msg) {
                                        sname = 'sppdiff';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sptemp', function(msg) {
                                        sname = 'sptemp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sptpdiff', function(msg) {
                                        sname = "sptpdiff";
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sp2tbms', function(msg) {
                                        sname = 'sp2tbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sp2pabs', function(msg) {
                                        sname = 'sp2pabs';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sp2pdiff', function(msg) {
                                        sname = 'sp2pdiff';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sp2temp', function(msg) {
                                        sname = 'sp2temp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sp2tpdiff', function(msg) {
                                        sname = 'sp2tpdiff';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('gritu', function(msg) {
                                        sname = 'gritu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grift', function(msg) {
                                        sname = 'grift';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grilat', function(msg) {
                                        sname = 'grilat';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grilon', function(msg) {
                                        sname = 'grilon';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grialt', function(msg) {
                                        sname = 'grialt';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('grieph', function(msg) {
                                        sname = 'grieph';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('griepv', function(msg) {
                                        sname = 'griepv';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grivel', function(msg) {
                                        sname = 'grivel';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('gricog', function(msg) {
                                        sname = 'gricog';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('grisatv', function(msg) {
                                        sname = 'grisatv';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('griae', function(msg) {
                                        sname = 'griae';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grihac', function(msg) {
                                        sname = 'grihac';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grivac', function(msg) {
                                        sname = 'grivac';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('grivela', function(msg) {
                                        sname = 'grivela';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('grihdga', function(msg) {
                                        sname = 'grihdga';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('griyaw', function(msg) {
                                        sname = 'griyaw';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('sttu', function(msg) {
                                        sname = 'sttu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('sttbms', function(msg) {
                                        sname = 'sttbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsoix', function(msg) {
                                        sname = 'ahrsoix';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsoiy', function(msg) {
                                        sname = 'ahrsoiy';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsoiz', function(msg) {
                                        sname = 'ahrsoiz';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsaw', function(msg) {
                                        sname = 'ahrsaw';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsrv', function(msg) {
                                        sname = 'ahrsrv';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrser', function(msg) {
                                        sname = 'ahrser';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ahrsey', function(msg) {
                                        sname = 'ahrsey';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('hsvc', function(msg) {
                                        sname = 'hsvc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('hsie', function(msg) {
                                        sname = 'hsie';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('windd', function(msg) {
                                        sname = 'windd';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('winds', function(msg) {
                                        sname = 'winds';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('windsz', function(msg) {
                                        sname = 'windsz';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('trlat', function(msg) {
                                        sname = 'trlat';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('trlon', function(msg) {
                                        sname = 'trlon';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('trs', function(msg) {
                                        sname = 'trs';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('trth', function(msg) {
                                        sname = 'trth';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('trch', function(msg) {
                                        sname = 'trtch';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('trp', function(msg) {
                                        sname = 'trp';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('trl', function(msg) {
                                        sname = 'trl';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('esrf', function(msg) {
                                        sname = 'esrf';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('esrvv', function(msg) {
                                        sname = 'esrvv';
                                        let num = parseFloat(msg.message);
                                        esrvv = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('esrphv', function(msg) {
                                        sname = 'esrphv';
                                        let num = parseFloat(msg.message);
                                        esrphv = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('esrcv', function(msg) {
                                        sname = 'esrcv';
                                        let num = parseFloat(msg.message);
                                        esrcv = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('esrpvv', function(msg) {
                                        sname = 'esrpvv';
                                        let num = parseFloat(msg.message);
                                        esrppv = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('esrtav', function(msg) {
                                        sname = 'esrtav';
                                        let num = parseFloat(msg.message);
                                        esrtav = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('esrav', function(msg) {
                                        sname = 'esrav';
                                        let num = parseFloat(msg.message);
                                        esrav = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrtu', function(msg) {
                                        sname = 'vibrtu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrvx', function(msg) {
                                        sname = 'vibrvx';
                                        let num = parseFloat(msg.message);
                                        vibx = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrvy', function(msg) {
                                        sname = 'vibrvy';
                                        let num = parseFloat(msg.message);
                                        viby = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrvz', function(msg) {
                                        sname = 'vibrvz';
                                        let num = parseFloat(msg.message);
                                        vibz = num;
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrc0', function(msg) {
                                        sname = 'vibrc0';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrc1', function(msg) {
                                        sname = 'vibrc1';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vibrc2', function(msg) {
                                        sname = 'vibrc2';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgitbms', function(msg) {
                                        sname = 'ptgitbms';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgicf', function(msg) {
                                        sname = 'ptgicf';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgitm', function(msg) {
                                        sname = 'ptgitm';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgilati', function(msg) {
                                        sname = 'ptgilati';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgiloni', function(msg) {
                                        sname = 'ptgiloni';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ptgialt', function(msg) {
                                        sname = 'ptgialt';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ptgivx', function(msg) {
                                        sname = 'ptgivx';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgivy', function(msg) {
                                        sname = 'ptgivy';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ptgivz', function(msg) {
                                        sname = 'ptgivz';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ptgiafx', function(msg) {
                                        sname = 'ptgiafx';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgiafy', function(msg) {
                                        sname = 'ptgiafy';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgiafz', function(msg) {
                                        sname = 'ptgiafz';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('ptgiy', function(msg) {
                                        sname = 'ptgiy';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('ptgiyr', function(msg) {
                                        sname = 'ptgiyr';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('vfrhas', function(msg) {
                                        sname = 'vfrhas';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                        airspeed = num;
                                    });
                                    socket.on('vfrhgs', function(msg) {
                                        sname = 'vfrhgs';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                        groundspeed = num;
                                    });
                                    socket.on('vfrhh', function(msg) {
                                        sname = 'vfrhh';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('vfrht', function(msg) {
                                        sname = 'vfrht';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vfrhalt', function(msg) {
                                        sname = 'vfrhalt';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('vfrhc', function(msg) {
                                        sname = 'vfrhc';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('failsafe', function(msg) {
                                        fails = msg.message;
                                    });
                                    socket.on('failm', function(msg) {
                                        failmes = msg.message;
                                        //console.log(msg.message.length);
                                    });
                                    socket.on('aoastu', function(msg) {
                                        sname = 'aoastu';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);

                                    });
                                    socket.on('aoasaoa', function(msg) {
                                        sname = 'aoasaoa';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });
                                    socket.on('aoasssa', function(msg) {
                                        sname = 'aoasssa';
                                        let num = parseFloat(msg.message);
                                        num = num.toFixed(2);
                                        assigndiv(sname, num);
                                    });

                                    socket.on('change_var', function(msg) {
                                        let cn = msg.message[2];
                                        let vname = msg.message[0];
                                        let cname = msg.message[1];
                                        document.getElementById(cn).innerHTML = vname;
                                        if (cn == "sdb1")
                                            db1 = cname;
                                        else if (cn == "sdb2")
                                            db2 = cname;
                                        else if (cn == "sdb3")
                                            db3 = cname;
                                        else if (cn == "sdb4")
                                            db4 = cname;
                                        else if (cn == "sdb5")
                                            db5 = cname;
                                        else if (cn == "sdb6")
                                            db6 = cname;

                                    });



                                    window.onbeforeunload = function() {
                                        socket.close();
                                        socket2.close();
                                    }

                                    // log('WebSocket - status '+socket.readyState);
                                    socket.onopen = function(msg) {
                                        document.getElementById("serverStatus").innerHTML = "onopen";
                                        jsoncount = 0;
                                    };
                                    socket.onmessage = function(msg) {
                                        jsoncount++;

                                        var data = JSON.parse(msg.data);

                                        if (data.hasOwnProperty('FrameString')) {
                                            MAV = data;
                                        } else if (data.hasOwnProperty('rateattitude')) {
                                            cs = data;

                                            var status = "<ul style='columns: 3;'>";

                                            a = 1;

                                            var sortable = [];
                                            for (i in cs) {
                                                sortable.push(i);
                                            }

                                            sortable.sort(function(a, b) {
                                                return a.toLowerCase().localeCompare(b.toLowerCase());
                                            });

                                            for (i in sortable) {
                                                var name = sortable[i];
                                                var data = cs[sortable[i]];

                                                if (typeof data != 'object')
                                                    status += "<li style='overflow:hidden; white-space: nowrap;'><b onclick=graphitem('" + name + "')>" + name + ":</b><br> " + data + "</li>";

                                                //if(a%3==0)
                                                //status += "<br>";

                                                a++;
                                            }

                                            status += "</ul>";

                                            document.getElementById("serverStatus").innerHTML = status;

                                            // map.setCenter({lat: cs.lat, lng: cs.lng});

                                            if (jsoncount < 5) {
                                                map.setZoom(18);
                                            }

                                            roll = cs.roll;
                                            pitch = cs.pitch;
                                            yaw = cs.yaw;

                                            lat = cs.lat;
                                            lng = cs.lng;
                                            alt = cs.alt;

                                            try {

                                                var myLatLng = { lat: lat, lng: lng };

                                                if (markers.length > 0) {
                                                    markers[0].setPosition(myLatLng);
                                                } else {
                                                    var marker = new google.maps.Marker({
                                                        position: myLatLng,
                                                        map: map,
                                                        title: 'ArduPilot'
                                                    });

                                                    markers.push(marker);
                                                }

                                                map.setOptions({ maxZoom: 21 });

                                                //socket.send("test "+pitch+"\n");
                                            } catch (ex) {} // alert(ex); }

                                            line1.append(new Date().getTime(), eval(line1item));
                                            line2.append(new Date().getTime(), eval(line2item));

                                            addData();

                                            pathHistory.push({ lat: lat, lng: lng });

                                            pathHistory = pathHistory.slice(-200, 200);

                                            if (pathHistoryPoly == null) {
                                                pathHistoryPoly = new google.maps.Polyline({
                                                    path: pathHistory,
                                                    geodesic: true,
                                                    strokeColor: '#191970',
                                                    strokeOpacity: 0.56,
                                                    strokeWeight: 4
                                                });

                                                pathHistoryPoly.setMap(map);
                                            } else {
                                                pathHistoryPoly.setPath(pathHistory);
                                            }
                                        } else if (data[0].hasOwnProperty('mission_type')) {
                                            wps = data;

                                            var wpscoords = [];
                                            for (i in wps) {
                                                if (wps[i].x != 0 && wps[i].y != 0) {
                                                    wpscoords.push({ lat: wps[i].x, lng: wps[i].y, alt: wps[i].z, frame: wps[i].frame, label: wps[i].seq });
                                                }
                                            }

                                            if (wpmarkers.length == wpscoords.length) {
                                                i = 0;
                                                wpmarkers.forEach(function(element) {
                                                    element.setPosition(wpscoords[i]);
                                                    i++;
                                                });
                                            } else {
                                                wpmarkers.forEach(function(element) { element.setMap(null) });
                                                wpmarkers = [];
                                                // Create markers.
                                                wpscoords.forEach(function(feature) {
                                                    var marker = new google.maps.Marker({
                                                        position: feature,
                                                        icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png',
                                                        map: map,
                                                        label: (feature.label == 0) ? "Home" : feature.label + "",
                                                        draggable: true,
                                                        title: (feature.label == 0) ? "Home" : feature.label + ""
                                                    });
                                                    wpmarkers.push(marker);

                                                    google.maps.event.addListener(marker, 'dragend', function(event) {
                                                        document.getElementById("latbox").value = event.latLng.lat();
                                                        document.getElementById("lngbox").value = event.latLng.lng();
                                                    });
                                                });
                                            }

                                            var pnts = [];
                                            wpscoords.forEach(function(feature) {
                                                pnts.push(feature.lng);
                                                pnts.push(feature.lat);
                                                pnts.push(feature.alt + cs.HomeAlt);
                                            });

                                            if (typeof viewer !== 'undefined') {
                                                var orangeOutlined = viewer.entities.add({
                                                    name: 'Orange line with black outline at height and following the surface',
                                                    polyline: {
                                                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pnts),
                                                        width: 4,
                                                        material: new Cesium.PolylineOutlineMaterialProperty({
                                                            color: Cesium.Color.ORANGE,
                                                            outlineWidth: 2,
                                                            outlineColor: Cesium.Color.BLACK
                                                        })
                                                    }
                                                });

                                                //orangeOutlined.position = Cesium.Cartesian3.fromDegrees(lng, lat);

                                                //viewer.trackedEntity = orangeOutlined;
                                            }

                                            if (flightPath == null) {
                                                flightPath = new google.maps.Polyline({
                                                    path: wpscoords,
                                                    geodesic: true,
                                                    strokeColor: '#FFFF00',
                                                    strokeOpacity: 1.0,
                                                    strokeWeight: 4
                                                });

                                                flightPath.setMap(map);
                                            } else {
                                                flightPath.setPath(wpscoords);
                                            }

                                        } else { return; }

                                    };
                                    socket.onerror = function(msg) { document.getElementById("serverStatus").innerHTML = "Error: " + msg.data; };
                                    socket.onclose = function(msg) {
                                        document.getElementById("serverStatus").innerHTML = "Disconnected - status " + this.readyState;
                                        setTimeout("init()", 1000);
                                    };
                                } catch (ex) {
                                    if (window.console) console.log(ex);
                                    //document.getElementById("serverStatus").innerHTML = ex;
                                }
                            } else {
                                document.getElementById("serverStatus").innerHTML = "This browser doesnt support websockets";
                            }

                            draw();

                        }
                        const armDisarm = document.querySelector('#arm-disarm');
                        armDisarm.addEventListener('click', () => {
                            armDisarm.textContent = "arm";
                            socket.emit("armdisarm", { data: 0 });
                            armDisarm.addEventListener('dblclick', () => {
                                armDisarm.textContent = "disarm";
                                socket.emit("armdisarm", { data: 1 });
                            })
                        })

                        function sendc() {
                            socket.emit("scommand", { data: $("#drop").val() });
                        }


                        function draw() {

                            setTimeout("draw()", 250);

                            // pitch += 1.2;
                            // roll += .75;

                            // if (pitch < -90)
                            // pitch = 90;
                            // if (roll > 180)
                            // roll = -180;

                            var canvas = document.getElementById("canvas");
                            if (canvas.getContext) {
                                var ctx = canvas.getContext("2d");

                                ctx.save();

                                ctx.translate(canvas.width / 2, canvas.height / 2);

                                ctx.rotate(-roll * deg2rad);

                                var font = "Arial";
                                var fontsize = canvas.height / 30;
                                var fontoffset = fontsize - 10;

                                var halfwidth = canvas.width / 2;
                                var halfheight = canvas.height / 2;

                                var every5deg = -canvas.height / 60;

                                var pitchoffset = -pitch * every5deg;

                                var x = Math.sin(-roll * deg2rad);
                                var y = Math.cos(-roll * deg2rad);

                                gradObj = ctx.createLinearGradient(0, -halfheight * 2, 0, halfheight * 2);
                                gradObj.addColorStop(0.0, "Blue");
                                var offset = 0.5 + pitchoffset / canvas.height / 2;
                                if (offset < 0) {
                                    offset = 0;
                                }
                                if (offset > 1) {
                                    offset = 1;
                                }
                                gradObj.addColorStop(offset, "LightBlue");
                                gradObj.addColorStop(offset, "#9bb824");
                                gradObj.addColorStop(1.0, "#414f07");

                                ctx.fillStyle = gradObj;
                                ctx.rect(-halfwidth * 2, -halfheight * 2, halfwidth * 4, halfheight * 4);
                                ctx.fill();

                                var lengthshort = canvas.width / 12;
                                var lengthlong = canvas.width / 8;

                                for (var a = -90; a <= 90; a += 5) {
                                    // limit to 40 degrees
                                    if (a >= pitch - 34 && a <= pitch + 25) {
                                        if (a % 10 == 0) {
                                            if (a == 0) {
                                                DrawLine(ctx, "White", 4, canvas.width / 2 - lengthlong - halfwidth, pitchoffset + a * every5deg, canvas.width / 2 + lengthlong - halfwidth, pitchoffset + a * every5deg);
                                            } else {
                                                DrawLine(ctx, "White", 4, canvas.width / 2 - lengthlong - halfwidth, pitchoffset + a * every5deg, canvas.width / 2 + lengthlong - halfwidth, pitchoffset + a * every5deg);
                                            }
                                            drawstring(ctx, a, font, fontsize + 2, "White", canvas.width / 2 - lengthlong - 30 - halfwidth - (fontoffset * 1.7), pitchoffset + a * every5deg - 8 - fontoffset);
                                        } else {
                                            DrawLine(ctx, "White", 4, canvas.width / 2 - lengthshort - halfwidth, pitchoffset + a * every5deg, canvas.width / 2 + lengthshort - halfwidth, pitchoffset + a * every5deg);
                                        }
                                    }
                                }

                                lengthlong = canvas.height / 66;

                                var extra = canvas.height / 15 * 4.9;

                                var lengthlongex = lengthlong + 2;

                                var pointlist = new Array();
                                pointlist[0] = 0;
                                pointlist[1] = -lengthlongex * 2 - extra;
                                pointlist[2] = -lengthlongex;
                                pointlist[3] = -lengthlongex - extra;
                                pointlist[4] = lengthlongex;
                                pointlist[5] = -lengthlongex - extra;

                                DrawPolygon(ctx, "RED", 4, pointlist)

                                for (var a = -60; a <= 60; a += 15) {
                                    ctx.restore();
                                    ctx.save();
                                    ctx.translate(canvas.width / 2, canvas.height / 2);
                                    ctx.rotate(a * deg2rad);
                                    drawstring(ctx, a.toString(), font, fontsize, "White", 0 - 6 - fontoffset, -lengthlong * 8 - extra + 10);
                                    DrawLine(ctx, "White", 4, 0, -lengthlong * 3 - extra, 0, -lengthlong * 3 - extra - lengthlong);

                                }

                                ctx.restore();
                                ctx.save();

                                DrawEllipse(ctx, "red", 4, halfwidth - 10, halfheight - 10, 20, 20);
                                DrawLine(ctx, "red", 4, halfwidth - 10 - 10, halfheight, halfwidth - 10, halfheight);
                                DrawLine(ctx, "red", 4, halfwidth - 10 + 20, halfheight, halfwidth - 10 + 20 + 10, halfheight);
                                DrawLine(ctx, "red", 4, halfwidth - 10 + 20 / 2, halfheight - 10, halfwidth - 10 + 20 / 2, halfheight - 10 - 10);

                                ///////////////////////

                                var headbg = { Left: 0, Top: 0, Width: canvas.width - 0, Height: canvas.height / 14, Bottom: canvas.height / 14, Right: canvas.width - 0 };

                                _targetheading = yaw;
                                _heading = yaw;
                                _groundcourse = yaw;

                                DrawRectangle(ctx, "black", headbg);

                                //FillRectangle(ctx,"", headbg);

                                //bottom line
                                DrawLine(ctx, "white", 2, headbg.Left + 5, headbg.Bottom - 5, headbg.Width - 5,
                                    headbg.Bottom - 5);

                                var space = (headbg.Width - 10) / 120.0;
                                var start = Math.round((_heading - 60), 1);

                                // draw for outside the 60 deg
                                if (_targetheading < start) {

                                    DrawLine(ctx, "green", 2, headbg.Left + 5 + space * 0, headbg.Bottom,
                                        headbg.Left + 5 + space * (0), headbg.Top);
                                }
                                if (_targetheading > _heading + 60) {

                                    DrawLine(ctx, "green", 2, headbg.Left + 5 + space * 60, headbg.Bottom,
                                        headbg.Left + 5 + space * (60), headbg.Top);
                                }

                                for (var a = start; a <= _heading + 60; a += 1) {
                                    // target heading
                                    if (((a + 360) % 360) == Math.round(_targetheading)) {

                                        DrawLine(ctx, "green", 2, headbg.Left + 5 + space * (a - start),
                                            headbg.Bottom, headbg.Left + 5 + space * (a - start), headbg.Top);
                                    }

                                    if (((a + 360) % 360) == Math.round(_groundcourse)) {

                                        DrawLine(ctx, "black", 2, headbg.Left + 5 + space * (a - start),
                                            headbg.Bottom, headbg.Left + 5 + space * (a - start), headbg.Top);

                                    }

                                    if (a % 15 == 0) {
                                        //Console.WriteLine(a + " " + Math.Round(a, 1, MidpointRounding.AwayFromZero));
                                        //Console.WriteLine(space +" " + a +" "+ (headbg.Left + 5 + space * (a - start)));
                                        DrawLine(ctx, "white", 2, headbg.Left + 5 + space * (a - start),
                                            headbg.Bottom - 5, headbg.Left + 5 + space * (a - start), headbg.Bottom - 10);
                                        var disp = a;
                                        if (disp < 0)
                                            disp += 360;
                                        disp = disp % 360;
                                        if (disp == 0) {
                                            drawstring(ctx, "N", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 45) {
                                            drawstring(ctx, "NE", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 90) {
                                            drawstring(ctx, "E", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 135) {
                                            drawstring(ctx, "SE", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 180) {
                                            drawstring(ctx, "S", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 225) {
                                            drawstring(ctx, "SW", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 270) {
                                            drawstring(ctx, "W", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else if (disp == 315) {
                                            drawstring(ctx, "NW", font, fontsize + 4, "white",
                                                headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        } else {
                                            drawstring(ctx, Math.round(disp % 360, 0), font, fontsize,
                                                "white", headbg.Left - 5 + space * (a - start) - fontoffset,
                                                headbg.Bottom - 24 - (fontoffset * 1.7));
                                        }
                                    } else if (a % 5 == 0) {
                                        DrawLine(ctx, "white", 2, headbg.Left + 5 + space * (a - start),
                                            headbg.Bottom - 5, headbg.Left + 5 + space * (a - start), headbg.Bottom - 10);
                                    }
                                }



                                ctx.font = "15px sans-serif";
                                ctx.fillStyle = "white";
                                ctx.fillText(`AS:${airspeed}m/s`, 10, 220);
                                ctx.fillText(`GS:${groundspeed}m/s`, 10, 240);
                                ctx.fillText(`Alt:${altitude}m`, 330, 150);
                                ctx.fillStyle = "red";
                                ctx.fillText(`${fmode}`, 305, 220);
                                ctx.fillText(`Dist_to_wp`, 305, 240);
                                ctx.fillStyle = "white";
                                ctx.fillText(`${distance}`, 330, 260);
                                ctx.fillStyle = "red";
                                ctx.fillText(`${fails}`, 150, 130)
                                ctx.fillText(`${failm}`, 120, 200)
                                if (vibx > 20 || viby > 20 || vibz > 20)
                                    vibr = "VIB";
                                else
                                    vibr = "";
                                if (esrav > 0.5 || esrcv > 0.5 || esrphv > 0.5 || esrpvv > 0.5 || esrtav > 0.5 || esrvv > 0.5)
                                    ekf = "EKF";
                                else
                                    ekf = "";
                                ctx.fillStyle = "red";
                                ctx.fillText(`${vibr}`, 10, 40);
                                ctx.fillText(`${ekf}`, 10, 60);
                                ctx.fillText(`${isarmed}`, 305, 60);
                            }

                        }

                        function DrawEllipse(ctx, color, linewidth, x1, y1, width, height) {
                            ctx.lineWidth = linewidth;
                            ctx.strokeStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(x1 + width / 2, y1 + height);
                            var x, y;
                            for (var i = 0; i <= 360; i += 1) {
                                x = Math.sin(i * deg2rad) * width / 2;
                                y = Math.cos(i * deg2rad) * height / 2;
                                x = x + x1 + width / 2;
                                y = y + y1 + height / 2;
                                ctx.lineTo(x, y);
                            }

                            //ctx.moveTo(x1,y1);

                            ctx.stroke();
                            ctx.closePath();
                        }

                        function DrawLine(ctx, color, width, x1, y1, x2, y2) {
                            ctx.lineWidth = width;
                            ctx.strokeStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.stroke();
                            ctx.closePath();
                        }

                        function DrawPolygon(ctx, color, width, list) {
                            ctx.lineWidth = width;
                            ctx.strokeStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(list[0], list[1]);
                            for (var i = 2, len = list.length; i < len; i += 2) {
                                ctx.lineTo(list[i], list[i + 1]);
                            }
                            ctx.lineTo(list[0], list[1]);
                            ctx.stroke();
                            ctx.closePath();
                        }

                        function DrawRectangle(ctx, color, headbg) {
                            DrawLine(ctx, color, 2, headbg.Left, headbg.Top, headbg.Right, headbg.Top);
                            DrawLine(ctx, color, 2, headbg.Right, headbg.Top, headbg.Right, headbg.Bottom);
                            DrawLine(ctx, color, 2, headbg.Right, headbg.Bottom, headbg.Left, headbg.Bottom);
                            DrawLine(ctx, color, 2, headbg.Left, headbg.Bottom, headbg.Left, headbg.Top);
                        }

                        function drawstring(ctx, string, font, fontsize, color, x, y) {
                            ctx.font = fontsize + "pt " + font;
                            ctx.fillStyle = color;
                            ctx.fillText(string, x, y + fontsize);
                        }


                        // var viewer = new Cesium.Viewer('cesiumContainer');



                        //runMain();

                        //onLoad();

                        //JSIL.Initialize();

                        //var asm = JSIL.GetAssembly("MAVLink");





                        const mapview = document.querySelector('#switch');

                        var map = L.map('map').setView([28.4166522, 77.5235714], 10);
                        mapLink =
                            '<a href="http://www.esri.com/">Esri</a>';
                        wholink =
                            'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
                        L.tileLayer(
                            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; ' + mapLink + ', ' + wholink,
                                maxZoom: 18,
                            }).addTo(map);;
                        mapview.addEventListener('click', () => {
                            L.tileLayer(
                                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                    attribution: '&copy; ' + mapLink + ', ' + wholink,
                                    maxZoom: 18,
                                }).addTo(map);;
                            mapview.textContent = "Street View"
                            mapview.addEventListener('dblclick', () => {
                                L.tileLayer(
                                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        attribution: '&copy; ' + mapLink + ', ' + wholink,
                                        maxZoom: 18,
                                    }).addTo(map);;
                                mapview.textContent = "Satellite View"
                            })
                        })




                        var marker, circle;

                        function getPosition() {

                            var lat = gpslat;
                            var long = gpslon;
                            if (marker) {
                                map.removeLayer(marker)
                            }

                            if (circle) {
                                map.removeLayer(circle)
                            }

                            marker = L.marker([lat, long])
                            circle = L.circle([lat, long])

                            var featureGroup = L.featureGroup([marker, circle]).addTo(map)

                            map.fitBounds(featureGroup.getBounds())

                        }
                        var polyline;

                        function displaylines()
                        {
                            var latlng = [];
                            console.log("here");
                            if(polyline)
                                map.removeLayer(polyline);
                            console.log(lineda[0]);
                            for(let i=0;i<lineda.length;i++)
                            {
                                latlng.push([lineda[i][1],lineda[i][0]]);
                            }
                            console.log(latlng);
                             var latlang = latlng;
         
         // Creating poly line options
         var multiPolyLineOptions = {color:'red'};
         
         // Creating multi poly-lines
         var multipolyline = L.polyline(latlang , multiPolyLineOptions);
         
         // Adding multi poly-line to map
         multipolyline.addTo(map);
                        }
                        //vibration chart

                        function createvibchart() {
                            const mychart = document.getElementById('mychart').getContext('2d');
                            const barchart = new Chart(mychart, {
                                type: 'bar',
                                data: {
                                    labels: ['x', 'y', 'z'],
                                    datasets: [{
                                        label: 'Vibe Data',
                                        data: [
                                            vibx,
                                            viby,
                                            vibz,
                                        ],
                                        backgroundColor: 'orange'
                                    }]
                                },
                                options: {}
                            });
                        }
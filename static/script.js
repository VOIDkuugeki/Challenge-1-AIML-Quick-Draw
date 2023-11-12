var mousePressed = false;
var lastX, lastY;
var ctx;

function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });

    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.lineWidth = $('#selWidth').val();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineJoin = 'round';

        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    lastX = x;
    lastY = y;
}


function clearCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('result').innerHTML = "";
}

function postImage() {
    var canvas = document.getElementById('myCanvas');
    var img = canvas.toDataURL("image/png");
    img = img.replace(/^data:image\/(png|jpg);base64,/, "");

    $.ajax({
        type: 'POST',
        url: '/recognize',
        data: JSON.stringify({ image: img }),
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        success: function(msg, status, jqXHR) {
            var data = JSON.parse(jqXHR.responseText);
            var prediction = data.prediction;
            document.getElementById('result').innerHTML = '<span style="color: aquamarine; font-weight: bold; text-transform: uppercase;">' + data.prediction + '</span>';
        }
    }); 
}
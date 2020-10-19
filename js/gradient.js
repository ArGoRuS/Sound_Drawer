var MakeGradient = function(w, h, r, c, mode)
{
	var buffer = document.createElement("canvas");
	var colors = [];
	colors[0] = 'rgb(255,0,0)';
	colors[1] = 'rgb(0,255,0)';
	colors[2] = 'rgb(255,0,255)';
	colors[3] = 'rgb(255,255,0)';
	colors[4] = 'rgb(0,0,255)';
	colors[5] = 'rgb(0,255,255)';
	buffer.width  = w;
	buffer.height = h;
	var ctx = buffer.getContext("2d");
	ctx.globalCompositeOperation = 'lighter';
	for(var i = 0; i < c; ++i)
	{
		var sx = w/2 + r * 1 * Math.cos(i * 2 * Math.PI / c);
		var sy = h/2 + r * 1 * Math.sin(i * 2 * Math.PI / c);
		var fx = w/2 + r * 3.9 * Math.cos(i * 2 * Math.PI / c);
		var fy = h/2 + r * 3.9 * Math.sin(i * 2 * Math.PI / c);
		ctx.beginPath();
		var grad = ctx.createRadialGradient(sx, sy, r/3, fx, fy, r/6*20);
		grad.addColorStop(0, colors[i]);
		grad.addColorStop(1, 'rgb(0,0,0)');
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);
	}
	return buffer;
}
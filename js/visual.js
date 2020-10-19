var correctedPIc, rotateModifier, spcenterY, rad;
var GE = {
	bX: [512],
	bY: [512],
	eX: [512],
	eY: [512],
	cXY: [16]
};
var geometryX = function(l, w, h, r, max, data, geometry, tx, ty, angle, len, g, style)
{
	var a = 2*Math.PI*angle/360;
	g /= 20;
	switch(geometry)
	{
		case 1:
			var cl = 2*Math.PI*len/360;
			var rad = w/2 * r/100;
			GE.cXY[0] = w/2 + w/2 * tx/100;
			GE.cXY[1] = h/2 + h/2 * ty/100;
			for(var i = 0; i < l; ++i)
			{
				GE.bX[i] = GE.cXY[0] + rad * Math.cos(i * cl / l + a);
				GE.bY[i] = GE.cXY[1] + rad * Math.sin(i * cl / l + a);
				GE.eX[i] = GE.cXY[0] + (0.01 + rad + max * data[i]) * Math.cos(i * cl / l + a);
				GE.eY[i] = GE.cXY[1] + (0.01 + rad + max * data[i]) * Math.sin(i * cl / l + a);
				if(style == 4 && i%2 == 0)
				{
					GE.eX[i] = GE.cXY[0] + (0.01 + rad + max * (-data[i])) * Math.cos(i * cl / l + a);
					GE.eY[i] = GE.cXY[1] + (0.01 + rad + max * (-data[i])) * Math.sin(i * cl / l + a);
				}
			}
			break;
		case 2:
			var fw = l*g;
			GE.cXY[0] = w/2 + w/2 * tx/100;
			GE.cXY[1] = h/2 + h/2 * ty/100;
			for(var i = 0; i < l; ++i)
			{
				GE.bX[i] = GE.cXY[0] + (-fw/2 + g/2 + i*g) * Math.cos(a);
				GE.bY[i] = GE.cXY[1] + (-fw/2 + g/2 + i*g) * Math.sin(a);
				GE.eX[i] = GE.bX[i] + (0.01 + max * data[i]) * Math.cos(a + Math.PI/2);
				GE.eY[i] = GE.bY[i] + (0.01 + max * data[i]) * Math.sin(a + Math.PI/2);
				if(style == 4 && i%2 == 0)
				{
					GE.eX[i] = GE.bX[i] + (0.01 + max * (-data[i])) * Math.cos(a + Math.PI/2);
					GE.eY[i] = GE.bY[i] + (0.01 + max * (-data[i])) * Math.sin(a + Math.PI/2);
				}
			}
			break;
		default:
			break;
	}
	return GE;
}

var redraw_tiles = function(w, h)
{
	var m = Math.ceil(w/50) * Math.ceil(h/50);
	var tiles = {
		mount: m,
		curOp: [m],
		speed: [m],
		curColor: [m],
		textures: [10]
	};
	for(var i = 0; i < 10; ++i)
	{
		var lbuffer = document.createElement("canvas");
		lbuffer.width  = 100;
		lbuffer.height = 10;
		var lctx = lbuffer.getContext("2d");
		for(var j = 0; j < 10; ++j)
		{
			lctx.fillStyle = "rgb("+(200-(10*i+j)*0.5)+","+(200-(10*i+j)*0.5)+","+(200-(10*i+j)*0.5)+")";
			lctx.fillRect(10*j,0,10,10);
		}
		tiles.textures[i] = lbuffer;
	}
	for(var i = 0; i < m; ++i)
	{
		tiles.curOp[i] = Math.random();
		tiles.speed[i] = (Math.random()+0.5)/2;
		tiles.curColor[i] = Math.random()*100;
	}
	return tiles;
}
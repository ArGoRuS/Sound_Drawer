var buffer, bufSize = 100;

var createParticles = function(mode, size, bufAmount, pattern, file)
{
	buffer = document.createElement("canvas");
	buffer.width  = bufAmount*bufSize;
	buffer.height = bufSize;
	var ctx = buffer.getContext("2d");
	if(bufAmount < 3) bufAmount = 3;
	var wc = bufSize/2;
	var hc = bufSize/2;
	for(var i = 0; i < bufAmount; ++i)
	{
		var lbuffer = document.createElement("canvas");
		lbuffer.width  = bufSize;
		lbuffer.height = bufSize;
		var lctx = lbuffer.getContext("2d");
		lctx.lineWidth = 5*size;
		//Настройка инструментов рисования
		if(mode == 1)
		{
			lctx.strokeStyle = "rgba(255,255,255,"+(0.2+(i+1)/bufAmount*0.8)+")";
			lctx.fillStyle = "rgba(255,255,255,"+(0.2+(i+1)/bufAmount*0.8)+")";
			lctx.filter = 'blur('+(10-15*(i+1)/bufAmount)+'px)';
		}
		else if(mode == 2 || mode == 3 || mode == 4)
		{
			lctx.strokeStyle = "rgba(255,255,255,1)";
			lctx.fillStyle = "rgba(255,255,255,1)";
			if(i < 0.5*bufAmount) lctx.filter = 'blur('+20*(1-i/(0.5*bufAmount))+'px)';
			else if(i >= 0.5*bufAmount && i < 0.8*bufAmount) lctx.filter = 'blur('+0+'px)';
			else lctx.filter = 'blur('+20*(i+1-0.8*bufAmount)/(0.2*bufAmount)+'px)';
		}
		//Выбор и отрисовка шаблона
		if(pattern == 1)
		{
			var psize = bufSize*0.8*size;
			lctx.drawImage(file, wc-psize/2, hc-psize/2, psize, psize);
		}
		else if(pattern == 2)
		{
			var psize = bufSize*0.5*size;
			lctx.drawImage(file, wc-psize/2, hc-psize/2, psize, psize);
		}
		else if(pattern == 3)
		{
			var psize = bufSize*0.5*size;
			lctx.drawImage(file, wc-psize/2, hc-psize/2, psize, psize);
		}
		else if(pattern == 4)
		{
			lctx.lineCap = 'round';
			lctx.lineJoin = 'round';
			lctx.beginPath();
			lctx.moveTo(wc-wc/2, hc);
			lctx.lineTo(wc, hc-hc/2);
			lctx.lineTo(wc+wc/2, hc);
			lctx.lineTo(wc, hc+hc/2);
			lctx.lineTo(wc-wc/2, hc);
			lctx.stroke();
		}
		else if(pattern == 5)
		{
			
		}
		else if(pattern == 0)
		{
			lctx.filter = 'drop-shadow(0 0 0px #fff) blur(0px)';
			lctx.font = "bold 20pt Arial";
			lctx.fillText("ERROR", 0, 60);
		}
		else if(pattern == 99)
		{
			var psize = bufSize*0.5*size;
			lctx.drawImage(file, wc-psize/2, hc-psize/2, psize, psize);
		}
		var tsize = bufSize*0.1 + 0.9*bufSize*(bufAmount-1-i)/(bufAmount-1);
		ctx.drawImage(lbuffer, 0, 0, bufSize, bufSize, bufSize*i+wc-tsize/2, hc-tsize/2, tsize, tsize);
	}
	return buffer;
}

var spawnParticles = function(w, h, num, dir, angle, fl)
{
	var particles = [num];
	for(var i = 0; i < num; ++i)
	{
		particles[i] = {
			x: 0,
			y: 0,
			z: 0,
			s: 0,
			r: 1,
			a: 0,
			pr: 0
		};
	}
	for(var i = 0; i < num; ++i)
	{
		var rand = Math.abs(Math.random()-1); // (0; 1]
		var maxR = 1.2*Math.sqrt(w*w + h*h)/2;
		if(dir == 1)
		{
			particles[i].x = Math.random()*w;
			particles[i].y = Math.random()*h;
			particles[i].s = 1 + Math.random();
			particles[i].r = 50 + Math.random()*50;
			particles[i].a = 2*Math.PI*angle/360;
		}
		else if(dir == 2 || dir == 3)
		{
			var r = (0.05+Math.abs(1-Math.sqrt(-2.0 * Math.log(Math.abs(Math.random()-1))))*0.95) * maxR;
			//var r = (0.05 + Math.random() * 0.95) * maxR;
			var a = 2*Math.PI*rand;
			particles[i].x = w/2 + Math.cos(a) * r;
			particles[i].y = h/2 + Math.sin(a) * r;
			particles[i].s = 5 + Math.random()*10;  //speed
			particles[i].r = bufSize/2;             //radius (particle)
			particles[i].a = a;                     //rotation angle
			particles[i].pr = r;                    //previous radius (position)
		}
		else if(dir == 4)
		{
			particles[i].x = Math.random()*w;
			particles[i].y = Math.random()*h;
			particles[i].z = Math.random()*w;
			particles[i].s = 5 + Math.random()*10;
			particles[i].r = bufSize/2;
			particles[i].pr = r;
		}
	}
	return particles;
}

var respawnParticles = function(w, h, num, dir, angle, size, bufAmount, pattern, file, fl)
{
	var result = {};
	result.buffer = createParticles(dir, size, bufAmount, pattern, file);
	result.particles = spawnParticles(w, h, num, dir, angle, fl);
	return result;
}
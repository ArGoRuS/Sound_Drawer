var PN_Correction = function(data, pinkNoise)
{
	for (var i = 0; i < pinkNoise.length; i++) 
	{
		data[i] /= pinkNoise[i];
		data[data.length/2+i] /= pinkNoise[i];
	}
	return data;
}

var AS_Changer = function(data, max)
{
	var temp = [max];
	var halfdata = [data.length/2];
	for (var j = 0; j < 2; j++) 
	{
		halfdata.length = 0;
		halfdata = data.slice(j*data.length/2, (j+1)*data.length/2);
		for (var i = 0; i < halfdata.length; i++) 
		{
			temp[i*4+j*max/2] = halfdata[i];
			if(halfdata[i-1] != undefined) temp[i*4+j*max/2] += halfdata[i-1]*0.1;
			if(halfdata[i+1] != undefined) temp[i*4+j*max/2] += halfdata[i+1]*0.1;
			if(halfdata[i-2] != undefined) temp[i*4+j*max/2] += halfdata[i-2]*0.05;
			if(halfdata[i+2] != undefined) temp[i*4+j*max/2] += halfdata[i+2]*0.05;
			if(i != halfdata.length-1)
			{
				temp[(i*4+j*max/2)+1] = halfdata[i]*0.5 + halfdata[i+1]*0.125;
				temp[(i*4+j*max/2)+2] = halfdata[i]*0.25 + halfdata[i+1]*0.25;
				temp[(i*4+j*max/2)+3] = halfdata[i]*0.125 + halfdata[i+1]*0.5;
			}
			else
			{
				temp[(i*4+j*max/2)+1] = halfdata[i]*0.65;
				temp[(i*4+j*max/2)+2] = halfdata[i]*0.5;
				temp[(i*4+j*max/2)+3] = halfdata[i]*0.35;
			}
		}
	}
	return temp;
}

var AS_Cropper = function(data, size)
{
	var temp = [size];
	for (var i = 0; i < size; i++) 
	{
		 temp[i] = data[i*512/size];
	}
	return temp;
}

var spectrumInvertor = function(data, AUDIO_SI)
{
	var temp = [data.length];
	var leftD = data.slice(0, data.length/2);
	var rightD = data.slice(data.length/2);
	if(AUDIO_SI == 2) leftD.reverse();
	else if(AUDIO_SI == 3) rightD.reverse();
	else
	{
		leftD.reverse();
		rightD.reverse();
	}
	temp = leftD.concat(rightD);
	return temp;
}

var bSumCalc = function(data, prevbSum, AUDIO_SI, swap)
{
	bSum = 0;
	var bSumTemp = [data.length/16];
	if(swap)
	{
		for (var i = 0; i < data.length/16; ++i)
		{
			bSumTemp.pop();
			if(AUDIO_SI == 1 || AUDIO_SI == 3) bSumTemp.unshift(data[data.length/2+i]);
			else bSumTemp.unshift(data[data.length-1-i]);
			if(AUDIO_SI == 1 || AUDIO_SI == 2) bSumTemp.unshift(data[i]);
			else bSumTemp.unshift(data[data.length/2-1-i]);
		}
	}
	else
	{
		for (var i = 0; i < data.length/16; ++i)
		{
			bSumTemp.pop();
			if(AUDIO_SI == 1 || AUDIO_SI == 3) bSumTemp.unshift(data[i]);
			else bSumTemp.unshift(data[data.length/2-1-i]);
			if(AUDIO_SI == 1 || AUDIO_SI == 2) bSumTemp.unshift(data[data.length/2+i]);
			else bSumTemp.unshift(data[data.length-1-i]);
		}
	}
	bSum = Math.max.apply(null, bSumTemp);
	if(bSum > prevbSum) bSum = prevbSum*0.3 + bSum*0.7;
	else bSum = prevbSum*0.8 + bSum*0.2;
	bSum = Math.round(bSum*1000)/1000;
	return bSum;
}

var accentuate = function(data, mode)
{
	for (var i = 0; i < data.length; i++) 
	{
		data[i] = Math.pow(data[i], mode/10);
	}
	return data;
}

var PP = function(len, data, bondingMode, nc, mod1, mod2)
{
	var div1 = mod1 + mod2;
	var div2 = mod1 + mod2 + mod1;
	var arg1 = 0, arg2 = 0, arg3 = 0, div = 0;
	for(var j = 0; j < nc; j++) 
	{
		var olddata = [len];
		for(var i = 0; i < len; i++) 
		{
			olddata[i] = data[i];
		}
		if(bondingMode == 'none')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0 || i == len/2) arg1 = 0;
				else arg1 = olddata[i-1]*mod1;
				//arg2
				arg2 = olddata[i]*mod2;
				//arg3
				if(i == (len/2 - 1) || i == (len - 1)) arg3 = 0;
				else arg3 = olddata[i+1]*mod1;
				//result
				div = div2;
				if(i == 0 || i == len/2) div = div1;
				if(i == (len/2 - 1) || i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3) / div;
			}
		}
		else if(bondingMode == 'inside')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0) arg1 = 0;
				else arg1 = olddata[i-1]*mod1;
				//arg2
				arg2 = olddata[i]*mod2;
				//arg3
				if(i == (len - 1)) arg3 = 0;
				else arg3 = olddata[i+1]*mod1;
				//result
				div = div2;
				if(i == 0) div = div1;
				if(i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3) / div;
			}
		}
		else if(bondingMode == 'full')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0) arg1 = olddata[len-1]*mod1;
				else arg1 = olddata[i-1]*mod1;
				//arg2
				arg2 = olddata[i]*mod2;
				//arg3
				if(i == (len - 1)) arg3 = olddata[0]*mod1;
				else arg3 = olddata[i+1]*mod1;
				//result
				div = div2;
				data[i] = (arg1 + arg2 + arg3) / div;
			}
		}
	}
	return data;
}

var PP2 = function(len, data, bondingMode, nc, mod1, mod2, mod3)
{
	var div1 = mod1 + mod2 + mod3;
	var div2 = mod1 + mod2 + mod3 + mod2;
	var div3 = mod1 + mod2 + mod3 + mod2 + mod1;
	var arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0, arg5 = 0, div = 0;
	for(var j = 0; j < nc; j++) 
	{
		var olddata = [len];
		for(var i = 0; i < len; i++) 
		{
			olddata[i] = data[i];
		}
		if(bondingMode == 'none')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0 || i == len/2) arg1 = 0;
				else if(i == 1 || i == (len/2 + 1)) arg1 = 0;
				else arg1 = olddata[i-2]*mod1;
				//arg2
				if(i == 0 || i == len/2) arg2= 0;
				else arg2 = olddata[i-1]*mod2;
				//arg3
				arg3 = olddata[i]*mod3;
				//arg4
				if(i == (len/2 - 1) || i == (len - 1)) arg4 = 0;
				else arg4 = olddata[i+1]*mod2;
				//arg5
				if(i == (len/2 - 2) || i == (len - 2)) arg5 = 0;
				else if(i == (len/2 - 1) || i == (len - 1)) arg5 = 0;
				else arg5 = olddata[i+2]*mod1;
				//result
				if(i == 0 || i == len/2) div = div1;
				if(i == 1 || i == (len/2 + 1)) div = div2;
				if((i > 1 && i < (len/2 - 2)) || (i > (len/2 + 1) && i < (len - 2))) div = div3;
				if(i == (len/2 - 2) || i == (len - 2)) div = div2;
				if(i == (len/2 - 1) || i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5) / div;
			}
		}
		else if(bondingMode == 'inside')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0) arg1 = 0;
				else if(i == 1) arg1 = 0;
				else arg1 = olddata[i-2]*mod1;
				//arg2
				if(i == 0) arg2= 0;
				else arg2 = olddata[i-1]*mod2;
				//arg3
				arg3 = olddata[i]*mod3;
				//arg4
				if(i == (len - 1)) arg4 = 0;
				else arg4 = olddata[i+1]*mod2;
				//arg5
				if(i == (len - 2)) arg5 = 0;
				else if(i == (len - 1)) arg5 = 0;
				else arg5 = olddata[i+2]*mod1;
				//result
				if(i == 0) div = div1;
				if(i == 1) div = div2;
				if(i > 1 && i < (len - 2)) div = div3;
				if(i == (len - 2)) div = div2;
				if(i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5) / div;
			}
		}
		else if(bondingMode == 'full')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0) arg1 = olddata[len-2]*mod1;
				else if(i == 1) arg1 = olddata[len-1]*mod1;
				else arg1 = olddata[i-2]*mod1;
				//arg2
				if(i == 0) arg2 = olddata[len-1]*mod2;
				else arg2 = olddata[i-1]*mod2;
				//arg3
				arg3 = olddata[i]*mod3;
				//arg4
				if(i == (len - 1)) arg4 = olddata[0]*mod2;
				else arg4 = olddata[i+1]*mod2;
				//arg5
				if(i == (len - 2)) arg5 = olddata[0]*mod1;
				else if(i == (len - 1)) arg5 = olddata[1]*mod1;
				else arg5 = olddata[i+2]*mod1;
				//result
				if(i == 0) div = div3;
				if(i == 1) div = div3;
				if(i > 1 && i < (len - 2)) div = div3;
				if(i == (len - 2)) div = div3;
				if(i == (len - 1)) div = div3;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5) / div;
			}
		}
	}
	return data;
}

var PP3 = function(len, data, bondingMode, nc, mod1, mod2, mod3, mod4)
{
	var div1 = mod1 + mod2 + mod3 + mod4;
	var div2 = mod1 + mod2 + mod3 + mod4 + mod3;
	var div3 = mod1 + mod2 + mod3 + mod4 + mod3 + mod2;
	var div4 = mod1 + mod2 + mod3 + mod4 + mod3 + mod2 + mod1;
	var arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0, arg5 = 0, arg6 = 0, arg7 = 0, div = 0;
	for(var j = 0; j < nc; j++) 
	{
		var olddata = [len];
		for(var i = 0; i < len; i++) 
		{
			olddata[i] = data[i];
		}
		if(bondingMode == 'none')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0 || i == len/2) arg1 = 0;
				else if(i == 1 || i == (len/2 + 1)) arg1 = 0;
				else if(i == 2 || i == (len/2 + 2)) arg1 = 0;
				else arg1 = olddata[i-3]*mod1;
				//arg2
				if(i == 0 || i == len/2) arg2 = 0;
				else if(i == 1 || i == (len/2 + 1)) arg2 = 0;
				else arg2 = olddata[i-2]*mod2;
				//arg3
				if(i == 0 || i == len/2) arg1 = 0;
				else arg3 = olddata[i-1]*mod3;
				//arg4
				arg4 = olddata[i]*mod4;
				//arg5
				if(i == (len/2 - 1) || i == (len - 1)) arg5 = 0;
				else arg5 = olddata[i+1]*mod3;
				//arg6
				if(i == (len/2 - 2) || i == (len - 2)) arg6 = 0;
				else if(i == (len/2 - 1) || i == (len - 1)) arg6 = 0;
				else arg6 = olddata[i+2]*mod2;
				//arg7
				if(i == (len/2 - 3) || i == (len - 3)) arg7 = 0;
				else if(i == (len/2 - 2) || i == (len - 2)) arg7 = 0;
				else if(i == (len/2 - 1) || i == (len - 1)) arg7 = 0;
				else arg7 = olddata[i+3]*mod1;
				//result
				if(i == 0 || i == len/2) div = div1;
				if(i == 1 || i == (len/2 + 1)) div = div2;
				if(i == 2 || i == (len/2 + 2)) div = div3;
				if((i > 2 && i < (len/2 - 3)) || (i > (len/2 + 2) && i < (len - 3))) div = div4;
				if(i == (len/2 - 3) || i == (len - 3)) div = div3;
				if(i == (len/2 - 2) || i == (len - 2)) div = div2;
				if(i == (len/2 - 1) || i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5 + arg6 + arg7) / div;
			}
		}
		else if(bondingMode == 'inside')
		{
			for(var i = 0; i < len; i++)
			{
				//arg1
				if(i == 0) arg1 = 0;
				else if(i == 1) arg1 = 0;
				else if(i == 2) arg1 = 0;
				else arg1 = olddata[i-3]*mod1;
				//arg2
				if(i == 0) arg2 = 0;
				else if(i == 1) arg2 = 0;
				else arg2 = olddata[i-2]*mod2;
				//arg3
				if(i == 0) arg3 = 0;
				else arg3 = olddata[i-1]*mod3;
				//arg4
				arg4 = olddata[i]*mod4;
				//arg5
				if(i == (len - 1)) arg5 = 0;
				else arg5 = olddata[i+1]*mod3;
				//arg6
				if(i == (len - 2)) arg6 = 0;
				else if(i == (len - 1)) arg6 = 0;
				else arg6 = olddata[i+2]*mod2;
				//arg7
				if(i == (len - 3)) arg7 = 0;
				else if(i == (len - 2)) arg7 = 0;
				else if(i == (len - 1)) arg7 = 0;
				else arg7 = olddata[i+3]*mod1;
				//result
				if(i == 0) div = div1;
				if(i == 1) div = div2;
				if(i == 2) div = div3;
				if((i > 2 && i < (len - 3))) div = div4;
				if(i == (len - 3)) div = div3;
				if(i == (len - 2)) div = div2;
				if(i == (len - 1)) div = div1;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5 + arg6 + arg7) / div;
			}
		}
		else if(bondingMode == 'full')
		{
			for(var i = 0; i < len; i++) 
			{
				//arg1
				if(i == 0) arg1 = olddata[len-3]*mod1;
				else if(i == 1) arg1 = olddata[len-2]*mod1;
				else if(i == 2) arg1 = olddata[len-1]*mod1;
				else arg1 = olddata[i-3]*mod1;
				//arg2
				if(i == 0) arg2 = olddata[len-2]*mod2;
				else if(i == 1) arg2 = olddata[len-1]*mod2;
				else arg2 = olddata[i-2]*mod2;
				//arg3
				if(i == 0) arg3 = olddata[len-1]*mod3;
				else arg3 = olddata[i-1]*mod3;
				//arg4
				arg4 = olddata[i]*mod4;
				//arg5
				if(i == (len - 1)) arg5 = olddata[0]*mod3;
				else arg5 = olddata[i+1]*mod3;
				//arg6
				if(i == (len - 2)) arg6 = olddata[0]*mod2;
				else if(i == (len - 1)) arg6 = olddata[1]*mod2;
				else arg6 = olddata[i+2]*mod2;
				//arg7
				if(i == (len - 3)) arg7 = olddata[0]*mod1;
				else if(i == (len - 2)) arg7 = olddata[1]*mod1;
				else if(i == (len - 1)) arg7 = olddata[2]*mod1;
				else arg7 = olddata[i+3]*mod1;
				//result
				div = div4;
				data[i] = (arg1 + arg2 + arg3 + arg4 + arg5 + arg6 + arg7) / div;
			}
		}
	}
	return data;
}

var MClipping = function(data, adm)
{
	var temp = [data.length];
	for (var i = 0; i < data.length; i++)
	{
		temp[i] = data[i];
	}
	temp.sort(function(a, b)
	{
		return a - b;
	});
	var m = (temp[data.length/2+adm*data.length/64] + temp[data.length/2+adm*data.length/64-1])/2;
	for (var i = 0; i < data.length; i++)
	{
		if(data[i] < m) data[i] = 0;
/* 		data[i] -= m;
		if(data[i] < 0) data[i] = 0; */
	}
	var res = {
		data: data,
		m: m
	}
	return res;
}
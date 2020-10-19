var gl = null;

var initWebGL = function(canvas)
{
	gl = canvas.getContext("webgl");
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.viewport(0,0,canvas.width,canvas.height);
}

var initShaders = function()
{
	var fragSH = getShader(gl, "shader-fs");
	var vertexSH = getShader(gl, "shader-vs");
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexSH);
	gl.attachShader(shaderProgram, fragmentSH);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
		alert("Unable to initialize the shader program.");
	}
	gl.useProgram(shaderProgram);
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
}

var getShader = function(gl, id)
{
	var shaderScript, theSource, currentChild, shader;
	shaderScript = document.getElementById(id);
	if(!shaderScript) return null;
	theSource = "";
	currentChild = shaderScript.firstChild;
	while(currentChild)
	{
		if(currentChild.nodeType == currentChild.TEXT_NODE)
		{
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}
	if(shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if(shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);
	else return null;
	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);  
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{  
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
		return null;  
	}
	return shader;
}

var initBuffers = function()
{
	
}

var drawLikeABoss = function()
{
	
}
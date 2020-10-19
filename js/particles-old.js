//VECTOR

function Vector(x, y)
{
	this.x = x || 0;
	this.y = y || 0;
}
var Add = function(vec1, vec2)
{
	vec1.x += vec2.x;
	vec1.y += vec2.y;
	return vec1;
}
var Length = function(vec)
{
	return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
var Angle = function(vec)
{
	return Math.atan2(vec.y, vec.x);
}
var VFA = function(angle, length)
{
	return new Vector(length * Math.cos(angle), length * Math.sin(angle));
}

//PARTICLE

function Particle(position, velocity, acceleration)
{
	this.position = position || new Vector(0, 0);
	this.velocity = velocity || new Vector(0, 0);
	this.acceleration = acceleration || new Vector(0, 0);
}

var pMove = function(particle)
{
	Add(particle.velocity, particle.acceleration);
	Add(particle.position, particle.velocity);
}

function addNewParticles()
{
	if(particlesS.length > PP.maxQuantity) return;
	for(var i = 0; i < emittersS.length; i++)
	{
		for(var j = 0; j < PP.emissionRate; j++)
		{
			particlesS.push(EP(emittersS[i]));
		}
	}
}

function updateParticles(startX, startY, endX, endY)
{
	var newParticles = [];
	for(var i = 0; i < particlesS.length; i++)
	{
		var pX = particlesS[i].position.x;
		var pY = particlesS[i].position.y;
		if(pX < startX || pX > endX || pY < startY || pY > endY) continue;
		pMove(particlesS[i]);
		newParticles.push(particlesS[i]);
	}
	particlesS = newParticles;
}

function drawParticles(ctx)
{
	ctx.fillStyle = PP.color;
	for(var i = 0; i < particlesS.length; i++)
	{
		var pX = particlesS[i].position.x;
		var pY = particlesS[i].position.y;
		ctx.fillRect(pX, pY, PP.particleSize, PP.particleSize);
	}
}

//EMITTER

function Emitter(position, velocity, spread)
{
	this.position = position;
	this.velocity = velocity;
	this.spread = spread || Math.PI / 128;
}

var EP = function(emitter)
{
	var angle = Angle(emitter.velocity) + emitter.spread - (Math.random() * emitter.spread * 2);
	var length = Length(emitter.velocity);
	var position = new Vector(emitter.position.x, emitter.position.y);
	var velocity = VFA(angle, length);
	return new Particle(position, velocity);
}

//CONFIGURATION

var PP = {
	positionX: 0,
	positionY: 540,
	length: 10,
	angle: Math.PI/64,
	emissionRate: 1,
	maxQuantity: 500,
	particleSize: 7,
	color: 'white'
};

var particlesS = [];
var emittersS = [1];
emittersS[0] = new Emitter(new Vector(PP.positionX,PP.positionY), VFA(PP.angle, PP.length), PP.angle);
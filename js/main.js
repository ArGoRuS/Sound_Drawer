var WE_visualizer = (function($, createjs) {
    var _ = {};
	var pinkNoise = [0.9500, 0.9000, 0.8250, 0.8600, 0.8655, 0.8470, 0.8850, 0.8980, 0.8840, 0.9062, 0.9320, 0.9397, 0.9634, 0.9910, 1.0060, 1.0320, 1.0665, 1.0880, 1.1190, 1.1500, 1.1750, 1.2040, 1.2440, 1.2645, 1.3010, 1.3420, 1.3653, 1.3990, 1.4528, 1.5310, 1.5125, 1.7960, 1.8785, 1.9615, 2.2550, 2.3795, 2.6340, 2.8988, 3.2305, 3.5925, 3.7690, 5.0130, 4.9530, 5.8346, 6.1980, 6.0965, 6.9000, 7.9250, 7.8150, 9.0800, 10.245, 9.1778, 11.005, 12.2500, 12.5950, 14.0050, 13.9500, 14.9500, 14.9100, 16.4200, 14.7020, 17.4970, 18.0300, 18.1920];
	var oldpinkNoise = [1.1760367470305, 0.85207379418243, 0.68842437227852, 0.63767902570829, 0.5452348949654, 0.50723325864167, 0.4677726234682, 0.44204182748767, 0.41956517802157, 0.41517375040002, 0.41312118577934, 0.40618363960446, 0.39913707474975, 0.38207008614508, 0.38329789106488, 0.37472136606245, 0.36586428412968, 0.37603017335105, 0.39762590761573, 0.39391828858591, 0.37930603769622, 0.39433365764563, 0.38511504613859, 0.39082579241834, 0.3811852720504, 0.40231453727161, 0.40244151133175, 0.39965366884521, 0.39761103827545, 0.51136400422212, 0.66151212038954, 0.66312205226679, 0.7416276690995, 0.74614971301133, 0.84797007577483, 0.8573583910469, 0.96382997811663, 0.99819377577185, 1.0628692615814, 1.1059083969751, 1.1819808497335, 1.257092297208, 1.3226521464753, 1.3735992532905, 1.4953223705889, 1.5310064942373, 1.6193923584808, 1.7094805527135, 1.7706604552218, 1.8491987941428, 1.9238418849406, 2.0141596921333, 2.0786429508827, 2.1575522518646, 2.2196355526005, 2.2660112509705, 2.320762171749, 2.3574848254513, 2.3986127976537, 2.4043566176474, 2.4280476777842, 2.3917477397336, 2.4032522546622, 2.3614180150678];
	var powerS = 0, exceptionFlag1 = -1, exceptionFlag2 = 1, exceptionFlag3 = -1, sseDirection = 0, sseCounter = 0, cycleM = 0;
	var mode2gradient;
	var bSum = 0, prevbSum = 0, audioMaxV = 0, audioPeakV = 1;
	var fpsC = 0, fpsR = 0, currT = 0, prevT = 0, aFPS = 0, prevaFPS = 0, aniMod = 0, mD_FPS = 0, pD_FPS = 0, dD_FPS = 0; 
	var audioS = [], audioSF = [], newaudioS = [], audioS_prev = [], audioSF_prev = [], audioR = [], trend = [], trend_prev = [];
	var bglayers = [], bglayer4, bSummable = [], dataSize = 0;
	var debug1, debug2, debug3, debug4, debug5, debug6, debug7;
	var parentWidth, parentHeight, imageWidth = 0, imageHeight = 0;
	var audp, bgg, bgpoz = 0, bgspeed = 0, bgsize = 0, bgtimer = 0;
	var canv0, canv1, canv2, canv3, canv4, ctx0, ctx1, ctx2, ctx3, ctx4, dcanv, dctx;
	var SS_duration = 30000, SS_pauseTS = 0, SS_resumeTS = 0, SS_slidesNum = 0, WE_paused = false;
	var scaleModifier = 0, pozModifier = 0, firstCalling = true, initIsComplete = false, loadr = 0;
	var loader, loadtimer = 0, loadScrI, elem1, elem2, slidechanger;
	var median = 0, maxADSize = 512, rebuildStatus = 0, tiles = {};
	var particleSource, particles = [200], dustC = 0, bufAmount = 80, bufSize = 100, maxR = 0, rad = 0, cX = 0, cY = 0, particlesIsSpawned = false, fl = 0, pzoom = 1;
	var audioInit = true, audioCTX, audioAnalyser;
	var b_graph = [300], d_graph = [300];
	b_graph.length = 300;
	d_graph.length = 300;
	var GE = {
		bX: [512],
		bY: [512],
		eX: [512],
		eY: [512],
		cXY: [16]
	};
	var bgmPoint = {
		x: 0,
		y: 0,
		sx: 0,
		sy: 0,
		sa: 2*Math.PI*Math.random()
	};
	var UP = {  //USER PROPERTIES
		MAIN_Menu: 1,
		schemecolor: "#000000",
		BG_type: 1,
		BG_image: "images/bg.png",
		BG_image_RESERVED: "images/bg.png",
		BG_folder: "images",
		BG_style: 1,
		BG_SS_Delay: 5,
		EF_A_Bool: false,
		EF_A_Mode: 1,
		EF_A_Intensity: 10,
		EF_A_Sensitivity: 100,
		EF_B_Bool: false,
		EF_B_Intensity: 2,
		EF_B_Sensitivity: 100,
		EF_D_Bool: false,
		EF_D_Intensity: 5,
		EF_SH_Bool: false,
		EF_SH_Intensity: 10,
		EF_PUL_Bool: true,
		EF_PUL_Intensity: 10,
		VISUAL_geometry: 1,
		VISUAL_style: 4,
		VISUAL_colorType: 1,
		VISUAL_gProfile: 1,
		VISUAL_gMS: 0,
		VISUAL_colC: [255, 255, 255],
		VISUAL_colO: 100,
		VISUAL_circleRad: 30,
		VISUAL_colMax: 200,
		VISUAL_colW: 1,
		VISUAL_colCap: "round",
		VISUAL_colBlurS: 40,
		VISUAL_startAngle: 0,
		VISUAL_circleLength: 360,
		VISUAL_colBlurC: "rgb(255,255,255)",
		VISUAL_gaps: 5,
		VISUAL_pX: 0,
		VISUAL_pY: 0,
		AUDIO_PNC: true,
		AUDIO_PP: true,
		AUDIO_ALT_PP: false,
		AUDIO_AA: false,
		AUDIO_AA_Mode: 1,
		AUDIO_SI: 1,
		AUDIO_Swap: false,
		AUDIO_AS: 512,
		AUDIO_SM: true,
		AUDIO_SM_Mode: 3,
		AUDIO_SM_SMA: 3,
		AUDIO_PP_MS: 3,
		AUDIO_PP_CN: 3,
		AUDIO_VC_Mode: 1,
		AUDIO_VC_Manual: 12,
		AUDIO_Median: true,
		AUDIO_adm: 20,
		DUST_Bool: true,
		DUST_Direction: 1,
		DUST_Angle: 45,
		DUST_Amount: 200,
		DUST_FillType: 1,
		DUST_Color: "#000000",
		DUST_Hue: 0,
		DUST_ColorSpeed: 1,
		DUST_Size: 20,
		DUST_Rotation: 0,
		DUST_Pattern: 1,
		DUST_CustomPattern: "default",
		DUST_Respawn: true,
		EXP_fpsCap: 60,
		EXP_param_Alpha: 50,
		EXP_param_Beta: 100,
		EXP_sl4: 1,
		EXP_debuginfo: true,
		EXP_fpsonly: false,
		EXP_loadscrbool: false,
		EXP_action1: false
	};

	var data_SMA = new Array();
	for(var i = 0; i < maxADSize; i++)
	{
		data_SMA[i] = new Array();
		for(var j = 0; j < 10; j++)
		{
			data_SMA[i][j] = 0;
		}
		audioS[i] = 0;
		audioS_prev[i] = 0;
		audioSF[i] = 0;
		audioSF_prev[i] = 0;
		newaudioS[i] = 0;
		audioR[i] = 0;
		trend[i] = 0;
		trend_prev[i] = 0;
	}
	
	window.wallpaperPropertyListener = 
	{
		setPaused: function(isPaused) 
		{                                                                          //SETPAUSED
			if (isPaused)
			{
				WE_paused = true;
				if( loadr != 400) clearInterval(loadScrI);
			}
			else
			{
				WE_paused = false;
				if( loadr != 400) loadScrI = setInterval(loadScr, 30);
				if(UP.DUST_Bool) respawnParticlesInit();
			}
		},
		applyUserProperties: function(properties)
		{                                                                          //APPLYUSERPROPERTIES
			//MENU
			if (properties.MAIN_Menu)
			{
				UP.MAIN_Menu = properties.MAIN_Menu.value;
			}
			//GENERAL
			if (properties.schemecolor) 
			{
				var schemeColor = properties.schemecolor.value.split(' ');
				schemeColor = schemeColor.map(function(c) 
				{
					return Math.ceil(c * 255);
				});
				UP.schemecolor = schemeColor;
			}
			//BACKGROUND
			if (properties.BG_type)
			{
				UP.BG_type = properties.BG_type.value;
				if(!firstCalling)
				{
					if(UP.BG_type == 1)
					{
						slideshowController('stop');
						exceptionFlag3 = 0;
						UP.BG_image = UP.BG_image_RESERVED;
						bgcheck();
					}
					else if(UP.BG_type == 2)
					{
						exceptionFlag3 = 3;
						nextRandomImage();
						slideshowController('start');
					}
				}
			}
			if (properties.BG_image)
			{
				if(properties.BG_image.value == "default" || properties.BG_image.value == '') 
				{
					UP.BG_image = "images/bg.png";
					UP.BG_image_RESERVED = "images/bg.png";
				}
				else
				{
					UP.BG_image = "file:///" + properties.BG_image.value;
					UP.BG_image_RESERVED = "file:///" + properties.BG_image.value;
				}
				exceptionFlag1 = 2;
				if(!firstCalling) bgcheck();
			}
			if (properties.BG_folder)
			{
				if(properties.BG_folder.value == '' || properties.BG_folder.value == undefined) UP.BG_folder = "-unknown-";
				else UP.BG_folder = "file:///" + properties.BG_folder.value;
				if(!firstCalling)
				{
					exceptionFlag3 = 3;
					nextRandomImage();
					slideshowController('start');
				}
			}
			if (properties.BG_style)
			{
				UP.BG_style = properties.BG_style.value;
				if(!firstCalling) bgrebuilding('full');
			}
			if (properties.BG_SS_Delay)
			{
				UP.BG_SS_Delay = properties.BG_SS_Delay.value;
				if(!firstCalling) slideshowController('start');
			}
			//EFFECTS
			if (properties.EF_A_Bool)
			{
				UP.EF_A_Bool = properties.EF_A_Bool.value;
				if(!firstCalling) bgrebuilding('full');
			}
			if (properties.EF_A_Mode)
			{
				UP.EF_A_Mode = properties.EF_A_Mode.value;
				if(!firstCalling) bgrebuilding('full');
			}
			if (properties.EF_A_Intensity)
			{
				UP.EF_A_Intensity = properties.EF_A_Intensity.value;
				if(!firstCalling) scaleChanger();
			}
			if (properties.EF_A_Sensitivity)
			{
				UP.EF_A_Sensitivity = properties.EF_A_Sensitivity.value;
			}
			if (properties.EF_B_Bool)
			{
				UP.EF_B_Bool = properties.EF_B_Bool.value;
				if(!firstCalling) scaleChanger();
			}
			if (properties.EF_B_Intensity)
			{
				UP.EF_B_Intensity = properties.EF_B_Intensity.value;
				if(!firstCalling) scaleChanger();
			}
			if (properties.EF_B_Sensitivity)
			{
				UP.EF_B_Sensitivity = properties.EF_B_Sensitivity.value;
			}
			if (properties.EF_D_Bool)
			{
				UP.EF_D_Bool = properties.EF_D_Bool.value;
				if(!firstCalling) bgrebuilding('full');
			}
			if (properties.EF_D_Intensity)
			{
				UP.EF_D_Intensity = properties.EF_D_Intensity.value;
				if(!firstCalling) bgrebuilding('full');
			}
			if (properties.EF_SH_Bool)
			{
				UP.EF_SH_Bool = properties.EF_SH_Bool.value;
			}
			if (properties.EF_SH_Intensity)
			{
				UP.EF_SH_Intensity = properties.EF_SH_Intensity.value;
			}
			if (properties.EF_PUL_Bool)
			{
				UP.EF_PUL_Bool = properties.EF_PUL_Bool.value;
			}
			if (properties.EF_PUL_Intensity)
			{
				UP.EF_PUL_Intensity = properties.EF_PUL_Intensity.value;
			}
			//VISUALIZATION
			if (properties.VISUAL_geometry)
			{
				UP.VISUAL_geometry = properties.VISUAL_geometry.value;
			}
			if (properties.VISUAL_style)
			{
				UP.VISUAL_style = properties.VISUAL_style.value;
			}
			if (properties.VISUAL_colorType)
			{
				UP.VISUAL_colorType = properties.VISUAL_colorType.value;
			}
			if (properties.VISUAL_gProfile)
			{
				UP.VISUAL_gProfile = properties.VISUAL_gProfile.value;
			}
			if (properties.VISUAL_gMS)
			{
				UP.VISUAL_gMS = properties.VISUAL_gMS.value;
			}
			if (properties.VISUAL_colC)
			{
				var c = properties.VISUAL_colC.value.split(' ').map(function(c) 
				{
					return Math.ceil(c * 255);
				});
				UP.VISUAL_colC = c;
			}
			if (properties.VISUAL_colO)
			{
				UP.VISUAL_colO = properties.VISUAL_colO.value;
			}
			if (properties.VISUAL_circleRad)
			{
				UP.VISUAL_circleRad = properties.VISUAL_circleRad.value;
			}
			if (properties.VISUAL_colMax)
			{
				UP.VISUAL_colMax = properties.VISUAL_colMax.value;
			}
			if (properties.VISUAL_colW)
			{
				UP.VISUAL_colW = properties.VISUAL_colW.value;
			}
			if (properties.VISUAL_colCap)
			{
				if(properties.VISUAL_colCap.value == 1) UP.VISUAL_colCap = "butt";
				else if(properties.VISUAL_colCap.value == 2) UP.VISUAL_colCap = "round";
				else if(properties.VISUAL_colCap.value == 3) UP.VISUAL_colCap = "square";
			}
			if (properties.VISUAL_colBlurS)
			{
				UP.VISUAL_colBlurS = properties.VISUAL_colBlurS.value;
			}
			if (properties.VISUAL_colBlurC) 
			{
				var c = properties.VISUAL_colBlurC.value.split(' ').map(function(c) 
				{
					return Math.ceil(c * 255);
				});
				UP.VISUAL_colBlurC = 'rgb('+ c +')';
			}
			if (properties.VISUAL_startAngle)
			{
				UP.VISUAL_startAngle = properties.VISUAL_startAngle.value;
			}
			if (properties.VISUAL_circleLength)
			{
				UP.VISUAL_circleLength = properties.VISUAL_circleLength.value;
			}
			if (properties.VISUAL_gaps)
			{
				UP.VISUAL_gaps = properties.VISUAL_gaps.value;
			}
			if (properties.VISUAL_pX)
			{
				UP.VISUAL_pX = properties.VISUAL_pX.value;
			}
			if (properties.VISUAL_pY)
			{
				UP.VISUAL_pY = properties.VISUAL_pY.value;
			}
			//DUST
			if (properties.DUST_Bool)
			{
				UP.DUST_Bool = properties.DUST_Bool.value;
			}
			if (properties.DUST_Direction)
			{
				UP.DUST_Direction = properties.DUST_Direction.value;
				if(!firstCalling)
				{
					respawnParticlesInit();
				}
			}
			if (properties.DUST_Angle)
			{
				UP.DUST_Angle = properties.DUST_Angle.value;
			}
			if (properties.DUST_Amount)
			{
				UP.DUST_Amount = properties.DUST_Amount.value;
			}
			if (properties.DUST_FillType)
			{
				UP.DUST_FillType = properties.DUST_FillType.value;
			}
			if (properties.DUST_Color)
			{
				var c = properties.DUST_Color.value.split(' ').map(function(c) 
				{
					return Math.ceil(c * 255);
				});
				UP.DUST_Color = 'rgb('+ c +')';
			}
			if (properties.DUST_Hue)
			{
				UP.DUST_Hue = properties.DUST_Hue.value;
			}
			if (properties.DUST_ColorSpeed)
			{
				UP.DUST_ColorSpeed = properties.DUST_ColorSpeed.value;
			}
			if (properties.DUST_Size)
			{
				UP.DUST_Size = properties.DUST_Size.value/100;
			}
			if (properties.DUST_Rotation)
			{
				UP.DUST_Rotation = properties.DUST_Rotation.value;
			}
			if (properties.DUST_Pattern)
			{
				UP.DUST_Pattern = properties.DUST_Pattern.value;
				if(!firstCalling)
				{
					respawnParticlesInit();
				}
			}
			if (properties.DUST_CustomPattern)
			{
				UP.DUST_CustomPattern = "file:///" + properties.DUST_CustomPattern.value;
				if(!firstCalling)
				{
					respawnParticlesInit();
				}
			}
			if (properties.DUST_Respawn)
			{
				UP.DUST_Respawn = properties.DUST_Respawn.value;
				if(!firstCalling)
				{
					respawnParticlesInit();
				}
			}
			//AUDIO
			if (properties.AUDIO_PNC)
			{
				UP.AUDIO_PNC = properties.AUDIO_PNC.value;
			}
			if (properties.AUDIO_PP)
			{
				UP.AUDIO_PP = properties.AUDIO_PP.value;
			}
			if (properties.AUDIO_PP_MS)
			{
				UP.AUDIO_PP_MS = properties.AUDIO_PP_MS.value;
			}
			if (properties.AUDIO_PP_CN)
			{
				UP.AUDIO_PP_CN = properties.AUDIO_PP_CN.value;
			}
			if (properties.AUDIO_AA)
			{
				UP.AUDIO_AA = properties.AUDIO_AA.value;
			}
			if (properties.AUDIO_AA_Mode)
			{
				UP.AUDIO_AA_Mode = properties.AUDIO_AA_Mode.value;
			}
			if (properties.AUDIO_SI)
			{
				UP.AUDIO_SI = properties.AUDIO_SI.value;
			}
			if (properties.AUDIO_Swap)
			{
				UP.AUDIO_Swap = properties.AUDIO_Swap.value;
			}
			if (properties.AUDIO_AS)
			{
				UP.AUDIO_AS = properties.AUDIO_AS.value;
			}
			if (properties.AUDIO_SM)
			{
				UP.AUDIO_SM = properties.AUDIO_SM.value;
			}
			if (properties.AUDIO_SM_Mode)
			{
				UP.AUDIO_SM_Mode = properties.AUDIO_SM_Mode.value;
			}
			if (properties.AUDIO_SM_SMA)
			{
				UP.AUDIO_SM_SMA = properties.AUDIO_SM_SMA.value;
			}
			if (properties.AUDIO_VC_Mode)
			{
				UP.AUDIO_VC_Mode = properties.AUDIO_VC_Mode.value;
			}
			if (properties.AUDIO_VC_Manual)
			{
				UP.AUDIO_VC_Manual = properties.AUDIO_VC_Manual.value;
			}
			if (properties.AUDIO_Median)
			{
				UP.AUDIO_Median = properties.AUDIO_Median.value;
			}
			if (properties.AUDIO_adm)
			{
				UP.AUDIO_adm = properties.AUDIO_adm.value;
			}
			//EXPERIMENTAL
			if (properties.EXP_fpsCap)
			{
				UP.EXP_fpsCap = properties.EXP_fpsCap.value; 
				createjs.Ticker.setFPS(UP.EXP_fpsCap+1);
			}
			if (properties.EXP_alpha)
			{
				UP.EXP_param_Alpha = properties.EXP_alpha.value;
			}
			if (properties.EXP_beta)
			{
				UP.EXP_param_Beta = properties.EXP_beta.value;
			}
			if (properties.EXP_sl4)
			{
				UP.EXP_sl4 = properties.EXP_sl4.value;
			}
			if (properties.EXP_debuginfo)
			{
				UP.EXP_debuginfo = properties.EXP_debuginfo.value;
			}
			if (properties.EXP_fpsonly)
			{
				UP.EXP_fpsonly = properties.EXP_fpsonly.value;
			}
			if (properties.EXP_loadscrbool)
			{
				UP.EXP_loadscrbool = properties.EXP_loadscrbool.value;
			}
			if (properties.EXP_action1)
			{
				UP.EXP_action1 = properties.EXP_action1.value;
			}
			firstCalling = false;
			exceptionFlag2 = 0;
		}
	};
	
	var updateConst = function()
	{                                                                          //UPDATECONST
		parentWidth = window.innerWidth;
		parentHeight = window.innerHeight;
	}
	var loadScr = function()
	{                                                                          //LOADSCR
		loadr += 1*aniMod/2;
		if(UP.EXP_loadscrbool)
		{
			loadr = 400;
			elem1.style.opacity = 0;
			elem1.style.display = 'none';
		}
		else
		{
			if(loadr >= 150) elem1.style.opacity = (250-loadr)/100;
			else elem1.style.opacity = 1;
			if(loadr > 250)
			{
				elem1.style.display = 'none';
				loadr = 400;
			}
		}
		if(loadr == 400) clearInterval(loadscr);
	}
	
	var slideshowController = function(command)
	{                                                                          //SLIDESHOWCONTROLLER
		if(command == 'start' && WE_paused == false)
		{
			if(UP.BG_SS_Delay == 1) SS_duration = 5000;          //5s
			else if(UP.BG_SS_Delay == 2) SS_duration = 10000;    //10s
			else if(UP.BG_SS_Delay == 3) SS_duration = 15000;    //15s
			else if(UP.BG_SS_Delay == 4) SS_duration = 20000;    //20s
			else if(UP.BG_SS_Delay == 5) SS_duration = 30000;    //30s
			else if(UP.BG_SS_Delay == 6) SS_duration = 60000;    //1m
			else if(UP.BG_SS_Delay == 7) SS_duration = 120000;   //2m
			else if(UP.BG_SS_Delay == 8) SS_duration = 180000;   //3m
			else if(UP.BG_SS_Delay == 9) SS_duration = 300000;   //5m
			else if(UP.BG_SS_Delay == 10) SS_duration = 600000;  //10m
			else if(UP.BG_SS_Delay == 11) SS_duration = 900000;  //15m
			else if(UP.BG_SS_Delay == 12) SS_duration = 1200000; //20m
			else if(UP.BG_SS_Delay == 13) SS_duration = 1800000; //30m
			else if(UP.BG_SS_Delay == 14) SS_duration = 3600000; //1h
			else if(UP.BG_SS_Delay == 15) SS_duration = 7200000; //2h
			else if(UP.BG_SS_Delay == 16) SS_duration = 10800000;//3h
			else if(UP.BG_SS_Delay == 17) SS_duration = 18000000;//5h
			else if(UP.BG_SS_Delay == 18) SS_duration = 86400000;//24h
			else SS_duration = 30000; //30s - default
			clearInterval(slidechanger);
			if(UP.BG_folder == "-unknown-")
			{
				exceptionFlag3 = 2;
				UP.BG_image = UP.BG_image_RESERVED;
				bgcheck();
				SS_slidesNum = 0;
			}
			else
			{
				exceptionFlag3 = 3;
				slidechanger = setInterval(nextRandomImage, SS_duration);
			}
		}
		if(command == 'stop')
		{
			clearInterval(slidechanger);
			exceptionFlag3 = 0;
			SS_slidesNum = 0;
		}
	}
	
	function nextRandomImage()
	{                                                                          //NEXTRANDOMIMAGE
		window.wallpaperRequestRandomFileForProperty('BG_folder', getImage);
	}
    
	function getImage(property, path)
	{                                                                          //GETIMAGE
		exceptionFlag3 = 3;
		if(path == '' || path == undefined)
		{
			exceptionFlag1 == 1;
			exceptionFlag3 = 2;
			UP.BG_image = UP.BG_image_RESERVED;
			SS_slidesNum = 0;
		}
		else UP.BG_image = 'file:///' + path;
		bgcheck();
	}

	var init = function()
	{                                                                          //INIT
		elem1 = document.getElementById('loadscr');
		loadScrI = setInterval(loadScr, 30);
		updateConst();
		//ПОДГОТОВКА ХОЛСТОВ
		canv0 = document.getElementById('canvas0');
		canv1 = document.getElementById('canvas1');
		canv2 = document.getElementById('canvas2');
		canv3 = document.getElementById('canvas3');
		canv4 = document.getElementById('canvas4');
		dcanv = document.getElementById('debug_canvas');
		ctx0 = canv0.getContext('2d');
		ctx1 = canv1.getContext('2d');
		ctx2 = canv2.getContext('2d');
		ctx3 = canv3.getContext('2d');
		ctx4 = canv4.getContext('2d');
		dctx = dcanv.getContext('2d');
		for (var i = 0; i < 512/16; i++) 
		{
			bSummable[i] = 0;
		}
		//ЗАПУСК ОБРАБОТКИ
		_.AudioPreparation();
		for(var i = 0; i < b_graph.length; i++)
		{
			b_graph[i] = 0;
			d_graph[i] = 0;
		}
		//ПОДГОТОВКА КОНТЕЙНЕРОВ
		audp = document.getElementById('AudioCanvasParent');
		bgg = document.getElementById('backgroup');
		bglayers[0] = document.getElementById('backg1');
		bglayers[1] = document.getElementById('backg2');
		bglayers[2] = document.getElementById('backg3');
		bglayers[3] = document.getElementById('backg4');
		bglayers[4] = document.getElementById('backg5');
		debug1 = document.getElementById('dbg1');
		debug2 = document.getElementById('dbg2');
		debug3 = document.getElementById('dbg3');
		debug4 = document.getElementById('dbg4');
		debug5 = document.getElementById('dbg5');
		debug6 = document.getElementById('dbg6');
		debug7 = document.getElementById('dbg7');
		//ПОДГОТОВКА ЧАСТИЦ
		fl = parentWidth/pzoom;
		respawnParticlesInit();
		//ПРЕРЕНДЕР ПЛИТОК ДЛЯ СТИЛЯ ФОНА
		tiles = redraw_tiles(parentWidth, parentHeight);
		//РЕНДЕР
        createjs.Ticker.removeEventListener("tick", _.mainDRAW);
		createjs.Ticker.removeEventListener("tick", _.particlesDRAW);
		createjs.Ticker.removeEventListener("tick", _.debugDRAW);
		createjs.Ticker.removeEventListener("tick", FinalAudioDataCorrection);
		createjs.Ticker.framerate = UP.EXP_fpsCap;
		createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
		createjs.Ticker.addEventListener("tick", _.mainDRAW);
		createjs.Ticker.addEventListener("tick", _.particlesDRAW);
		createjs.Ticker.addEventListener("tick", _.debugDRAW);
		createjs.Ticker.addEventListener("tick", FinalAudioDataCorrection);
		//ПОДГОТОВКА ФОНА
		if(UP.BG_type == 1) bgcheck();
		else if(UP.BG_type == 2) 
		{
			nextRandomImage();
			slideshowController('start');
		}
		bgrebuilding('full');
		initIsComplete = true;
    }
	
	function bgrebuilding(mode) 
	{                                                                          //BGREBUILDING
		rebuildStatus = 1;
		var rebuildStage = false;
		var imageStage = false;
		var bgFillStage = false;
		if(mode = 'full')
		{
			rebuildStage = true;
			imageStage = true;
			bgFillStage = true;
		}
		else if(mode = 'imageupdate') imageStage = true;
		if(rebuildStage)
		{
			bgg.style.background = "#000";
			canv0.style.display = 'none';
			for (var i = 0; i < bglayers.length; i++) 
			{
				bglayers[i].style.opacity = 1;
				bglayers[i].style.background = 'none';
				bglayers[i].style.backgroundBlendMode = 'normal';
				bglayers[i].style.mixBlendMode = 'normal';
				bglayers[i].style.filter = 'none';
				bglayers[i].style.display = 'none';
				bglayers[i].style.clipPath = 'none';
				bglayers[i].style.transform = "scale(1, 1)";
			}
			if(UP.BG_style == 1)
			{
				bglayers[0].style.display = 'block';
				if(UP.EF_A_Bool)
				{
					bglayers[1].style.display = 'block';
					switch(UP.EF_A_Mode)
					{
						case 1:
							bglayers[0].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.mixBlendMode = 'darken';
							break;
						case 2:
							bglayers[0].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.mixBlendMode = 'darken';
							break;
						case 3:
							bglayers[0].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.mixBlendMode = 'darken';
							break;
						case 4:
							bglayers[2].style.display = 'block';
							bglayers[0].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.backgroundBlendMode = 'lighten';
							bglayers[2].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.mixBlendMode = 'darken';
							bglayers[2].style.mixBlendMode = 'darken';
							break;
						case 5:
							bglayers[2].style.display = 'block';
							bglayers[0].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.backgroundBlendMode = 'lighten';
							bglayers[2].style.backgroundBlendMode = 'lighten';
							bglayers[1].style.mixBlendMode = 'darken';
							bglayers[2].style.mixBlendMode = 'darken';
							break;
						default:
							break;
					}
				}
				else if(UP.EF_D_Bool)
				{
					bgg.style.background = "#fff";
					for (var i = 0; i < bglayers.length; i++) 
					{
						bglayers[i].style.display = 'block';
						bglayers[i].style.backgroundSize = "cover";
						bglayers[i].style.backgroundRepeat = "no-repeat";
						bglayers[i].style.backgroundPosition = "center";
					}
					bglayers[0].style.opacity = 0.99;
					bglayers[1].style.opacity = 0.7;
					bglayers[2].style.opacity = 0.5;
					bglayers[3].style.opacity = 0.3;
					bglayers[4].style.opacity = 0.1;
				}
				else
				{
					for (var i = 0; i < bglayers.length; i++) 
					{
						bglayers[i].style.opacity = 1;
						bglayers[i].style.backgroundBlendMode = 'normal';
						bglayers[i].style.mixBlendMode = 'normal';
						bglayers[i].style.filter = 'none';
						bglayers[i].style.display = 'none';
						bglayers[i].style.clipPath = 'none';
					}
					bglayers[0].style.display = 'block';
				}
			}
			else if(UP.BG_style == 2)
			{
				bglayers[0].style.display = 'block';
				bglayers[1].style.display = 'block';
				bglayers[2].style.display = 'block';
				bglayers[0].style.filter = 'blur(5px) brightness(110%)';
				bglayers[1].style.clipPath = 'circle('+0.89*parentWidth/2+'px at center)';
				bglayers[1].style.filter = 'blur(0px) brightness(150%)';
				bglayers[2].style.clipPath = 'circle('+0.87*parentWidth/2+'px at center)';
			}
			else if(UP.BG_style == 3)
			{
				bglayers[0].style.display = 'block';
				canv0.style.display = 'block';
			}
			scaleChanger();
		}
		if(imageStage)
		{
			if(UP.BG_style == 1)
			{
				if(UP.EF_A_Bool)
				{
					switch(UP.EF_A_Mode)
					{
						case 1:
							bglayers[0].style.background = 'url(' + UP.BG_image + '), cyan';
							bglayers[1].style.background = 'url(' + UP.BG_image + '), red';
							break;
						case 2:
							bglayers[0].style.background = 'url(' + UP.BG_image + '), magenta';
							bglayers[1].style.background = 'url(' + UP.BG_image + '), green';
							break;
						case 3:
							bglayers[0].style.background = 'url(' + UP.BG_image + '), yellow';
							bglayers[1].style.background = 'url(' + UP.BG_image + '), blue';
							break;
						case 4:
							bglayers[0].style.background = 'url(' + UP.BG_image + '), red';
							bglayers[1].style.background = 'url(' + UP.BG_image + '), green';
							bglayers[2].style.background = 'url(' + UP.BG_image + '), blue';
							break;
						case 5:
							bglayers[0].style.background = 'url(' + UP.BG_image + '), cyan';
							bglayers[1].style.background = 'url(' + UP.BG_image + '), magenta';
							bglayers[2].style.background = 'url(' + UP.BG_image + '), yellow';
							break;
						default:
							break;
					}
				}
				else if(UP.EF_D_Bool)
				{
					for (var i = 0; i < bglayers.length; i++) 
					{
						bglayers[i].style.background = 'url(' + UP.BG_image + ')';
					}
				}
				else
				{
					for (var i = 0; i < bglayers.length; i++) 
					{
						bglayers[i].style.background = 'none';
					}
					bglayers[0].style.background = 'url(' + UP.BG_image + ')';
				}
			}
			else if(UP.BG_style == 2)
			{
				bglayers[0].style.background = 'url(' + UP.BG_image + ')';
				bglayers[1].style.background = 'url(' + UP.BG_image + ')';
				bglayers[2].style.background = 'url(' + UP.BG_image + ')';
			}
			else if(UP.BG_style == 3)
			{
				bglayers[0].style.background = 'url(' + UP.BG_image + ')';
			}
		}
		if(bgFillStage)
		{
			for (var i = 0; i < bglayers.length; i++) 
			{
				bglayers[i].style.backgroundSize = "cover";
				bglayers[i].style.backgroundRepeat = "no-repeat";
				bglayers[i].style.backgroundPosition = "center";
			}
		}
		if(UP.BG_type == 2 && UP.BG_folder != "-unknown-") exceptionFlag3 = 1;
		rebuildStatus = 0;
	}
	
	function scaleChanger()
	{                                                                          //SCALECHANGER
		if(UP.BG_style == 1)
		{
			var scaleA = Math.ceil(UP.EF_A_Intensity/5 + 1);
			var scaleB = Math.ceil(0.8*UP.EF_B_Intensity + 1);
			scaleModifier = 0;
			if(UP.EF_A_Bool) scaleModifier += scaleA;
			if(UP.EF_B_Bool) scaleModifier += scaleB;
			for (var i = 0; i < bglayers.length; i++)
			{
				bglayers[i].style.width = (parentWidth + 2*scaleModifier) + 'px';
				bglayers[i].style.height = (parentHeight + 2*scaleModifier) + 'px';
				bglayers[i].style.top = (-scaleModifier)+'px';
				bglayers[i].style.left = (-scaleModifier)+'px';
			}
		}
		else if(UP.BG_style == 2)
		{
			for (var i = 0; i < bglayers.length; i++)
			{
				bglayers[i].style.width = (parentWidth + 10) + 'px';
				bglayers[i].style.height = (parentHeight + 10) + 'px';
				bglayers[i].style.top = '-5px';
				bglayers[i].style.left = '-5px';
			}
		}
		else if(UP.BG_style == 3)
		{
			bglayers[0].style.width = parentWidth + 'px';
			bglayers[0].style.height = parentHeight + 'px';
			bglayers[0].style.top = '0px';
			bglayers[0].style.left = '0px';
		}
	}

	function bgcheck() 
	{                                                                          //BGCHECK
		exceptionFlag1 = 2;
		var img = new Image();
		img.onload = function()
		{
			exceptionFlag1 = 0;
			imageWidth = img.width;
			imageHeight = img.height;
			if(UP.BG_type == 2) SS_slidesNum += 1;
			bgrebuilding('imageupdate');
		}
		img.onerror = function()
		{
			exceptionFlag1 = 1;
			if(UP.BG_type == 2) exceptionFlag3 = 2;
		}
		img.src = UP.BG_image;
	}
	
	function bgmoving() 
	{                                                                          //BGMOVING
		if(rebuildStatus == 0)
		{
			if(UP.EF_A_Bool && bSum >= (100-UP.EF_A_Sensitivity)/100)
			{
				sseDirection = 2*Math.PI*sseCounter/45;
				sseCounter += bSum/10;
				sseDirection = Math.round(sseDirection*100)/100;
				if(sseCounter >= 45) sseCounter -= 45;
				if(UP.EF_A_Mode == 4 || UP.EF_A_Mode == 5)
				{
					bglayers[0].style.left = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.cos(sseDirection)) + 'px';
					bglayers[1].style.left = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.cos(sseDirection+Math.PI/1.5)) + 'px';
					bglayers[2].style.left = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.cos(sseDirection+2*Math.PI/1.5)) + 'px';
					bglayers[0].style.top = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.sin(sseDirection)) + 'px';
					bglayers[1].style.top = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.sin(sseDirection+Math.PI/1.5)) + 'px';
					bglayers[2].style.top = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.sin(sseDirection+2*Math.PI/1.5)) + 'px';
				}
				else if(UP.EF_A_Mode == 1 || UP.EF_A_Mode == 2 || UP.EF_A_Mode == 3)
				{
					bglayers[0].style.left = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.cos(sseDirection+Math.PI)) + 'px';
					bglayers[1].style.left = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.cos(sseDirection)) + 'px';
					bglayers[0].style.top = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.sin(sseDirection+Math.PI)) + 'px';
					bglayers[1].style.top = (-scaleModifier + (bSum*UP.EF_A_Intensity/5)*Math.sin(sseDirection)) + 'px';
				}
			}
			else if(UP.EF_D_Bool)
			{
				for (var i = 0; i < bglayers.length; i++) 
				{
					bglayers[i].style.transform = "scale(" + (1+i*bSum*UP.EF_D_Intensity/500) + ", " + (1+i*bSum*UP.EF_D_Intensity/500) + ")";
				}
			}
			else
			{
				for (var i = 0; i < bglayers.length; i++) 
				{
					bglayers[i].style.transform = "scale(1, 1)";
					bglayers[i].style.left = -scaleModifier + 'px';
					bglayers[i].style.top = -scaleModifier + 'px';
				}
			}
		}
	}
	
    _.AudioPreparation = function()
	{                                                                          //AUDIOPREPARATION
        if (window.wallpaperRegisterAudioListener && !WE_paused) 
		{
            window.wallpaperRegisterAudioListener(function(data) 
			{
                newaudioS = AudioDataCorrection(data);
                if (audioS.length == newaudioS.length)
				{
                    createjs.Tween.get(audioS, {
                        override: true
                    }).to(newaudioS, 40);
                }
				else
				{
                    audioS = newaudioS;
                }
            });
        } 
		else
		{
            console.log("Источник звука window.wallpaperRegisterAudioListener не обнаружен.");
        }
    }

    function AudioDataCorrection(data) 
	{                                                                          //AUDIODATACORRECTION
		if(!WE_paused)
		{
			//Коррекция "розовым" шумом / компенсирующими коэффициентами
			if(UP.AUDIO_PNC) data = PN_Correction(data, pinkNoise);
			//Инверсия
			if(UP.AUDIO_SI != 1) data = spectrumInvertor(data, UP.AUDIO_SI);
			//Смена положения каналов
			if(UP.AUDIO_Swap)
			{
				var leftD = data.slice(0, data.length/2);
				var rightD = data.slice(data.length/2);
				data = rightD.concat(leftD);
			}
			//изменение размера массива (128 => 64, 256, 512)
			data = AS_Changer(data, maxADSize);
			//Акцентирование
			if(UP.AUDIO_AA) data = accentuate(data, UP.AUDIO_AA_Mode);
			//Отсечение медианой
			if(UP.AUDIO_Median)
			{
				var res = MClipping(data, UP.AUDIO_adm);
				data = res.data;
				median = res.m;
			}
			//Вычисление максимума
			audioMaxV = 0;
			powerS = 0;
			for (var i = 0; i < data.length; i++) 
			{		
				if(data[i] > audioMaxV) audioMaxV = data[i];
				powerS += data[i];
			}
			//Компенсация громкости / изменений масштаба после предыдущей обработки
			if(UP.AUDIO_VC_Mode == 1)
			{
				if(audioMaxV > 0.1) audioPeakV = audioPeakV*0.5 + audioMaxV*0.5;
				else audioPeakV = 0.1;
				powerS = 0;
			}
			else if(UP.AUDIO_VC_Mode == 2)
			{
				if(audioMaxV * 0.1 > audioPeakV * 0.1) audioPeakV = audioPeakV * 0.2 + audioMaxV * 0.8;
				else audioPeakV = audioPeakV * 0.99 + audioMaxV * 0.01;
				if(audioPeakV < 0.1) audioPeakV = 0.1;
			}
			else if(UP.AUDIO_VC_Mode == 3) audioPeakV = UP.AUDIO_VC_Manual/10;
			for(var i = 0; i < data.length; i++)
			{
				if(data[i] > audioPeakV) data[i] = audioPeakV;
				data[i] /= audioPeakV;
				powerS += data[i];
			}
			//Вычисление bSum
			bSum = bSumCalc(data, prevbSum, UP.AUDIO_SI, UP.AUDIO_Swap);
			prevbSum = bSum;
			if(bSum > 1) bSum = 1;
			b_graph.pop();
			b_graph.unshift(bSum);
			var b_min = Math.min(b_graph[0],b_graph[1]);
			var b_max = Math.max(b_graph[0],b_graph[1]);
			var b_res = Math.abs(b_max - b_min);
			if(b_res < d_graph[0]) b_res = d_graph[0]*0.7 + b_res*0.3;
			else b_res = d_graph[0]*0.2 + b_res*0.8;
			d_graph.pop();
			d_graph.unshift(b_res);
			return data;
		}
    }
	
	function FinalAudioDataCorrection()
	{
		//Smooth recession
		if(UP.AUDIO_SM)
		{
			for(var i = 0; i < maxADSize; i++)
			{
				if(UP.AUDIO_SM_Mode == 1)
					if(audioS[i] < audioS_prev[i])
					{
						if(audioSF[i] > 0.05) audioSF[i] = audioSF_prev[i]-0.05;
					}
					else audioSF[i] = audioS[i];
				if(UP.AUDIO_SM_Mode == 2)
					if(audioS[i] < audioS_prev[i])
					{
						if(audioS[i] > audioS_prev[i]*0.5) audioSF[i] = audioSF_prev[i];
						else if(audioS[i] > audioS_prev[i]*0.3) audioSF[i] = audioSF_prev[i]*0.9;
						else audioSF[i] = audioSF_prev[i]*0.5;
					}
					else audioSF[i] = audioS[i];
				if(UP.AUDIO_SM_Mode == 3)
					audioSF[i] = audioSF_prev[i]*UP.EXP_param_Alpha/100 + audioS[i]*(1-UP.EXP_param_Alpha/100);
				if(UP.AUDIO_SM_Mode == 4 || UP.AUDIO_SM_Mode == 5)
				{
					if(data_SMA[i].length != UP.AUDIO_SM_SMA)
					{
						data_SMA[i].length = 0;
						for(var j = 0; j < UP.AUDIO_SM_SMA; j++)
						{
							data_SMA[i][j] = 0;
						}
						audioSF_prev[i] = 0;
					}
					if(UP.AUDIO_SM_Mode == 4)
					{
						var temp = 0;
						data_SMA[i].pop();
						data_SMA[i].unshift(audioS[i]);
						for(var j = 0; j < UP.AUDIO_SM_SMA; j++)
						{
							temp += data_SMA[i][j];
						}
						audioSF[i] = temp/UP.AUDIO_SM_SMA;
					}
					if(UP.AUDIO_SM_Mode == 5)
					{
						var temp = 0;
						data_SMA[i].pop();
						data_SMA[i].unshift(audioS[i]);
						audioSF[i] = audioSF_prev[i] + (data_SMA[i][0] - data_SMA[i][UP.AUDIO_SM_SMA-1])/UP.AUDIO_SM_SMA;
					}
				}
				if(UP.AUDIO_SM_Mode == 6)
				{
					audioSF[i] = (audioSF_prev[i] + trend_prev[i])*UP.EXP_param_Alpha/100 + (1-UP.EXP_param_Alpha/100)*audioS[i];
					trend[i] = (audioSF[i] - audioSF_prev[i]) + (1-UP.EXP_param_Beta/100)*trend_prev[i];
				}
				if(audioSF[i] < 0.0001) audioSF[i] = 0;
			}
			for(var i = 0; i < maxADSize; i++)
			{
				audioS_prev[i] = audioS[i];
				audioSF_prev[i] = audioSF[i];
				if(UP.AUDIO_SM_Mode == 6) trend_prev[i] = trend[i];
			}
		}
		else
		{
			for(var i = 0; i < maxADSize; i++)
			{
				audioSF[i] = audioS[i];
			}
		}
		//Post-processing
		if(UP.AUDIO_PP)
		{
			if(UP.VISUAL_geometry == 1)
			{
				if (UP.AUDIO_PP_MS == 1) audioR = PP(maxADSize, audioSF, 'full', UP.AUDIO_PP_CN, 1, 2);
				if (UP.AUDIO_PP_MS == 2) audioR = PP2(maxADSize, audioSF, 'full', UP.AUDIO_PP_CN, 1, 2, 3);
				if (UP.AUDIO_PP_MS == 3) audioR = PP3(maxADSize, audioSF, 'full', UP.AUDIO_PP_CN, 1, 2, 3, 4);
			}
			if(UP.VISUAL_geometry == 2)
			{
				if (UP.AUDIO_PP_MS == 1) audioR = PP(maxADSize, audioSF, 'inside', UP.AUDIO_PP_CN, 1, 2);
				if (UP.AUDIO_PP_MS == 2) audioR = PP2(maxADSize, audioSF, 'inside', UP.AUDIO_PP_CN, 1, 2, 3);
				if (UP.AUDIO_PP_MS == 3) audioR = PP3(maxADSize, audioSF, 'inside', UP.AUDIO_PP_CN, 1, 2, 3, 4);
			}
		}
		else
		{
			for(var i = 0; i < maxADSize; i++)
			{
				audioR[i] = audioSF[i];
			}
		}
		//Cropping
		var audioRT = AS_Cropper(audioR, UP.AUDIO_AS);
		audioR.length = UP.AUDIO_AS;
		for(var i = 0; i < UP.AUDIO_AS; i++)
		{
			audioR[i] = audioRT[i];
		}
	}
	
	function onWindowResized() 
	{                                                                          //ONWINDOWRESIZED
		if(!initIsComplete)
		{
			$("#canvas0").attr({
				width: $(document).width(),
				height: $(document).height()
			});
			$("#canvas1").attr({
				width: $(document).width(),
				height: $(document).height()
			});
			$("#canvas2").attr({
				width: $(document).width(),
				height: $(document).height()
			});
			$("#canvas3").attr({
				width: $(document).width(),
				height: $(document).height()
			});
			$("#canvas4").attr({
				width: $(document).width(),
				height: $(document).height()
			});
		}
		else
		{
			updateConst();
			bgrebuilding('full');
			canv0.width = parentWidth;
			canv0.height = parentHeight;
			canv1.width = parentWidth;
			canv1.height = parentHeight;
			canv2.width = parentWidth;
			canv2.height = parentHeight;
			canv3.width = parentWidth;
			canv3.height = parentHeight;
			canv4.width = parentWidth;
			canv4.height = parentHeight;
		}
	}
	
    _.mainDRAW = function() 
	{                                                                          //MAIN_DRAW
		if(!WE_paused)
		{
			//if (!window.wallpaperRegisterAudioListener) AlternativeFFT();
			createjs.Ticker.framerate = UP.EXP_fpsCap;
			//FPS
			currT = performance.now();
			aniMod = Math.min((currT - prevT), 1000)/10;
			aFPS = 1000/(currT - prevT);
			aFPS = Math.round(prevaFPS*0.99 + aFPS*0.01);
			prevT = currT;
			prevaFPS = aFPS;
			fpsC += 1;
			//ОЧИСТКА ХОЛСТОВ и др.
			if(UP.BG_style == 3)
			{
				canv0.style.transform = "translateZ(0px)";
				canv0.width = canv0.width;
			}
			canv1.style.transform = "translateZ(0px)";
			canv4.style.transform = "translateZ(0px)";
			canv1.width = canv1.width;
			canv4.width = canv4.width;
			cX = parentWidth/2 + parentWidth/2 * UP.VISUAL_pX/100;
			cY = parentHeight/2 + parentHeight/2 * UP.VISUAL_pY/100;
			rad = parentWidth/2 * UP.VISUAL_circleRad/100;
			if(UP.VISUAL_colorType == 1)
			{
				mode2gradient = ctx1.createRadialGradient(cX, cY, rad-5, cX, cY, rad);
				mode2gradient.addColorStop(0, "rgba("+UP.VISUAL_colC+",0)");
				mode2gradient.addColorStop(1, "rgba("+UP.VISUAL_colC+","+UP.VISUAL_colO/100+")");
				ctx1.fillStyle = mode2gradient;
			}
			//СВЕЧЕНИЕ
			if(UP.VISUAL_colBlurS != 0) ctx1.filter = 'drop-shadow(0 0 '+UP.VISUAL_colBlurS+'px '+UP.VISUAL_colBlurC+') drop-shadow(0 0 '+UP.VISUAL_colBlurS+'px '+UP.VISUAL_colBlurC+')';
			else ctx1.filter = 'none';
			//ВИЗУАЛИЗАЦИЯ
			switch(UP.VISUAL_style)
			{
				case 1:	
					if(UP.VISUAL_geometry == 1)
					{
						var cLength = 2*Math.PI*UP.VISUAL_circleLength/360;
						var a = 2*Math.PI*UP.VISUAL_startAngle/360;
						ctx1.moveTo(cX, cY);
						for(var i = 0; i < UP.AUDIO_AS; ++i)
						{
							ctx1.arc(cX, cY, rad + UP.VISUAL_colMax * audioR[i], i/UP.AUDIO_AS*cLength + a, (i+1)/UP.AUDIO_AS*cLength + a, false);
						}
						ctx1.lineTo(cX, cY);
						ctx1.fill();
					}
					break;
				case 2:
					GE = geometryX(UP.AUDIO_AS, parentWidth, parentHeight, UP.VISUAL_circleRad, UP.VISUAL_colMax, audioR, UP.VISUAL_geometry, UP.VISUAL_pX, UP.VISUAL_pY, UP.VISUAL_startAngle, UP.VISUAL_circleLength, UP.VISUAL_gaps, UP.VISUAL_style);
					ctx1.lineWidth = UP.VISUAL_colW;
					ctx1.strokeStyle = "rgba("+UP.VISUAL_colC+","+UP.VISUAL_colO/100+")";
					ctx1.lineCap = UP.VISUAL_colCap;
					ctx1.beginPath();
					for(var i = 0; i < UP.AUDIO_AS; ++i)
					{
						ctx1.moveTo(GE.bX[i], GE.bY[i]);
						ctx1.lineTo(GE.eX[i], GE.eY[i]);
					}
					ctx1.stroke();
					break;
				case 3:
					GE = geometryX(UP.AUDIO_AS, parentWidth, parentHeight, UP.VISUAL_circleRad, UP.VISUAL_colMax, audioR, UP.VISUAL_geometry, UP.VISUAL_pX, UP.VISUAL_pY, UP.VISUAL_startAngle, UP.VISUAL_circleLength, UP.VISUAL_gaps, UP.VISUAL_style); 
					ctx1.beginPath();
					if(UP.VISUAL_geometry == 1)
					{
						ctx1.moveTo(GE.cXY[0], GE.cXY[1]);
						ctx1.lineTo(GE.eX[0], GE.eY[0]);
						for(var i = 0; i < UP.AUDIO_AS; ++i)
						{
							if(i == UP.AUDIO_AS-1 && UP.VISUAL_circleLength == 360) ctx1.lineTo(GE.eX[0], GE.eY[0]);
							else ctx1.lineTo(GE.eX[i+1], GE.eY[i+1]);
						}
						ctx1.lineTo(GE.cXY[0], GE.cXY[1]);
					}
					else if(UP.VISUAL_geometry == 2)
					{
						ctx1.fillStyle = "rgba("+UP.VISUAL_colC+","+UP.VISUAL_colO/100+")";
						ctx1.moveTo(GE.cXY[0], GE.cXY[1]);
						ctx1.lineTo(GE.bX[0], GE.bY[0]);
						for(var i=0; i<UP.AUDIO_AS; ++i)
						{
							ctx1.lineTo(GE.eX[i], GE.eY[i]);
						}
						ctx1.lineTo(GE.bX[UP.AUDIO_AS-1], GE.bY[UP.AUDIO_AS-1]);
						ctx1.lineTo(GE.cXY[0], GE.cXY[1]);
					}
					ctx1.fill();
					break;
				case 4:
					GE = geometryX(UP.AUDIO_AS, parentWidth, parentHeight, UP.VISUAL_circleRad, UP.VISUAL_colMax, audioR, UP.VISUAL_geometry, UP.VISUAL_pX, UP.VISUAL_pY, UP.VISUAL_startAngle, UP.VISUAL_circleLength, UP.VISUAL_gaps, UP.VISUAL_style);
					ctx1.lineWidth = UP.VISUAL_colW;
					ctx1.lineJoin = "round";
					ctx1.strokeStyle = "rgba("+UP.VISUAL_colC+","+UP.VISUAL_colO/100+")";
					ctx1.beginPath();
					ctx1.moveTo(GE.eX[0], GE.eY[0]);
					for(var i = 1; i < UP.AUDIO_AS; ++i)
					{
						ctx1.lineTo(GE.eX[i], GE.eY[i]);
					}
					if(UP.VISUAL_geometry == 1 && UP.VISUAL_circleLength == 360) ctx1.lineTo(GE.eX[0], GE.eY[0]);
					ctx1.stroke();
					break;
				case 5:
					GE = geometryX(UP.AUDIO_AS, parentWidth, parentHeight, UP.VISUAL_circleRad, UP.VISUAL_colMax, audioR, UP.VISUAL_geometry, UP.VISUAL_pX, UP.VISUAL_pY, UP.VISUAL_startAngle, UP.VISUAL_circleLength, UP.VISUAL_gaps, UP.VISUAL_style);
					ctx1.fillStyle = "rgba("+UP.VISUAL_colC+","+UP.VISUAL_colO/100+")";
					ctx1.beginPath();
					for(var i = 0; i < UP.AUDIO_AS; ++i)
					{
						ctx1.moveTo(GE.eX[i], GE.eY[i]);
						ctx1.arc(GE.eX[i], GE.eY[i], UP.VISUAL_colW/2, 0, 2*Math.PI);
					}
					ctx1.fill();
					break;
				default:
					break;
			}
			//ЭФФЕКТЫ ФОНА
			if(UP.BG_style == 1) 
			{
				bgmoving();
				if(UP.EF_B_Bool && bSum >= (100-UP.EF_B_Sensitivity)/100) bgg.style.filter = 'blur('+Math.round(bSum*UP.EF_B_Intensity/3)+'px)';
				else bgg.style.filter = 'none';
				if(UP.EF_SH_Bool)
				{
					bgg.style.transform = "scale("+(parentWidth+20)/parentWidth+", "+(parentHeight+20)/parentHeight+")";
					bgmPoint.sx = (100*bSum)*Math.cos(bgmPoint.sa);
					bgmPoint.sy = (100*bSum)*Math.sin(bgmPoint.sa);
					bgmPoint.x += bgmPoint.sx;
					bgmPoint.y += bgmPoint.sy;
					if(bgmPoint.x > 25 && Math.cos(bgmPoint.sa) > 0)
					{
						bgmPoint.sa = Math.PI - bgmPoint.sa + 2*Math.random()-1;
						bgmPoint.x = 25;
					}
					if(bgmPoint.x < -25 && Math.cos(bgmPoint.sa) < 0) 
					{
						bgmPoint.sa = Math.PI - bgmPoint.sa + 2*Math.random()-1;
						bgmPoint.x = -25;
					}
					if(bgmPoint.y > 25 && Math.sin(bgmPoint.sa) > 0) 
					{
						bgmPoint.sa = 2*Math.PI - bgmPoint.sa + 2*Math.random()-1;
						bgmPoint.y = 25;
					}
					if(bgmPoint.y < -25 && Math.sin(bgmPoint.sa) < 0) 
					{
						bgmPoint.sa = 2*Math.PI - bgmPoint.sa + 2*Math.random()-1;
						bgmPoint.y = -25;
					}
					if(bgmPoint.x > 25) bgmPoint.x = 25;
					if(bgmPoint.x < -25) bgmPoint.x = -25;
					if(bgmPoint.y > 25) bgmPoint.y = 25;
					if(bgmPoint.y < -25) bgmPoint.y = -25;
					bgg.style.top = UP.EF_SH_Intensity*bgmPoint.y/200 + 'px';
					bgg.style.left = UP.EF_SH_Intensity*bgmPoint.x/200 + 'px';
				}
				else
				{
					bgg.style.transform = "scale(1, 1)";
					bgmPoint.x = 0;
					bgmPoint.y = 0;
					bgg.style.top = 0;
					bgg.style.left = 0;
				}
			}
			else if(UP.BG_style == 2)
			{
				bgg.style.filter = 'none';
				if(UP.EF_PUL_Bool)
				{
					bglayers[1].style.transform = "scale("+(1+bSum*UP.EF_PUL_Intensity/950)+", "+(1+bSum*UP.EF_PUL_Intensity/950)+")";
					bglayers[2].style.transform = "scale("+(1+bSum*UP.EF_PUL_Intensity/950)+", "+(1+bSum*UP.EF_PUL_Intensity/950)+")";
				}
				else
				{
					bglayers[1].style.transform = "scale(1, 1)";
					bglayers[2].style.transform = "scale(1, 1)";
				}
				bglayers[1].style.filter = 'blur(0px) brightness('+(120+bSum*300)+'%)';
			}
			else if(UP.BG_style == 3)
			{
				canv0.style.mixBlendMode = 'soft-light';
				var temp = 0;
				var temp2 = 0;
				for(var i = 0; i < tiles.mount; ++i)
				{
					var color = Math.floor(tiles.curColor[i]);
					var t1 = Math.floor(color/10);
					var t2 = color - t1*10;
					ctx0.imageSmoothingEnabled = false;
					ctx0.drawImage(tiles.textures[t1], 10*t2, 0, 10, 10, 50*(i-temp2), 50*temp, 50, 50);
					if((i-temp2)*50 > parentWidth)
					{
						temp += 1;
						temp2 = i+1;
					}
					tiles.curColor[i] += tiles.speed[i]*aniMod;
					if(tiles.curColor[i] > 99)
					{
						tiles.curColor[i] = 99;
						tiles.speed[i] = -tiles.speed[i];
					}
					else if(tiles.curColor[i] < 0)
					{
						tiles.curColor[i] = 0;
						tiles.speed[i] = -tiles.speed[i];
					}
				}
			}
		}
    }
	_.particlesDRAW = function() 
	{                                                                          //PARTICLES_DRAW
		//ОТРИСОВКА И ДВИЖЕНИЕ ЧАСТИЦ
		if(UP.DUST_Bool && !WE_paused && particlesIsSpawned)
		{
			canv2.style.mixBlendMode = 'none';
			canv2.style.display = 'block';
			canv2.style.transform = "translateZ(0px)";
			canv2.width = canv2.width;
			ctx2.globalCompositeOperation = 'source-over';
			var lbSum = Math.pow(d_graph[0]*2+bSum, 0.8);
			maxR = Math.sqrt(parentWidth*parentWidth + parentHeight*parentHeight)/2;
			for(var i=0; i < particles.length; i++)
			{
				if(UP.DUST_Direction == 1)
				{
					var c = Math.ceil(bufAmount*(particles[i].r-50)/50);
					ctx2.drawImage(particleSource, bufSize*(bufAmount-1-c), 0, bufSize, bufSize, particles[i].x - particles[i].r, particles[i].y - particles[i].r, 2*particles[i].r, 2*particles[i].r);
					var ra = particles[i].s*(1+lbSum*2)*aniMod;
					particles[i].x += ra*Math.cos(particles[i].a);
					particles[i].y += ra*Math.sin(particles[i].a);
					if(particles[i].x > parentWidth + particles[i].r)
					{
						particles[i].x = 0 - particles[i].r;
						particles[i].y = Math.random()*parentHeight;
					}
					if(particles[i].x < 0 - particles[i].r)
					{
						particles[i].x = parentWidth + particles[i].r;
						particles[i].y = Math.random()*parentHeight;
					}
					if(particles[i].y > parentHeight + particles[i].r)
					{
						particles[i].y = 0 - particles[i].r;
						particles[i].x = Math.random()*parentWidth;
					}
					if(particles[i].y < 0 - particles[i].r)
					{
						particles[i].y = parentHeight + particles[i].r;
						particles[i].x = Math.random()*parentWidth;
					}
				}
				else if(UP.DUST_Direction == 2 || UP.DUST_Direction == 3)
				{
					var curR = Math.sqrt(Math.pow((parentWidth/2 - particles[i].x), 2) + Math.pow((parentHeight/2 - particles[i].y), 2));
					//var curR = maxR*particles[i].pr;
					var c = Math.floor(bufAmount*curR/maxR);
					ctx2.drawImage(particleSource, bufSize*(bufAmount-1-c), 0, bufSize, bufSize, particles[i].x - particles[i].r, particles[i].y - particles[i].r, 2*particles[i].r, 2*particles[i].r);
					var ra = particles[i].s*(0.5+lbSum*lbSum*10)*curR/maxR*aniMod/5;
					if(UP.DUST_Direction == 2)
					{
						particles[i].x = parentWidth/2 + (curR + ra)*Math.cos(particles[i].a);
						particles[i].y = parentHeight/2 + (curR + ra)*Math.sin(particles[i].a);
						if(curR > maxR)
						{
							particles[i].a = 2*Math.PI*Math.random();
							particles[i].x = parentWidth/2 + (curR - 0.95 * maxR) * Math.cos(particles[i].a);
							particles[i].y = parentHeight/2 + (curR - 0.95 * maxR) * Math.sin(particles[i].a);
						}
					}
					if(UP.DUST_Direction == 3)
					{
						particles[i].x = parentWidth/2 + (curR - ra)*Math.cos(particles[i].a);
						particles[i].y = parentHeight/2 + (curR - ra)*Math.sin(particles[i].a);
						if(curR < maxR * 0.05)
						{
							particles[i].a = 2*Math.PI*Math.random();
							particles[i].x = parentWidth/2 + (curR + 0.95 * maxR) * Math.cos(particles[i].a);
							particles[i].y = parentHeight/2 + (curR + 0.95 * maxR) * Math.sin(particles[i].a);
						}
					}
					particles[i].pr = curR;
					
				}
				else if(UP.DUST_Direction == 4)
				{
					
				}
				particles[i].a += aniMod*UP.DUST_Rotation*(1+d_graph[0]*100)*(1-curR/maxR)/5000;
				if(WE_paused) break;
			}
			//ЗАЛИВКА ЧАСТИЦ
			if(UP.DUST_Direction == 2 || UP.DUST_Direction == 3)
			{
				var dg2 = ctx2.createRadialGradient(parentWidth/2, parentHeight/2, 0, parentWidth/2, parentHeight/2, maxR);
				dg2.addColorStop(0.1, "rgba(255,255,255,0)");
				dg2.addColorStop(0.3, "rgba(255,255,255,1)");
				dg2.addColorStop(0.99, "rgba(255,255,255,1)");
				dg2.addColorStop(1, "rgba(255,255,255,0)");
				ctx2.fillStyle = dg2;
			}
			ctx2.globalCompositeOperation = 'source-in';
			ctx2.fillRect(0,0,parentWidth,parentHeight);
			if(UP.DUST_FillType == 1)
			{
				ctx2.fillStyle = UP.DUST_Color;
			}
			else if(UP.DUST_FillType == 2)
			{
				ctx2.fillStyle = "hsl("+dustC+",100%,50%)";
				dustC += UP.DUST_ColorSpeed/10;
				if(dustC > 360) dustC -= 360;
			}
			else if(UP.DUST_FillType == 3 || UP.DUST_FillType == 4)
			{
				if(UP.DUST_FillType == 3)
				{
					dustC = UP.DUST_Hue;
				}
				else if(UP.DUST_FillType == 4)
				{
					dustC += UP.DUST_ColorSpeed/10;
				if(dustC > 360) dustC -= 360;
				}
				var dg = ctx2.createRadialGradient(parentWidth/2, parentHeight/2, 0, parentWidth/2, parentHeight/2, parentWidth/2);
				dg.addColorStop(0, "hsl("+dustC+",100%,50%)");
				dg.addColorStop(0.2, "hsl("+(dustC+25)+",100%,50%)");
				dg.addColorStop(0.4, "hsl("+(dustC+50)+",100%,50%)");
				dg.addColorStop(0.6, "hsl("+(dustC+75)+",100%,50%)");
				dg.addColorStop(0.8, "hsl("+(dustC+100)+",100%,50%)");
				dg.addColorStop(1, "hsl("+(dustC+125)+",100%,50%)");
				ctx2.fillStyle = dg;
			}
			ctx2.fillRect(0,0,parentWidth,parentHeight);
		}
		else
		{
			canv2.style.display = 'none';
		}
	}
	
	function respawnParticlesInit()
	{                                                                          //RESPAWN_PARTICLES_INIT
		particlesIsSpawned = false;
		var pim = new Image();
		pim.onload = function()
		{
			var result = respawnParticles(parentWidth, parentHeight, UP.DUST_Amount, UP.DUST_Direction, UP.DUST_Angle, UP.DUST_Size, bufAmount, UP.DUST_Pattern, pim, fl);
			particleSource = result.buffer;
			particles = result.particles;
		}
		pim.onerror = function()
		{
			if (UP.DUST_Pattern == 99 || UP.DUST_Pattern == 1 || UP.DUST_Pattern == 2 || UP.DUST_Pattern == 3) var result = respawnParticles(parentWidth, parentHeight, UP.DUST_Amount, UP.DUST_Direction, UP.DUST_Angle, UP.DUST_Size, bufAmount, 0, pim, fl);
			else var result = respawnParticles(parentWidth, parentHeight, UP.DUST_Amount, UP.DUST_Direction, UP.DUST_Angle, UP.DUST_Size, bufAmount, UP.DUST_Pattern, pim, fl);
			particleSource = result.buffer;
			particles = result.particles;
		}
		if(UP.DUST_Pattern == 1) pim.src = "data:image/png;base64,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";
		else if(UP.DUST_Pattern == 2) pim.src = "data:image/png;base64,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";
		else if(UP.DUST_Pattern == 3) pim.src = "data:image/png;base64,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";
		else pim.src = UP.DUST_CustomPattern;
		particlesIsSpawned = true;
	}
	
	_.debugDRAW = function() 
	{                                                                          //DEBUG_DRAW
		if(!WE_paused)
		{
			//РАЗМЕТКА
			if(UP.EXP_action1)
			{
				canv3.style.display = 'block';
				canv3.style.transform = "translateZ(0px)";
				canv3.width = canv3.width;
				ctx3.lineWidth = 5;
				ctx3.strokeStyle = "rgb(255,0,0)";
				ctx3.beginPath();
				ctx3.arc(parentWidth/2, parentHeight/2, maxR, 0, 2*Math.PI, false);
				ctx3.stroke();
				ctx3.strokeStyle = "rgb(0,255,0)";
				ctx3.beginPath();
				ctx3.arc(cX, cY, rad, 0, 2*Math.PI, false);
				ctx3.arc(cX, cY, rad+UP.VISUAL_colMax, 0, 2*Math.PI, false);
				ctx3.stroke();
				ctx3.lineWidth = 2;
				ctx3.strokeStyle = "rgb(0,0,255)";
				ctx3.beginPath();
				ctx3.moveTo(parentWidth/2, 0);
				ctx3.lineTo(parentWidth/2, parentHeight);
				ctx3.moveTo(0, parentHeight/2);
				ctx3.lineTo(parentWidth, parentHeight/2);
				ctx3.stroke();
				ctx3.beginPath();
				ctx3.lineWidth = 1;
				ctx3.strokeStyle = "rgb(255,0,255)";
				var columnT = 0, strokeT = 0;
				for(var i=0; i < bufAmount; i++)
				{
					ctx3.rect(columnT*bufSize, strokeT*bufSize, bufSize, bufSize);
					ctx3.drawImage(particleSource, i*bufSize, 0, bufSize, bufSize, columnT*bufSize, strokeT*bufSize, bufSize, bufSize);
					columnT += 1;
					if((columnT+1)*bufSize > parentWidth)
					{
						columnT = 0;
						strokeT += 1;
					}
				}
				ctx3.stroke();
			}
			else
			{
				canv3.style.display = 'none';
			}
			//ОТЛАДОЧНАЯ ИНФОРМАЦИЯ
			debug6.innerHTML = '';
			if(UP.EXP_debuginfo)
			{
				audp.style.visibility = "visible";
				if(UP.EXP_fpsonly)
				{
					audp.style.width = 'auto';
					audp.style.height = 'auto';
					debug1.textContent = '';
					debug2.textContent = '';
					debug3.textContent = '';
					debug4.textContent = '';
					debug5.textContent = '';
					if(!WE_paused) debug1.innerHTML = '<span style="color: red; font-size: 150%;"> &#9658; ' + Math.round(createjs.Ticker.getMeasuredFPS()) + '</span></br>';
					dcanv.style.display = 'none';
				}
				else
				{
					audp.style.width = '500px';
					audp.style.height = '200px';
					debug1.innerHTML = '';
					debug1.textContent = '__________FPS: ' + Math.round(createjs.Ticker.getMeasuredFPS()) + ' Peak: ' + Math.round(audioPeakV*1000)/1000 + ' Max: ' + Math.round(audioMaxV*1000)/1000 + ' BGlen:' + b_graph.length;
					debug2.textContent = '__________ImageSize: ' + imageWidth + ' x ' + imageHeight + ' PowerS: ' + Math.round(powerS) + ' Geom: ' + UP.VISUAL_geometry + ' Tiles: ' + tiles.mount;
					debug3.textContent = '__________BassSum: ' + bSum + ' Center[' + parentWidth/2 + ':' + parentHeight/2 + '], DS: ' + dataSize + ', SSED: ' + sseDirection;
					debug4.textContent = '__________CADS: ' + UP.AUDIO_AS + " audSL: " + audioS.length + " audRL: " + audioR.length + "--" + Math.round(audioR[120]*1000)/1000 + ' AniM: ' + Math.round(aniMod*1000)/1000 + ' AudioS[40]: ' + audioS[40] + ' trend[40]: ' + trend[40] + ' PTN: ' + UP.DUST_Pattern + ' ParticlePatt: ' + UP.DUST_CustomPattern + ' BGI: ' + UP.BG_image;
					debug5.textContent = '__________DLS: ' + UP.EXP_loadscrbool + ', SS_dur: ' + SS_duration + ', Anag: ' + Math.round(bSum*UP.EF_A_Intensity/10*1000)/1000 + ' fldr: ' + UP.BG_folder + ',   BG_type: ' + UP.BG_type + ',   BG_SS_Delay: ' + UP.BG_SS_Delay + ',   LoadTimer: ' + loadtimer + ' ms, M: ' + Math.round(median*1000)/1000 + ', ScaleM:' + scaleModifier + ', Bl:' + Math.round(bSum*(0.5+UP.EF_B_Intensity/5));
					if(exceptionFlag1 == -1) debug6.innerHTML += '<span style="color: grey;">__________Background image: unknown status</span></br>';
					else if(exceptionFlag1 == 1) debug6.innerHTML += '<span style="color: red;">__________ERROR: Background image - incorrect resolution, file name or file type.</span></br>';
					else if(exceptionFlag1 == 2) debug6.innerHTML += '<span style="color: yellow;">__________Background image - loading...</span></br>';
					else debug6.innerHTML += '<span style="color: green;">__________Background image - successful loaded.</span></br>';
					if(exceptionFlag2 == 1) debug6.innerHTML += '<span style="color: red;">__________ERROR: User properties was not loaded.</span></br>';
					else debug6.innerHTML += '<span style="color: green;">__________User properties successful loaded.</span></br>';
					if(exceptionFlag3 == -1) debug6.innerHTML += '<span style="color: grey;">__________Slideshow: unknown status</span></br>';
					else if(exceptionFlag3 == 0) debug6.innerHTML += '<span style="color: yellow;">__________Slideshow: Stopped.</span></br>';
					else if(exceptionFlag3 == 1) debug6.innerHTML += '<span style="color: green;">__________Slideshow: Running... Slides showed: ' + SS_slidesNum + '</span></br>';
					else if(exceptionFlag3 == 2) debug6.innerHTML += '<span style="color: red;">__________Slideshow: Stopped. ERROR: unknown or empty directory.</span></br>';
					else if(exceptionFlag3 == 3) debug6.innerHTML += '<span style="color: yellow;">__________Slideshow: Loading...</span></br>';
					dcanv.style.display = 'block';
					dcanv.style.transform = "translateZ(0px)";
					dcanv.width = dcanv.width;
					dctx.lineWidth = 1;
					dctx.fillStyle = "rgba(0,0,0,0.5)";
					dctx.fillRect(0,0,400,200);
					dctx.fillStyle = "rgba(255,255,255,1)";
					dctx.font = "12px Times New Roman";
					dctx.fillText("ShakePozX: " + Math.round(bgmPoint.x*1000)/1000, 0, 12);
					dctx.fillText("ShakePozY: " + Math.round(bgmPoint.y*1000)/1000, 0, 24);
					dctx.strokeStyle = "rgba(255,255,255,1)";
					dctx.arc(125+bgmPoint.x,25+bgmPoint.y,3,0,2*Math.PI,false);
					dctx.moveTo(100,0);
					dctx.rect(100,0,50,50);
					dctx.rect(0,50,301,100);
					dctx.stroke();
					dctx.beginPath();
					for(var i = 0; i < b_graph.length; i++)
					{
						dctx.moveTo(b_graph.length-i,150);
						dctx.lineTo(b_graph.length-i,150-100*b_graph[i]);
					}
					dctx.stroke();
					dctx.strokeStyle = "rgba(255,0,0,1)";
					dctx.beginPath();
					for(var i = 0; i < d_graph.length; i++)
					{
						dctx.moveTo(d_graph.length-i,150);
						dctx.lineTo(d_graph.length-i,150-100*d_graph[i]);
					}
					dctx.stroke();
				}
			}
			else
			{
				audp.style.visibility = "hidden";
				debug1.textContent = '';
				debug2.textContent = '';
				debug3.textContent = '';
				debug4.textContent = '';
				debug5.textContent = '';
				debug1.innerHTML = '';
				dcanv.style.display = 'none';
			}
		}
	}
	
	var AlternativeFFT = function()
	{
		if(audioInit)
		{
			audioAnalyser.fftSize = 128;
			audioAnalyser.smoothingTimeConstant = 0.8;
			audioInit = false;
			navigator.getUserMedia({
			audio: true,
			video: false
			}, function (localMediaStream) {
			source = audioCTX.createMediaStreamSource(localMediaStream);
			console.log(source);
			source.connect(audioAnalyser);
			}, function (err) {
			console.log(err);
			});
		}
		else
		{
			var data = new Uint8Array(128);
			audioAnalyser.getByteFrequencyData(data);
			newaudioS = AudioDataCorrection(data);
			if (audioS.length == newaudioS.length)
			{
				createjs.Tween.get(audioS, {
					override: true
				}).to(newaudioS, 40);
			}
			else
			{
				audioS = newaudioS;
			}
			console.log("DATA: " + data);
			console.log(audioAnalyser.frequencyBinCount);
		}
	}
		
    $(document).ready(function() 
	{                                                                          //DOC.READY
		loader = setInterval(function(){
			if(loadtimer < 3000)
			{
				if(exceptionFlag2 == 0)
				{
					onWindowResized();
					window.addEventListener('resize', onWindowResized);
					init();
					clearInterval(loader);
				}
				else
				{
					loadtimer += 50;
				}
			}
			else
			{
				onWindowResized();
				window.addEventListener('resize', onWindowResized);
				init();
				clearInterval(loader);
			}
		}, 50);
		audioCTX = new window.AudioContext();
		audioAnalyser = audioCTX.createAnalyser();
    });
})(jQuery, createjs)
$(function(){
	var GRAY_SCALE = [0,0.066,0.133,0.2,0.266,0.333,0.4,0.466,0.533,0.6,0.666,0.733,0.8,0.866,0.933,1.0];
	var FULL_FRAME = [
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15],
		[15,15,15,15,15,15,15,15]
	];
	var keyFrames = [];
	var keyFrameTimings = [];
	var keyFrameDOMs = [];
	var currentGray = 8;

	var template = $("#lamptable-template").html();	
	var timeGap = $("#time-gap").html();
	var timeline = $(".timeline");
	var palette = $("table.palette");
	var playFrame = $("#playFrame");
	var playTask = null;
		// Create the stage
	$("#stage").append($(template).addClass("large"));
	var stage = $("#stage table");

	function render(table, frame){
		var t = $(table);
		for(var i = 0; i < 8; i++){
			var r = t.find("tr[r=" + (i + 1) + "]");
			for(var j = 0; j < 8; j++){
				td = r.find("td[c=" + (j + 1) + "]");
				td.css({"opacity": GRAY_SCALE[frame[i][j]]});
			}
		}
	}

	function pushKeyFrame(frame, timing, index){
		if(index == undefined || index > keyFrames.length) index = keyFrames.length;
		keyFrames.splice(index, 0, frame);
		keyFrameTimings.splice(index, 0, timing);

		// Redraw the whole timeline
		timeline.empty();
		var width = 210 * keyFrames.length;
		timeline.css("width", width + "px");
		keyFrameDOMs = [];
		for(var i = 0; i < keyFrames.length; i++){
			var smallTable = $(template).addClass("small");
			var div = $("<div class=\"keyframe\" n=\"" + i + "\">").append(smallTable).append($(timeGap).val(keyFrameTimings[i]));
			keyFrameDOMs.push(div);
			timeline.append(div);
			render(div, keyFrames[i]);

			// Function bind to key frame selection
			div.click(function(){
				$this = $(this);
				$(".timeline div.keyframe").removeClass("selected");
				$this.addClass("selected");
				var n = $this.attr("n");
				render(stage, keyFrames[n]);
				stage.attr("n", n);
			});

			var updateTiming = function(){
				$this = $(this);
				var n = parseInt($this.parents("div.keyframe").attr("n"));
				keyFrameTimings[n] = parseInt($this.val());
				console.log($this, n, keyFrameTimings[n], keyFrameTimings);
			}

			div.find("input").keydown(updateTiming).change(updateTiming);
		}
		var n = stage.attr("n");
		if(n != undefined){
			keyFrameDOMs[n].click();
		}
	}


	// Prepare stage to handle click events
	function prepareStage(){
		stage.find("td").mouseenter(function(e){
			if(e.which == 1){
				paintOnStage($(this), currentGray);
			}
		}).mousedown(function(event){
			event.preventDefault();
			paintOnStage($(this), currentGray);
		});
	}

	function preparePalette(){
		var i = 15;
		palette.find("td div").each(function(){
			var opacity = 1.0 / 15 * i;
			$(this).css({"opacity": opacity}).parent("td").attr({gray: i--});
		});
		palette.find("td[gray=" + currentGray + "]").addClass("selected");
		$("body").mousewheel(function(event, delta){
			currentGray += delta;
			if(currentGray > 15) currentGray = 15;
			if(currentGray < 0)  currentGray = 0;
			palette.find("td").removeClass("selected");
			palette.find("td[gray=" + currentGray + "]").addClass("selected");
		});
	}

	function paintOnStage(td, gray){
		var r = td.parent("tr").attr("r");
		var c = td.attr("c");
		var n = stage.attr("n");
		var opacity = 1.0 / 15 * gray;
		td.css({"opacity" : opacity});
		keyFrameDOMs[n].find("tr[r=" + r + "] td[c=" + c + "]").css({"opacity" : opacity});
		keyFrames[n][r - 1][c - 1] = parseInt(gray);
	}

	function paintByCoordinate(r, c, gray){
		var n = stage.attr("n");
		var opacity = 1.0 / 15 * gray;
		stage.find("tr[r=" + r + "] td[c=" + c + "]").css({"opacity" : opacity});
		keyFrameDOMs[n].find("tr[r=" + r + "] td[c=" + c + "]").css({"opacity" : opacity});
		keyFrames[n][r - 1][c - 1] = parseInt(gray);
	}

	function paintAll(gray){
		for(var i = 1; i < 9; i ++){
			for(var j = 1; j < 9; j ++){
				paintByCoordinate(i, j, gray);
			}
		}
	}

	function paintAllPlus(delta){
		var n = stage.attr("n");
		for(var i = 1; i < 9; i ++){
			for(var j = 1; j < 9; j ++){
				var gray = keyFrames[n][i - 1][j - 1] + delta;
				if(gray > 15) gray = 15;
				if(gray < 0)  gray = 0;
				paintByCoordinate(i, j, gray);
			}
		}
	}

	function paintAllPlusExcept(delta, except){
		var n = stage.attr("n");
		for(var i = 1; i < 9; i ++){
			for(var j = 1; j < 9; j ++){
				console.log(keyFrames[n][i - 1][j - 1], except);
				if(keyFrames[n][i - 1][j - 1] != except){
					var gray = keyFrames[n][i - 1][j - 1] + delta;
					if(gray > 15) gray = 15;
					if(gray < 0)  gray = 0;
					paintByCoordinate(i, j, gray);
				}
			}
		}
	}

	function prepareShortcuts(){
		$(".allOff").click(function(){paintAll(0);});
		$(".allOn").click(function(){paintAll(15);});
		$(".allTo").click(function(){paintAll(currentGray);});
		$(".allPlus").click(function(){paintAllPlus(1);});
		$(".allMinus").click(function(){paintAllPlus(-1);});
		$(".allPlusExceptZero").click(function(){paintAllPlusExcept(1, 0);});
		$(".allMinusExcept15").click(function(){paintAllPlusExcept(-1, 15);});
		$(".addFrameBefore").click(function(){
			var n = parseInt(stage.attr("n"));
			pushKeyFrame(cloneFrame(keyFrames[n], 100, n));
			keyFrameDOMs[n + 1].click();
		});
		$(".addFrameAfter").click(function(){
			var n = parseInt(stage.attr("n"));
			pushKeyFrame(cloneFrame(keyFrames[n], 100, n + 1));
		});
	}

	function preparePlayFrame(){
		playFrame.find("div.row").append($(template).addClass("large centered"));
		$(".play").click(function(){
			playFrame.reveal({opened:play, close:stop});
		});
	}

	// 2 Level deep copy of the frame array
	function cloneFrame(frame){
		var copy = [];
		for(var i = 0; i < 8; i++){
			copy.push(frame[i].slice(0));
		}
		return copy;
	}

	function play(){
		playStage = playFrame.find(".lamp-table");
		var frameCounter = 0;
		console.log(keyFrameTimings);
		playTask = setInterval(function(){
			var pt = 0, f = 0, dt;
			for(var i = 0; i < keyFrames.length; i++){
				f += parseInt(keyFrameTimings[i]);
				if(f >= frameCounter){
					pt = i;
					dt = frameCounter - f + keyFrameTimings[i];
				}
			}

			var sf = keyFrames[pt];
			var ef = keyFrames[(pt + 1 == keyFrames.length ? 0 : pt + 1)];
			for(var i = 0; i < 8; i++){
				for(var j = 0; j < 8; j++){
					var gray = Math.floor(dt * (ef[i][j] 
						- sf[i][j]) / 
						keyFrameTimings[pt] 
						+ sf[i][j]);
					var opacity = 1.0 / 15 * gray;
					playStage.find("tr[r=" + (i + 1) + "] td[c=" + (j + 1) + "]").css({"opacity" : opacity});
				}
			}
			frameCounter++;
			if(frameCounter > f) frameCounter = 0;
		}, 10);
	}

	function stop(){
		clearInterval(playTask);
	}

	prepareStage();
	preparePalette();
	prepareShortcuts();
	preparePlayFrame();
	pushKeyFrame(cloneFrame(FULL_FRAME), 50);
	keyFrameDOMs[0].click();

});
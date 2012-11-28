$(function(){
	var GRAY_SCALE = [0,0.066,0.133,0.2,0.266,0.333,0.4,0.466,0.533,0.6,0.666,0.733,0.8,0.866,0.933,1.0];
	var keyFrames = [];
	var keyFrameTimings = [];
	var keyFrameDOMs = [];

	var template = $("#lamptable-template").html();	
	var timeGap = $("#time-gap").html();
	var timeline = $(".timeline");

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
		if(index == undefined) console.log('yeah');
		if(index > keyFrames.length) index = keyFrames.length;
		keyFrames.splice(index, 0, frame);
		keyFrameTimings.splice(index, 0, timing);
		updateTimeline();

		// Redraw the whole timeline
		timeline.empty();
		var width = 200 * keyFrames.length;
		timeline.css("width", width + "px");
		keyFrameDOMs = [];
		for(var i = 0; i < keyFrames.length; i++){
			var smallTable = $(template).addClass("small");
			var div = $("<div class=\"keyframe\">").append(smallTable).append($(timeGap).val(keyFrameTimings[i]));
			keyFrameDOMs.push(div);
			timeline.append(div);
			render(div, keyFrames[i]);
		}

	}

	var frame = [
		[ 0, 0, 0, 0, 1, 1, 1, 1],
		[ 2, 2, 2, 2, 3, 3, 3, 3],
		[ 4, 4, 4, 4, 5, 5, 5, 5],
		[ 6, 6, 6, 6, 7, 7, 7, 7],
		[ 8, 8, 8, 8, 9, 9, 9, 9],
		[10,10,10,10,11,11,11,11],
		[12,12,12,12,13,13,13,13],
		[14,14,14,14,15,15,15,15]
	];

	// Create the stage
	$("#stage").append($(template).addClass("large"));

	for(var i = 0; i < 20; i++){
		pushKeyFrame(frame, 50, i);
	}
	render("#stage table", frame);
});
$(function(){
	var GRAY_SCALE = [0,0.066,0.133,0.2,0.266,0.333,0.4,0.466,0.533,0.6,0.666,0.733,0.8,0.866,0.933,1.0];

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

	var template = $("#lamptable-template").html();	
	$("#stage").append($(template).addClass("large"));
	render("#stage table", frame);
});
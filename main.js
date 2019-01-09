'use strict';

var doc   = document,
	query = "querySelector",
	event = "addEventListener",
	hint = doc[query](".hint_p"),
	hintMark = doc[query](".hint"),
	hintClass  = "showHint",
	dropArea = doc[query](".drop-area"),
	g = doc[query](".gallery");




// Hint
hintMark[event]("mouseover", showHint, false);

// Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(e) { // Prevent a browser's default behaviour
  dropArea[event](e, prevDef, false)
});

['dragenter', 'dragover'].forEach(function(e) {
  dropArea[event](e, highlight, false)
});

['dragleave', 'drop'].forEach(function(e) {
  dropArea[event](e, unhighlight, false)
});

dropArea[event]("drop", drop, false);

// =========
// METHODS
// =========

function showHint(e) {
	if(e.target !== hintMark) return;

	var list = hint.classList;

	if(list) {

		list.add(hintClass);

		this.addEventListener("mouseout", function() { // Dublicated "addEventListener" for IE issue (1)
			list.remove(hintClass);
			return;
		}, false);
	} else { // For IE9 >> classList isn't supported
		var tempList = list.className.split(" "),
			i = tempList.indexOf("showHint");

		if(i >= 0)
			tempList.slice(i, 1);
		else
			classList.push(hintClass);
			hint.className = classList.join(" ");
	}
}

function prevDef(e) {
  e.preventDefault();
  e.stopPropagation();
  }

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function drop(e) {
	var dt = e.dataTransfer,
		files = Array.prototype.slice.call(dt.files);

	for(var i = 0; i < files.length; i++) {	
		var f = files[i];
		if((f.type.indexOf("application") < 0 || f.type.indexOf("image") < 0) && !f.type.match(/pdf|jpeg|gif|jpg|png/gi)) {
			files.splice(i, 1);
		}
	}
	checkFiles(files);	
}

function checkFiles(files) {
	if(!files.length) return;
	var XHR = ("onload" in new XMLHttpRequest() ? XMLHttpRequest: XDomainRequest),
		xhr = new XHR(),
		url = "/files";		

	for (var i = 0; i < files.length; i++) {
		var f = files[i],
			el,
			reader = new FileReader(),
			json;


		if(f.type.indexOf("pdf") >= 0) {
			el = doc.createElement("i");
			el.classList.add("pdf-prev", "far", "fa-5x", "fa-file-pdf");
			el.file = file;
		} else {
			el = doc.createElement("img");
			el.classList.add("img-prev");
			el.file = file;	
		}

		g.appendChild(el);
	    reader.onload = (function(elm) { return function(e) {if(elm.nodeName === "IMG") elm.src = e.target.result; }; })(el);
	    reader.readAsDataURL(f);

		xhr.open("POST", url, true);

		xhr.addEventListener("readystatechange", function(e) { // (1)
			if(xhr.readyState == 4 && xhr.status == 200) {
				console.log("done");
			} else if(xhr.readyState == 4  && xhr.status != 200) {
				console.log("err " + xhr.status);
			}
		});
		json = {
		  'lastModified'     : f.lastModified,
		  'lastModifiedDate' : f.lastModifiedDate,
		  'name'             : f.name,
		  'size'             : f.size,
	  	  'type'             : f.type
		}

		xhr.send(JSON.stringify(json));
	}	
}
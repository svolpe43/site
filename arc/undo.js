const HISTORY_MAX_COUNT = 5;

var current = 0;
var arc_history = [];


function Snapshot(id, text){
	this.id = id;
	this.text = text;
	this.isDelete = false;
	this.isAdd = false;
}

function addDeleteHistory(id){
	if(id == -1)
		return;

	// id is the node directly above where we are inserting node on revert
	var snap = new Snapshot(id - 1, page[id].stuff);
	snap.isDelete = true;

	arc_history.push(snap);
	current++;
}

function addAddHistory(id){
	if(id == -1)
		return;

	// id is the node to remove when reverting this action
	var snap = new Snapshot(id, "");
	snap.isAdd = true;

	arc_history.push(snap);
	current++;
}

function addHistorySnapshot(id){
	if(id == -1)
		return;
	var text = page[id].stuff;
	arc_history.push(new Snapshot(id, text));
	current++;
}

function undo(){
	console.log("undo " + current);
	if(current != 0){
		current--;
		replace_text();
	}
}

function redo(){
	console.log("redo " + current);
	if(current < history.length - 1){
		current++;
		replace_text();
	}
}

function replace_text(){
	var id = arc_history[current].id;
	var text = arc_history[current].text;

	page[id].stuff = text;
	$("#" + id).val(text);
}
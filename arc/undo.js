const HISTORY_MAX_COUNT = 5;

var current = -1;
var arc_history = [];


function Snapshot(id, line){
	this.id = id;
	this.line = line;
	this.isDelete = false;
	this.isAdd = false;
}

function history_delete_line(id){
	if(id == -1)
		return;

	reset_if_needed();

	// id is the node directly above where we are inserting node on revert
	var snap = new Snapshot(Number(id) - 1, Object.assign({}, page[id]));
	snap.isDelete = true;

	arc_history.push(snap);
	current++;
}

function history_add_line(id){
	if(id == -1)
		return;

	reset_if_needed()

	// id is the node to remove when reverting this action
	var snap = new Snapshot(Number(id) + 1, {});
	snap.isAdd = true;

	arc_history.push(snap);
	current++;

	var snap = new Snapshot(Number(id) + 1, {stuff: ''});
	arc_history.push(snap);
	current++;
}

function history_text_edit(id){
	if(id == -1)
		return;

	reset_if_needed()

	arc_history.push(new Snapshot(Number(id), Object.assign({}, page[id])));
	if(arc_history.length > 100){
		arc_history.splice(0, 1);
	}else{
		current++;
	}
}

function undo(){
	if(current > 0){
		current--;

		var item = arc_history[current];

		if(item.isAdd){
			// delete line
			arc_history[current].line = page[arc_history[current].id];
			history_do_delete_line(item);
		}else if(item.isDelete){
			// add line back
			history_do_add_line(item);
		}else{
			replace_text(item);
		}
	}
}

function redo(){
	if(current < arc_history.length - 1){

		current++;

		var item = arc_history[current];

		if(item.isAdd){
			// add line back
			history_do_add_line(item);
		}else if(item.isDelete){
			// delete line
			history_do_delete_line(item);
		}else{
			replace_text(item);
		}
	}
}

function history_do_delete_line(item){
	page.splice(item.id, 1);
	populate();
}

function history_do_add_line(item){
	page.splice(item.id, 1, item.line);
	populate();
}

function replace_text(item){
	var id = item.id;
	var text = item.line.stuff;

	page[id].stuff = text;
	$("#" + id).val(text);
}

function reset_if_needed(){
	if(current !== arc_history.length - 1){
		arc_history = arc_history.slice(0, current);
		current = arc_history.length - 1;
	}
}

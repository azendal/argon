Module('NodeSupport')({
	prototype : {
		parent      : null,
		children    : [],
		appendChild : function(child){
			if(child.parent){
				child.parent.removeChild(child);
			}
			this.children.push(child);
			this[child.name] = child;
			child.setParent(this);
			return child;
		},
		insertChild : function(child, position){
		    if(child.parent){
				child.parent.removeChild(child);
			}
			
			if(!position){
				return this.appendChild(child);
			}
			
			this.children.splice(position, 0, child);
			this[child.name] = child;
			child.setParent(this);
			return child;
		},
		removeChild : function(child){
			for(var i = 0, l = this.children.length; i < l; i++){
				if(this.children[i] == child){
					this.children.splice(i, 1);
					delete this[child.name];
					child.parent = null;
					break;
				}
			}
		},
		setParent   : function(parent){
			this.parent = parent;
			return this;
		}
	}
});

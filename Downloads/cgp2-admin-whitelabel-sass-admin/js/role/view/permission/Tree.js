Ext.define("CGP.role.view.permission.Tree",{
	extend : 'Ext.ux.tree.HalfCheckPanel',
	alias : 'widget.permissiontree',
	mixins : ['Ext.ux.util.ResourceInit'],
	

	useArrows: true,
	autoScoll: false,
	flex: 3,
	store : null,
	columns: [{
		xtype: 'treecolumn',
		width: '100%',
		dataIndex: 'title',
		sortable: false,
		menuDisable: false,
		resizable: false
	}],
	rootVisible: false,
	selModel: {
		mode: 'MULTI'
	},
	constructor : function(config){
		var me = this;

		me.addEvents("showfirst");

		config = config || {};
        config.columns = Ext.merge(me.columns,config.columns);
		
		if(Ext.isEmpty(config.store)){
			throw new Ext.Error("Store is required");
		}
		me.callParent([config]);
	},
	initComponent : function(){
		var me = this;
		me.callParent(arguments);
		me.on("showfirst",function(store, operation,eOpts ){
			this.el.mask('Loading...');
		});
		me.on("load",function(comp, node, records, successful, eOpts){
			this.el.unmask();
		});
	},
	getArrayValue: function(){
		var me = this;
		var arrayId = [];
		var records = me.getChecked( );
		for(var i = 0; i < records.length; i++){
			if(records[i].get('id') < 1)
				continue;
			arrayId.push(records[i].get('id'));
		}
		return arrayId;
	},
	checkAll : function(){
		var me = this;
		me.expandAll();
	},
	collapseAll : function(){
		var me = this;
		me.callParent();
	},
	changeChildNode : function(node,callback){
		var me = this;
		if(!node.hasChildNodes()){
			return ;
		}
		node.eachChild(function(child){
			callback(child);
			me.changeChildNode(child,callback);
		});
	},
	toggleSelect : function(){
		var me = this;
		var treeRoot = me.getRootNode();
		me.changeChildNode(treeRoot, function(childNode){
			childNode.set('checked', !childNode.get('checked'));
		});
	}
});
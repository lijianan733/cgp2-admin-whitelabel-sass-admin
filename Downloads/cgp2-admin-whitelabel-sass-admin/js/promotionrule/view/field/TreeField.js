/**
 * 该组件实现的是一个树选择field。返回值是选择项的id，可多选。
 * tree的属性可以通过treeCfg来配置
 * tree的高宽等可以通过treeWidth，treeHeight来配置
 * 
 */
Ext.define("CGP.promotionrule.view.field.TreeField",{
	extend : 'Ext.form.FieldContainer',
	mixins : {
		field : "Ext.form.field.Field"
	},
	alias : 'widget.TreeField',
	
	treeCfg : null,//field树的配置。
	treeWidth : 300,
	treeHeight : 400,
	treeStore : null,//这个树的store
	dataIndex : 'name',
	
	constructor : function(config){
		var me = this;
		me.initConfig(config);
		me.callParent(arguments);
	},
	
	initComponent : function(){
		var me = this;
		me.items = [
		Ext.apply({
			xtype : 'treepanel',
			hideHeaders : true,
			width : me.treeWidth,
			height : me.treeHeight,
			store : me.treeStore,
			selType : 'treemodel',
			columns: [{
                xtype: 'treecolumn',
                text: 'Category Name',
                width: 400,
                sortable: true,
                dataIndex: me.dataIndex
   			}]
		},me.treeCfg)
		];
		me.callParent(arguments);
	}
	
});
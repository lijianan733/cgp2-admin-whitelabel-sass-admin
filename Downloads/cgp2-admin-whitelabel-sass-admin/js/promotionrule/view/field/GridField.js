/**
 * 这里是一个gridField的组件。
 * 通过配置gridCfg来控制grid的配置 ，也可以通过gridWidth等一些属性来控制grid。
 * 该组件将实现   分页多选
 * 返回值 多选时，返回id数组或id字符串，（默认返回id数组，也可以通过valueType来配置）
 * 单选时返回 Int id。
 * 如果不传则这个组件实现的是一个产品搜索的gridfield组件
 */
Ext.define("CGP.promotionrule.view.field.GridField",{
	extend : 'Ext.form.FieldContainer',
	mixins : {
		field : 'Ext.form.field.Field'
	},
	
	valueType : "array",//仅多选时有用，设置返回值类型
	multiSelect : true, //默认多选
	gridWidth : 300,
	gridHeight : 400,
	
	initComponent : function(){
		var me = this;
		me.items = [
		Ext.apply({
			xtype : 'gridpanel',
			store : me.store,
			selModel : "rowmodel",
			width : me.gridWidth,
			height : me.gridHeight,
			columns : null
		},me.gridCfg)
		];
		me.callParent()
	}
	
});
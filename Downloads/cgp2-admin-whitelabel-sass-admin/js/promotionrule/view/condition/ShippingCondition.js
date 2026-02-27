Ext.define("CGP.promotionrule.view.condition.ShippingCondition",{
	extend : "Ext.window.Window",
	alias : 'widget.shippingCondition',
	requires : ["CGP.promotionrule.store.ShippingMethod"],
	

	store : null,//存放支付方式的Store
	
	modal : true,
	width : 400,
	height : 300,
	bodyPadding : '5 5 5 5',
	
	//这里指的是Condition.js
	controller : null,
	
	record : null, //条件store的一条数据
	
	constructor : function(config){

		this.store = Ext.create("CGP.promotionrule.store.ShippingMethod",{});
		this.callParent(arguments);
	},
	
	initComponent : function(){
		var me = this;
		
		me.title = i18n.getKey('shippingCondition');
		me.tbar = [{
			xtype : 'button',
			text : i18n.getKey('save'),
			iconCls : 'icon_save',
			handler : function(btn){
				me.controller.saveCondition(me);
			}
		},{
			xtype : 'button',
			iconCls : "icon_cancel",
			text : i18n.getKey('cancel'),
			handler : function(btn){
				me.close();
			}
		}];
		me.items = [{
			xtype : 'combo',
			width : 360,
			name : 'shippingMethods',
			itemId : "shippingMethods",
			fieldLabel: i18n.getKey('shippingMethod'),
		    store: me.store,
		    queryMode: 'local',
		    valueField: 'code',
		    displayField : 'name',
		    multiSelect : true,
		    selModel : 'checkboxmodel',
		    editable : false
		}];
		me.callParent(arguments);

		//如果是编辑，就设置值
		if(!Ext.isEmpty(me.record) && me.record.get("id") != null){
			me.setValue(me.record.get("conditionObject"));
		}
	},
	
	getValue : function(){
		var me = this;
		var combo = me.getComponent("shippingMethods");
		return {type : 'shipping', shippingMethods : combo.getValue() };
	},
	
	setValue : function(value){
		var me = this;
		var combo = me.getComponent("shippingMethods");
		combo.setValue(value[combo.name]);
	}
});
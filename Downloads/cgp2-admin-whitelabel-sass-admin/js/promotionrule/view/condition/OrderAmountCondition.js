Ext.define("CGP.promotionrule.view.condition.OrderAmountCondition",{

	extend : "Ext.window.Window",
	alias : 'widget.orderamountcondition',
	

	
	record : null, //record如果存在则表示是修改条件。是空就是新建条件
	modal : true,
	width : 400,
	height : 300,
	defaults : {
		labelAlign : 'right'
	},
	
	//这里是指Condition.js对象
	controller : null,
	
	constructor : function(){

		this.callParent(arguments);
	},
	
	initComponent : function(){
		var me = this;
		me.title = i18n.getKey('orderAmountCondition');
		me.tbar = [{
			xtype : 'button',
			iconCls : 'icon_save',
			text : i18n.getKey('save'),
			handler : function(btn){
				me.controller.saveCondition(me);
			}
		},{
			xtype : 'button',
			iconCls : 'icon_cancel',
			text : i18n.getKey('cancel'),
			handler : function(btn){
				me.close();
			}
		}],
		me.items = [{
            xtype : "radiogroup",
            name : 'isFirstOrder',
            fieldLabel : i18n.getKey('isFirstOrder'),
            width : 250,
            items : [{
                boxLabel : i18n.getKey('yes'),
                inputValue : true,
                name : 'isFirstOrder'
            },{
                boxLabel : i18n.getKey('no'),
                inputValue : false,
                checked : true,
                name : 'isFirstOrder'
            }],
            itemId : 'isFirstOrder'
        },{
			xtype : "radiogroup",
			name : 'includeShipping',
			fieldLabel : i18n.getKey('includeShipping'),
			width : 250,
			items : [{
				boxLabel : i18n.getKey('yes'),
				inputValue : true,
				name : 'includeShipping'
			},{
				boxLabel : i18n.getKey('no'),
				inputValue : false,
				checked : true,
				name : 'includeShipping'
			}],
            itemId : 'includeShipping'
		},{
			xtype : 'numberfield',
			fieldLabel : i18n.getKey('amount'),
			allowBlank : false,
			name : 'amount',
			itemId : 'amount',
			allowExponential : false,
			minValue : 0,
			value : 0
		},{
			xtype : 'numberfield',
			itemId : 'totalQty',
			fieldLabel : i18n.getKey('totalQty'),
			name : 'totalQty',
			value : 1,
			minValue : 1,
			allowBlank : false,
			allowDecimals : false,
			allowExponential : false
		}];
		me.callParent(arguments);
		
		//如果是编辑，就设置值
		if(!Ext.isEmpty(me.record) && me.record.get("id") != null){
			me.setValue(me.record.get("conditionObject"));
		}
	},
	
	getValue : function(){
		var me = this;
        var isFirstOrder = me.getComponent("isFirstOrder").getValue();
		var radioValue = me.getComponent("includeShipping").getValue();
		var amount = me.getComponent("amount").getValue();
		var  totalQty = me.getComponent("totalQty").getValue();
		return {type: 'orderAmount', includeShipping : radioValue.includeShipping, amount : amount, totalQty : totalQty,isFirstOrder:isFirstOrder.isFirstOrder};
	},
	setValue :function(value){
		var me = this,fields = me.items.items;
		for(var i = 0; i < fields.length; i++){
			if(fields[i].xtype == "radiogroup"){
				var obj = {};
				obj[fields[i].name] = value[fields[i].name];
				fields[i].setValue(obj);
			}else{
				fields[i].setValue(value[fields[i].name]);
			}
		}
	}
	
	
	
});
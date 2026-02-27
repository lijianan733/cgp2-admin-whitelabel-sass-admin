Ext.define("CGP.promotionrule.view.condition.Condition",{
	extend : 'Ext.grid.Panel',
	alias : 'widget.condition',
	requires : ["CGP.promotionrule.view.condition.OrderAmountCondition",
		"CGP.promotionrule.view.condition.PaymentCondition",
		"CGP.promotionrule.view.condition.ProductCondition",
		"CGP.promotionrule.view.condition.UserCondition",
		"CGP.promotionrule.store.ConditionType"],
		

	//从1开始，没加一个条件值加1，作为这个condition的Id。
	//用来编一个record加入到conditionStore中。
	idsequence : 1,
	websiteId : null, //记录website的值
	
	
	constructor : function(config){

		this.callParent(arguments);
	},
	
	//用来装条件的store，id是自己生成的。真正的条件数据在conditionObject中。
	//一开始这个store内是空的。只有加入条件后才有数据。
	store : Ext.create("CGP.promotionrule.store.Condition"),
	hideHeaders  : true,
//	width : 700,
	height : 350,
	maxWidth : 800,
	
	shippingStore : Ext.create("CGP.promotionrule.store.ShippingMethod",{autoLoad : false}),
	paymentStore : Ext.create("CGP.promotionrule.store.PaymentMethod",{autoLoad: false}),
	
	initComponent : function(){
		var me = this;
		
		me.tbar = [{
			xtype : 'button',
			text : i18n.getKey('addCondition'),
			handler : function(btn){
				me.selectConditionType();
			}
		}];
		
		me.columns =  [{
			xtype: 'actioncolumn',
			width : 60,
	        itemId: 'actioncolumn',
	        sortable: false,
	        resizable: false,
	        menuDisabled: true,
	        tdCls: 'vertical-middle',
	        items: [{
	        	iconCls: 'icon_edit icon_margin',
	            itemId: 'actionedit',
	            tooltip: i18n.getKey('edit'),
	            handler: function(view,rowIndex,colIndex,item,e,record){
	            	me.showConditionWindow(me.websiteId,record.get("conditionObject").type, record);
	            }
	        },{
	        	iconCls: 'icon_remove icon_margin',
	            itemId: 'actiondelete',
	            tooltip: i18n.getKey('destroy'),
	            handler: function (view, rowIndex, colIndex,item,e,record) {
	            	record.store.remove(record);
	            }
	        }]
		},{
			xtype : 'gridcolumn',
			width : 150,
			dataIndex : 'conditionObject',
			renderer : function(value){
				var store = Ext.create("CGP.promotionrule.store.ConditionType");
				var recond = store.findRecord("value",value.type,0,false,false,true);
				return recond.get("displayValue");
			}
		},{
			xtype : 'gridcolumn',
			dataIndex : 'conditionObject',
			minWidth : 500,
			renderer : function(value, metaData,record){
				return me.buildDescription(value);
			}
		}];
		me.callParent(arguments);
		
		me.shippingStore.load({
			callback :function(store){
				me.renderDescripiton(store);
			}
		});
		me.paymentStore.load({
			callback :function(store){
				me.renderDescripiton(store);
			}
		});
	},
	
	
	//根据不同的类型新建不同的window
	//conditonType 是条件类型
	//record 是条件store的一条数据
	//在条件组件内根据record来确定是修改还是新建
	showConditionWindow : function(websiteId,conditionType,record){
		var conditionWindow;
		if(conditionType == "user"){
			conditionWindow  = Ext.create("CGP.promotionrule.view.condition.UserCondition",{
				controller : this,
				record : record,
				websiteId : websiteId
			});
		}else if(conditionType == "payment"){
			conditionWindow = Ext.create("CGP.promotionrule.view.condition.PaymentCondition",{
				controller : this,
				record : record
			});
		}else if(conditionType == "product"){
			conditionWindow = Ext.create("CGP.promotionrule.view.condition.ProductCondition",{
				controller : this,
				record : record,
				websiteId : websiteId
			});
		}else if(conditionType == "orderAmount"){
			conditionWindow = Ext.create("CGP.promotionrule.view.condition.OrderAmountCondition",{
				controller : this,
				record : record
			});
		}else if(conditionType == "shipping"){
			conditionWindow = Ext.create("CGP.promotionrule.view.condition.ShippingCondition",{
				controller : this,
				record : record
			});
		}
		conditionWindow.show();
	},
	
	//condition是一个条件面板
	//将一个条件信息加入到store中
	saveCondition : function(condition){
		var me = this, value,record = condition.record;
		value = condition.getValue();
		if(!Ext.isEmpty(record) && record.get("id") != null){
			//进入这里表示是修改条件。
			record.set( "conditionObject", value );
			record.commit();
			condition.close();
			return ;
		}
		var record = {id : me.idsequence++, conditionObject : value};
		me.store.add(record);
		condition.close();
	},
	
	//根据一个条件，返回这个条件的描述
	buildDescription : function(value){
		var me = this;
		if(value.type == "user"){
			var str = value.permit?"允许":"不允许";
			return "选择了" + value.users.length + "位用户"+ str + "参加活动";
		}else if(value.type == "shipping"){
			var description = "运输方式 : ",codes = value.shippingMethods;
			for(var i = 0;i < codes.length; i++){
				var record = me.shippingStore.findRecord("code",codes[i],0,false,false,true);
				if(record == null) return ""; 
				description = description + record.get("name");
				if(i < codes.length - 1){
					description = description + ",";
				}
			}
			return description ;
		}else if(value.type == "payment"){
			var description = "支付方式 : ",codes = value.paymentMethods;
			for(var i = 0;i < codes.length; i++){
				var record = me.paymentStore.findRecord("code",codes[i],0,false,false,true);
				if(record == null) return "";
				description = description + record.get("title");
				if(i < codes.length - 1){
					description = description + ",";
				}
			}
			return description;
		}else if(value.type == "orderAmount"){
			var me = this,str;
			str = value.includeShipping == 1?"包括":"不包括";
			return "订单最少金额:"+ value.amount + ";订单金额"+ str +"运费;最低购买数量:" + value.totalQty;
		}else if(value.type == "product"){
				var description = "";
				if(value.products != null){
					description = "选择了"+ value.products.length +"个产品,"
				}
				if(value.productCategories != null){
					description = description +"选择了" + value.productCategories.length +"个类目";
				}
				return description;
		}
	},
	renderDescripiton : function(store){
		var me = this;
		me.store.each(function(record){
			var value = record.get("conditionObject");
			if(value.type == "shipping" || value.type == "payment"){
				value.description = "";
				record.set("conditionObject",value);
				record.commit();
			}
		});
	},
	
	//先选择conditionType再添加条件
	selectConditionType : function(){
		var me = this,  store = me.store;
		//如果conditionType被过滤到一个都没有了。就告诉客户没有可添加的条件了。
		var conditionTypeStore = Ext.create("CGP.promotionrule.store.ConditionType",{
			filters : [function(item){
				var result  = true;
				store.each(function(record){
					var type = record.get("conditionObject").type;
					if(item.get("value") == type)result = false;
				});
				return result;
			}]
		});
		if(Ext.isEmpty(conditionTypeStore.data.items)){
			Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('noConditionCanBeenAdded'));
			return ;
		}
		var selectWindow = Ext.create("Ext.window.Window",{
			title : i18n.getKey('selectConditionType'),
			bodyPadding : '5 5 5 5',
			modal : true,
			width : 370,
			height : 200,
			layout : {
				type : 'table',
				columns : 2
			},
			items : [{
				xtype : "combo",
				itemId : 'conditionType',
				fieldLabel : i18n.getKey('conditionType'),
				store : conditionTypeStore,
				displayField : 'displayValue',
			    valueField: 'value',
				queryMode: 'local',
				editable : false ,
				multiSelect : false
			}],
			bbar :[{
				xtype : 'button',
				width : 60,
				text : i18n.getKey('ok'),
				handler : function(btn){
					var combo = btn.ownerCt.ownerCt.getComponent("conditionType");
					me.showConditionWindow(me.websiteId,combo.getValue());
					selectWindow.close();
				}
			}]
		}); 
		selectWindow.show();
	}
	
});
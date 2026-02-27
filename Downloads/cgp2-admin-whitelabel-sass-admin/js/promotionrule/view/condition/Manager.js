Ext.define("CGP.promotionrule.view.condition.Manager",{
	extend : 'Ext.window.Window',
	

	
	ruleRecord : null,
	width : 900,
	height : 500,
	modal : true,
	
	initComponent : function(){
		var me = this;

		
		me.title = i18n.getKey('checkCondition');
		me.tbar = [{
			xtype : 'button',
			text : i18n.getKey('save'),
			iconCls : 'icon_save',
			handler : function(btn){
				me.saveCondition();
			}
		},{
			xtype : 'button',
			iconCls : "icon_cancel",
			text : i18n.getKey('cancel'),
			handler : function(btn){
				me.close();
			}
		}];
		me.items = Ext.create("CGP.promotionrule.view.condition.Condition",{
			itemId : 'condition',
			websiteId : me.ruleRecord.get("websiteId")
		});
		me.callParent(arguments);
		me.initValue();
	},
	initValue : function(){
		var me = this,store,conditions,grid;
		grid = me.getComponent("condition");
		store = grid.getStore();
		conditions = me.ruleRecord.get("conditions");
		for(var i = 0; i < conditions.length; i++){
			if(conditions[i].type != "date"	&& conditions[i].type != "coupon"){
				store.add({id : grid.idsequence++, conditionObject : conditions[i]});
			}
		}
	},
	buildConditions : function(){
		var me = this,condition,store;
		condition = me.getComponent("condition");
		store = condition.getStore();
		var conditions = [];
		store.each(function(record){
			conditions.push(record.get("conditionObject"));
		});
		var oldConditions = me.ruleRecord.get("conditions");
		var array = ["date","coupon"];
		for(var i = 0; i < oldConditions.length; i++){
			if(array.includes(oldConditions[i].type)){
				conditions.push(oldConditions[i]);
			}
		}
		return conditions;
	},
	saveCondition : function(){
		var me = this;
		var conditions = me.buildConditions();
		Ext.Ajax.request({
			url : adminPath + "api/admin/promotionRules/" +me.ruleRecord.get("id")+ "/updateCondition",
			method : 'PUT',
			headers : {
				Authorization : "Bearer" + Ext.util.Cookies.get("token")
			},
			jsonData : conditions,
			success : function(response,options){
				me.close();
				me.ruleRecord.set("conditions",conditions);
				me.ruleRecord.commit();
				Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
			},
			failure : function(response,options){
				var r = Ext.decode(response.responseText);
				Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('serverError') + r.message);
			}
		});
		
	}
});
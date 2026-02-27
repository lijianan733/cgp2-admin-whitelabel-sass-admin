Ext.define("CGP.promotionrule.controller.EditController",{

	constructor : function(config){
		var me = this;

		me.callParent(arguments);
	},
	
	save : function(basicInformation,condition,policy,promotionRuleModel,mask){
		 var me = this, method = "POST",url;
		var object = this.buildBasic(basicInformation);
		object.conditions = this.buildCondition(basicInformation,condition);
		object.policy = this.buildPolicy(policy);
//		object.promotionId = 1;
		url = adminPath + 'api/admin/promotionRules';
		if(promotionRuleModel != null && 
			promotionRuleModel.modelName == "CGP.promotionrule.model.PromotionRule" 
			&& promotionRuleModel.get("id") != null){
				
			object.id = promotionRuleModel.get("id");
			method = "PUT";
			url = url+"/"+object.id;
		}
		
		Ext.Ajax.request({
			url : url,
			method : method,
			headers : {
				Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
			},
			jsonData : object,
			success : function(response,options){
				Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveSuccess'),function(){
					var id = Ext.decode(response.responseText).data.id;
					var url =  path + "partials/promotionrule/edit.html?id=" + id;
					JSOpen({
						id : "promotionrule_edit",
						url :  url,
						title: i18n.getKey('edit') +"_"+ i18n.getKey('promotionRule'),
						refresh: true
					});
				});
			},
			failure : function(response,options){
				var object = Ext.JSON.decode(response.responseText);
				Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
			},
			callback : function(){
				mask.hide();
			}
		});
	},
	
	//构建条件信息
	buildCondition : function(basicInformation,condition){
		var me = this,conditionGrid = condition.down("condition"),store;
		var conditions = [];
		store = conditionGrid.getStore();
		store.each(function(record){
			conditions.push(record.get("conditionObject"));
		});
		
		//下面将basicInformation中的条件加入		
		var startDate = basicInformation.getComponent("startDate").getValue();
		
		var endDate = basicInformation.getComponent("endDate").getValue();
		conditions.push({type : 'date', startDate : startDate, endDate : endDate});
		
		var needCoupon = basicInformation.getComponent("needCoupon").getValue().couponRequired;
		conditions.push({type : 'coupon', couponRequired : needCoupon});
		
		return  conditions;
	},
	
	//构建基本信息
	buildBasic : function(basicInfoPage){
		var me = this,fields = basicInfoPage.items.items;
		var object = {};
		for(var i = 0; i < fields.length; i++){
			if(Ext.isEmpty(fields[i].name) || fields[i].itemId == "needCoupon" || fields[i].xtype == "timestamp") continue;
			var value = fields[i].getValue();
			if(fields[i].xtype == "radiogroup"){
				value = value[fields[i].name];
			}
			object[fields[i].name] = value;
		}
		return object;
	},
	
	//构建policy信息
	buildPolicy : function(policy){
		var me = this, type = policy.getComponent("type").getValue(),
		discountType = policy.getComponent("discountType").getValue(),
		discount = policy.getComponent("discount").getValue();
		var value = {type : type, discountType : discountType, discount : discount};
		if(type == "shipping"){
			 value.orderTotalCode = 'ot_shipping_discount';
		}else if(type == "order"){
			 value.orderTotalCode = 'ot_total_discount';
		}else if(type == "product"){
			 value.orderTotalCode = 'ot_subtotal_discount';
		}
		return value;
	},
	
	//根据record 来设置整个编辑页面的值
	setValue : function(record,basicInfo,policy,condition){
		var me = this;
		me.setBasicInfo(record,basicInfo);
		me.setPolicy(record,policy);
		me.setCondition(record,condition);
	},
	//设置基本信息
	setBasicInfo : function(record,basicInfo){
		var me = this, fields;
		fields = basicInfo.items.items;
		for(var i = 0; i < fields.length; i++){
			var value = null;
			if(fields[i].name == "startDate" || fields[i].name == "endDate"){
				var conditions = record.get("conditions");
				for(var k = 0; k < conditions.length; k++){
					if(conditions[k].type == "date"){
						value = conditions[k][fields[i].name];
					}
				}
			} else if(fields[i].name == "couponRequired"){
				var conditions = record.get("conditions");
				for(var k = 0 ; k < conditions.length; k++ ){
					if(conditions[k].type == "coupon"){
						value = conditions[k][fields[i].name];
					}
				}
			}
			else {
				value = record.get(fields[i].name);
			}
			//上部分是取field的值，如果没有值，则下一个field
			if(Ext.isEmpty(value)) continue;
			
			if(fields[i].xtype == "radiogroup"){
					var obj = {}; obj[fields[i].name] = value;
					fields[i].setValue(obj);
			}else{
					fields[i].setValue(value);
			}
		}
	},
	
	//设置policy
	setPolicy : function(record, policy){
		var me = this, fields;
		fields = policy.items.items;
		for(var i = 0; i < fields.length; i++){
			var value = record.get("policy")[fields[i].name];
			fields[i].setValue(value);
		}
	},
	
	//设置条件值
	setCondition : function(record, condition){
		var me = this,store,conditions,grid;
		grid = condition.down("condition");
		store = grid.getStore();
		conditions = record.get("conditions");
		for(var i = 0; i < conditions.length; i++){
			if(conditions[i].type != "date"	&& conditions[i].type != "coupon"){
				store.add({id : grid.idsequence++, conditionObject : conditions[i]});
			}
		}
	},
	valid : function(basicInfo,condition,policy){
		var validValue = true;
		var validField = function(fieldSet){
			var fields = fieldSet.items.items;
			for(var i = 0 ; i < fields.length; i++){
				if(fields[i].validate && ! fields[i].validate()){
					validValue = false;
					fields[i].markInvalid(fields[i].blankText);
				}
			}
		};
		validField(basicInfo);
		validField(policy);
		return validValue;
	},
	
	manageCoupon : function(ruleRecord){
		var me = this;
        Ext.create("CGP.promotionrule.view.coupon.Manager",{
            ruleId: ruleRecord.get("id")
        }).show();
	}
	
});
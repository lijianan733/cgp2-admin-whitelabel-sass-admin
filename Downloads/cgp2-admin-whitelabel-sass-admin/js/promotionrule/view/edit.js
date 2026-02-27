
Ext.Loader.syncRequire("CGP.promotionrule.model.PromotionRule");
Ext.onReady(function(){


	
	var websiteStore = Ext.create("CGP.promotionrule.store.Website");
	var policyTypeStore = Ext.create('CGP.promotionrule.store.PolicyType');
	var discountTypeStore = Ext.create("CGP.promotionrule.store.DiscountType");
	var shippingMethodStore = Ext.create("CGP.promotionrule.store.ShippingMethod");
	
	var editController = Ext.create("CGP.promotionrule.controller.EditController");
	
	
	//页面的url参数。如果id不为null。说明是编辑。
	var urlParams = Ext.Object.fromQueryString(location.search);
	var promotionRuleModel = null;
	if(urlParams.id != null){
		promotionRuleModel = Ext.ModelManager.getModel("CGP.promotionrule.model.PromotionRule");
	}
	
	//基本信息的编辑面板
	var basicInformation = Ext.create("Ext.form.FieldSet",{
		collapsible: false,
//		title:  "<font size='4'>"+'Basic Information'+"</font>",
		defaultType: 'textfield',
		border: 0,
        defaults: {
        	width : 300,
        	labelAlign : 'right'
        },
        layout: {
        	type : 'table',
        	columns : 3
        },
        items : [{
        	fieldLabel : i18n.getKey('promotionActive'),
        	name : 'promotionId',
        	itemId :'promotion',
        	xtype : 'combo',
        	store : Ext.create("CGP.promotionrule.store.Promotion"),
        	displayField: 'name',
        	valueField: "id",
        	editable : false,
        	allowBlank : false,
        	disabled : promotionRuleModel != null,
        	disabledCls : 'custom-disabled',
        	hideTrigger : urlParams.id != null ? true:false,
        	listeners : {
        		change : function(combo,newValue,oldValue){
        			var website = combo.ownerCt.getComponent("website");
        			var record = combo.store.getById(newValue);
        			if(record == null){
        				combo.store.load({
        					callback : function(){
        						record = this.getById(newValue);
        						website.setValue(record.get("websiteId"));
        					}
        				});
        				return ;
        			}
        			website.setValue(record.get("websiteId"));
        		}
        	}
        },{
        	fieldLabel : i18n.getKey('name'),
        	name : 'name',
        	itemId : "name",
        	allowBlank : false
        },{
        	fieldLabel : i18n.getKey('website'),
        	xtype : 'combo',
        	name : 'websiteId',
        	border : 'false',
			autoScroll : true,
			editable : false,
			allowBlank: false,
			itemId: 'website',
			listConfig : {
				loadingText : 'loading',
				emptyText : 'not find a match'
			},
			store : websiteStore ,
			forceSelection : true,
			displayField : 'name',
			valueField : 'id',
			disabled : true,
			disabledCls : 'custom-disabled',
			hideTrigger : true,
			listeners : {
				change : function(combo,newValue){
					var websiteId = combo.getValue(),condition;
					condition = basicInformation.ownerCt.getComponent("conditionSet");
					condition.down("condition").websiteId = websiteId;
				}
			}
        },{
        	fieldLabel : i18n.getKey('starttime'),
        	allowBlank : false,
        	xtype  : 'timestamp',
        	name : 'startDate',
        	itemId : 'startDate',
        	listeners : {
        		change : function(star,value){
        			var field = star.ownerCt.getComponent("endDate");
        			field.setMinValue(value);
        		}
        	}
        },{
        	fieldLabel : i18n.getKey('endtime'),
        	allowBlank : false,
        	xtype : 'timestamp',
        	name : 'endDate',
        	itemId : 'endDate',
        	listeners : {
        		change : function(star,value){
        			var field = star.ownerCt.getComponent("startDate");
        			field.setMaxValue(value);
        		}
        	}
        },{
        	fieldLabel : i18n.getKey('isCumulative'),
        	itemId : 'cumulative',
        	xtype      : 'radiogroup',
        	name : 'cumulative',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [{
                    boxLabel  : i18n.getKey('yes'),
                    name      : 'cumulative',
                    inputValue: true
                }, {
                    boxLabel  : i18n.getKey('no'),
                    name      : 'cumulative',
                    checked : true,
                    inputValue: false
            }]
        },{
        	fieldLabel : i18n.getKey('description'),
        	name : 'description',
        	itemId : "description",
        	colspan : 3,
        	itemId : 'description',
        	xtype : 'textarea',
        	width : 900,
        	height : 150
        },{
        	fieldLabel : i18n.getKey('isActive'),
        	itemId : 'activetion',
        	xtype      : 'radiogroup',
        	name : 'active',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [{
                    boxLabel  : i18n.getKey('yes'),
                    name      : 'active',
                    inputValue: true
                }, {
                    boxLabel  : i18n.getKey('no'),
                    name      : 'active',
                    checked : true,
                    inputValue: false
            }]
        },{
        	fieldLabel : i18n.getKey('needCoupon'),
        	itemId : 'needCoupon',
        	name : 'couponRequired',
        	xtype      : 'radiogroup',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [{
                    boxLabel  : i18n.getKey('yes'),
                    name      : 'couponRequired',
                    inputValue: true

                }, {
                    boxLabel  : i18n.getKey('no'),
                    name      : 'couponRequired',
                    inputValue: false,
                    checked : true
            }],
            listeners : {
            	change : function(radiogroup,value){
            		if(value.couponRequired == true && promotionRuleModel != null){
            			radiogroup.ownerCt.getComponent("managecoupon").show();
            		}else{
            			radiogroup.ownerCt.getComponent("managecoupon").hide();
            		}
            	}
            }
        },{
        	xtype : 'button',
        	width : 150,
        	hidden : true,
        	margin : "0 0 0 100",
        	itemId : 'managecoupon',
        	text : i18n.getKey('couponManagement'),
        	handler : function(btn){
        		editController.manageCoupon(promotionRuleModel);
        	}
        }]
	});
	
	//Policy优惠活动策略的编辑面版
	var policy = Ext.create("Ext.form.FieldSet",{
		collapsible: false,
//		title: "<font size='4'>"+"Promotion Policy"+"</font>",
		defaultType: 'textfield',
		height : 30,
		border : 0,
        defaults: {
        	width : 300,
        	labelAlign : 'right'
        },
        layout: {
        	type : 'table',
        	columns : 3
        },
        items : [{
        	xtype : 'combo',
        	allowBlank : false,
        	itemId : 'type',
        	name : 'type',
        	store : policyTypeStore,
        	fieldLabel : i18n.getKey('policyType'),
        	displayField : 'display',
        	valueField : 'value',
        	queryMode : 'local',
        	editable : false
        	
        },{
        	xtype : "combo",
        	allowBlank : false,
        	itemId : "discountType",
        	name : 'discountType',
        	store : discountTypeStore,
        	fieldLabel : i18n.getKey('privilegeType'),
        	displayField : 'display',
        	valueField : 'value',
        	queryMode : 'local',
        	msgTarget : 'side',
        	editable : false,
        	value : 1,
        	listeners : {
        		change : function(combo,value){
        			var numberfield = combo.ownerCt.getComponent("discount");
        			if(value == 0){
        				numberfield.maxValue = 100;
        				numberfield.setFieldLabel(i18n.getKey('discountPercent') );
        			}else{
        				delete numberfield.maxValue;
        				numberfield.setFieldLabel(i18n.getKey('reducePrice') );
        			}
        			if(value == 0 && numberfield.getValue() > 100){
//        				var msg = numberfield.maxText.replace("{0}",100);
//        				numberfield.markInvalid(msg);
        				numberfield.setValue(100);
        			}
        		}
        	}
        },{
        	xtype : 'numberfield',
        	allowBlank : false,
        	itemId :'discount',
        	name : 'discount',
        	fieldLabel : i18n.getKey('reducePrice'),
        	allowExponential : false,
        	minValue : 0
        }]
        
	});
	
	//条件的编辑面板
	var condition  = Ext.create("Ext.form.FieldSet",{
		collapsible: false,
		padding : '5 5 5 5',
		itemId : 'conditionSet',
		border: 0,
        layout: "fit",
        items : [{
        	xtype : 'fieldcontainer',
        	fieldLabel : i18n.getKey('condition'),
        	labelAlign : 'right',
        	itemId : 'fieldcontainer',
        	width  : 900,
        	items : [Ext.create("CGP.promotionrule.view.condition.Condition",{
	        	website : null
	        })]
        }]
        
	});
	var editPage = Ext.create("Ext.container.Viewport",{
		title : i18n.getKey('createRule'),
		autoScroll : true,
		layout : 'fit',
		items : [{
			xtype : "panel",
			bodyPadding : 10,
			autoScroll : true,
			tbar : [{
				xtype : "button",
				text : i18n.getKey('save'),
				iconCls : 'icon_save',
				handler : function(){
					if(editController.valid(basicInformation,condition,policy)){
						//利用promotionRuleModel来判断是修改还是新建
						var mask = editPage.setLoading();
						editController.save(basicInformation,condition,policy,promotionRuleModel,mask);
					}
				}
			},{
				xtype : 'button',
				itemId : "copy",
				text : i18n.getKey('copy'),
				iconCls : 'icon_copy',
				disabled : urlParams.id != null ?false:true, 
				handler : function(){
					promotionRuleModel = null;
//					urlParams.id = null;
					this.setDisabled(true);
					window.parent.Ext.getCmp("promotionrule_edit").setTitle(i18n.getKey('create') +"_"+ i18n.getKey('promotionRule'));
					basicInformation.getComponent("promotion").setDisabled(false);
					basicInformation.getComponent("promotion").setHideTrigger(false);
					basicInformation.getComponent("managecoupon").hide();
				}
			}],
			items : [basicInformation,policy,condition]
		}],
		listeners : {
			render : function(){
				var me = this;
				if(urlParams.id != null){
					promotionRuleModel.load(Number(urlParams.id),{
						success : function(record, operation){
							promotionRuleModel = record;
							editController.setValue(record,basicInformation,policy,condition);
						}
					});
				}
				if(urlParams.promotionId != null){
					var promotionCombo = basicInformation.getComponent("promotion");
					promotionCombo.setValue(Number(urlParams.promotionId));
				}
			}
		}
		
	});
	
});
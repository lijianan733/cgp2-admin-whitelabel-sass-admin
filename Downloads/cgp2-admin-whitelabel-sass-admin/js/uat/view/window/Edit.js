Ext.define("CGP.uat.view.window.Edit",{
	extend : 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	requires : ["CGP.uat.model.UAT"],
	

	form : null,//window中的form表单
	record : null,//编辑状态时存放一条编辑数据
	controller : null,//编辑的controller
	
	width : 500,
	height : 300,
	resizable: false,
	layout : 'fit',
	modal : true,
	initComponent : function(){
		var me = this;


        me.title = i18n.getKey('create');
		me.callParent(arguments);
		
		var urlParams = Ext.Object.fromQueryString(location.search);
		
		me.form = Ext.create("Ext.form.Panel",{
			bodyStyle : {
				padding: '10px'
			},
			tbar : [{
				text : i18n.getKey('save'),
				iconCls: 'icon_save',
				width: 70,
				handler : function(button){
					if(me.form.isValid()){
						me.controller.save();
					}
				}
			},{
				text : i18n.getKey('cancel'),
				iconCls : 'icon_cancel',
				width : 70,
				handler : function(){
					me.close();
				}
			}],
			fieldDefaults : {
				width : 400
			},
			items : [{
				xtype : 'displayfield',
				fieldLabel : i18n.getKey('type'),
				itemId : 'type',
				value : '<div class="status-field">'+i18n.getKey(me.record.get('type'))+'</div>'
			},{
				xtype : "displayfield",
				fieldLabel : i18n.getKey('website'),
				itemId : 'website',
				value : '<div class = "status-field">' + me.record.get("website").name +'</div>'
			},
			
//				{
//				xtype : 'combo',
//				name : 'type',
//				itemId : 'type',
//				fieldLabel : i18n.getKey('type'),
//				allowBlank : false,
//				store : Ext.create('Ext.data.Store',{
//					fields : ['value'],
//					data : [{value : 'CS' },{value : 'MANUFACTURE'}]
//				}),
//				displayField : 'value',
//				valueField : 'value',
//				editable : false,
//				disabledCls : "custom-disabled",
//				disabled : true,
//				value : urlParams.type
//			},{
//                xtype: 'gridcombo',
//                itemId: 'website',
//                disabledCls : "custom-disabled", 
//                disabled : true,
//                fieldLabel: i18n.getKey('website'),
//                allowBlank: false,
//                name: 'website',
//                displayField: 'name',
//                valueField: 'id',
//                store: Ext.create("CGP.uat.store.WebsiteStore",{storeId : "website",
//	                	listeners : {
//	                		load : function(store, records, successful){
//	                			var model = store.getById(Number(urlParams.website));
//	                			me.form.getComponent("website").setValue(model.data);
//	                		}
//	                	}
//	                }),
//                matchFieldWidth: true,
//                pickerAlign: 'bl',
//                gridCfg: {
//                	disabled : true,
//                    store: Ext.data.StoreManager.lookup("website"),
//                    height: 200,
//                    width: 400,
//                    columns: [{
//                        text: i18n.getKey('name'),
//                        width: 120,
//                        dataIndex: 'name'
//         			}]
//                }
//      		},
      			{
				xtype : 'textfield',
				name : "name",
				itemId : 'name',
				fieldLabel: i18n.getKey('name'),
				msgTarget: "side",
				allowBlank : false
			},{
				xtype : 'textarea',
				name : 'description',
				itemId : 'description',
				msgTarget: "side",
				height : 100,
				fieldLabel : i18n.getKey('description')
			}]
		});
		me.add(me.form);
		me.form.form.loadRecord(me.record);
		if(Ext.isEmpty(me.record.get("id"))){
			me.setTitle(i18n.getKey('create'));
		}else{
			me.setTitle(i18n.getKey('edit'));
		}
	},
	
	getSubmitValue : function(){
		var me = this;
		var form = me.child("form");
			form.updateRecord();
		var	returnModel = form.getRecord();
		return returnModel;
	},
	
	refresh : function(record){
		var me = this;
		me.record = record;
		me.child("form").form.reset();
		me.form.form.loadRecord(me.record);
		if( !Ext.isEmpty(me.record.get("id"))){
			me.setTitle(i18n.getKey('edit'));
		}else{
			me.setTitle(i18n.getKey('create'));
		}
	}
})
Ext.define("CGP.promotionrule.view.condition.UserCondition",{
	extend : 'Ext.window.Window',
	alias : 'wdiget.usercondition',
	requires : ["CGP.order.actions.modifyuser.view.UserSearchField"],
	

	
	record : null, //一个user条件数据
	modal : true,
	width : 870,
	websiteId : null,
	
	//这里是Condition.js这个对象
	controller : null,
	
	customerController : null,
	
	initComponent : function(){
		var me = this;

		me.title = i18n.getKey('userCondition');
		
		me.customerController = Ext.create("CGP.promotionrule.controller.customer.CustomerController",{
			productCondition : me
		});
		
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
		
	
		me.userPage = Ext.create("Ext.form.FieldContainer",{
			fieldLabel : i18n.getKey('customer'),
			labelAlign : 'right',
			labelWidth : 80,
			width : 800,
			items : [{
				xtype : 'grid',
				minHeight : 500,
				autoScroll : true,
				itemId : 'userList',
				store : Ext.create("CGP.customer.store.CustomerStore",{
					data : [],
					remoteSort: false,
				    pageSize: null,
				    proxy:null,
				    autoLoad: false
				}),
				tbar : [{
					xtype : 'button',
					text : i18n.getKey('add'),
					width : 80,
					handler : function(){
						var data = me.userPage.down("grid").getStore().data.items;
						me.customerController.showAddProductWin(data,me.websiteId);
					}
				}],
				columns : [{
					xtype: 'actioncolumn',
					width : 60,
			        itemId: 'actioncolumn',
			        sortable: false,
			        resizable: false,
			        menuDisabled: true,
			        tdCls: 'vertical-middle',
			        items: [{
			        	iconCls: 'icon_remove icon_margin',
			            itemId: 'actiondelete',
			            tooltip: i18n.getKey('destroy'),
			            handler: function (view, rowIndex, colIndex,item,e,record) {
			            	record.store.remove(record);
			            }
			        }]
				},{
					text : i18n.getKey('id'),
					dataIndex :'id',
					xtype : 'gridcolumn',
					itemId : 'id',
					width :50
				},{
					text: i18n.getKey('customerEmail'),
	                dataIndex: 'email',
	                itemId: 'email',
	                sortable: false,
	                minWidth: 170,
	                renderer : function(value,metadata){
	                	metadata.style = "font-weight:bold";
	                	return value;
	                }
				},{
					text: i18n.getKey('website'),
	                dataIndex: 'website',
	                xtype: 'gridcolumn',
	                itemId: 'website',
	                sortable: false,
	                minWidth: 100,
	                renderer: function (record) {
	                    return record.name;
	                }
				},{
					text: i18n.getKey('source'),
	                dataIndex: 'source',
	                xtype: 'gridcolumn',
	                itemId: 'source',
	                sortable: false,
	                minWidth: 80
				},{
					text: i18n.getKey('firstName'),
					dataIndex: 'firstName',
					itemId: 'firstName',
					sortable: false,
					minWidth : 120
				},{
					text : i18n.getKey('lastName'),
					dataIndex: 'lastName',
					itemId : 'lastName',
					sortable :false,
					minWidth :120
				}]
			}]
		});
		
		me.items = [{
			xtype : 'radiogroup',
			itemId : 'permit',
			name : 'permit',
            fieldLabel : i18n.getKey('joinActive'),
            labelAlign: 'right',
            defaultType: 'radiofield',
            width : 300,
            columns: 2,
            items: [
                {
                    boxLabel  : i18n.getKey('allow'),
                    name      : 'permit',
                    inputValue: 1
                }, {
                    boxLabel  : i18n.getKey('noAllow'),
                    name      : 'permit',
                    checked : true,
                    inputValue: 0
                }
            ]
        },me.userPage ];
		
		me.callParent(arguments);
		
		
		if(!Ext.isEmpty(me.record) && me.record.get("id") != null){
			me.setValue(me.record.get("conditionObject"));
		}
	},
	
	getValue : function(){
		var me = this;
		var permit = me.getComponent("permit").getValue();
		var records = me.userPage.child("grid").getStore().data.items;
		var idArray = [];
		for(var i = 0; i < records.length; i++){
			idArray.push(records[i].get("id"));
		}
		if(Ext.isEmpty(idArray) || idArray[0] == null){
			Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('pleaseAddUser'));
			throw new Error('');
		}
		return {type : "user", permit : permit.permit, users : idArray};
	},
	
	setValue : function(value){
		var me = this, permit, userGrid;
		//设置规则
		permit = me.getComponent("permit");
		var obj = {}; obj.permit = value.permit;
		permit.setValue(obj);
		//设置选择了那些产品
		if(!Ext.isEmpty(value.users))
		me.setProductValue(value);
	},
	
	setProductValue : function(value){
		var me = this, grid;
		grid =  me.userPage.down("grid");
		var store = grid.getStore();
		var newStore = Ext.create("Ext.data.Store",{
			model : 'CGP.customer.model.Customer',
			proxy: {
				extraParams : {
					userIds : value.users
				},
		        type: 'uxrest',
		        url: adminPath + "api/admin/user/many",
		        reader: {
		            type: 'json',
		            root: 'data'
		        }
		    }
		});
		newStore.load({
			callback : function(records, operation, success){
				store.add(records);
			}
		});
	}
	
});
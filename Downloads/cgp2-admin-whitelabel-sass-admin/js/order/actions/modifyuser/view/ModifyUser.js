Ext.define("CGP.order.actions.modifyuser.view.ModifyUser",{
	extend : 'Ext.panel.Panel',
	requires : ["CGP.customer.store.CustomerStore",
		"CGP.order.actions.modifyuser.view.UserSearchField","CGP.order.actions.modifyuser.model.Order"],
	alias : 'widget.modifyuser',
	

	order : null,//订单信息（订单model）
	autoScroll : true,
	
	constructor : function(config){
		var me = this;


		me.orderId = Number(Ext.Object.fromQueryString(location.search).id);
		if(Ext.isEmpty(me.orderId)){
			throw new Ext.Error("OrderId is null");
		}
		me.callParent(arguments);
	},
	
	initComponent : function(){
		var me = this;
		me.callParent(arguments);
		
		me.addDocked({
			xtype : 'toolbar',
			dock : 'top',
			items : [{
				xtype  : 'button',
				iconCls : 'icon_save',
				text : i18n.getKey('save'),
				handler : function(){
					me.save();
				}
			}]
		});
		
		me.add([{
			xtype : 'displayfield',
			labelAlign: 'right',
			labelWidth : 120,
			fieldLabel : i18n.getKey('orderNumber'),
			itemId : 'orderNumber'
		},{
			xtype : 'displayfield',
			labelAlign: 'right',
			labelWidth : 120,
			fieldLabel : i18n.getKey('customerEmail'),
			itemId : 'customerEmail'
		},{
	        fieldLabel: i18n.getKey('website'),
	        xtype : 'displayfield',
			labelAlign: 'right',
			labelWidth : 120,
			itemId : 'website'
		}]);
		
		var customerStore = Ext.create("CGP.customer.store.CustomerStore",{autoLoad : false});
		
		var newCustomerd = Ext.create("CGP.order.actions.modifyuser.view.UserSearchField",{
			fieldLabel : i18n.getKey('newCustomer'),
			labelAlign: 'right',
			labelWidth : 120,
			itemId : 'newCustomerd',
			gridCfg : {
				editAction: false,
        		deleteAction: false,
				store : customerStore,
				simpleSelect  : true,
				selModel: Ext.create('Ext.selection.CheckboxModel',{mode : 'SINGLE'}),
				columns : [{
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
	                minWidth: 150,
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
					minWidth : 150
				},{
					text : i18n.getKey('lastName'),
					dataIndex: 'lastName',
					itemId : 'lastName',
					sortable :false,
					minWidth :150
				}]
			},
			filterCfg : {
//				columnCount : 2, 对filter无用
				height : 120,
				items : [{
					id: 'emailSearchField',
	                name: 'emailAddress',
	                xtype: 'textfield',
	                fieldLabel: i18n.getKey('customerEmail'),
	                itemId: 'email'
				},{
					id: 'websiteSearchField',
	                name: 'website',
	                xtype: 'numberfield',
	                itemId: 'websiteCombo',
	                fieldLabel: i18n.getKey('website'),
	                hidden : true
				},{
					id: 'sourceSearchField',
	                name: 'source',
	                xtype: 'textfield',
	                fieldLabel: i18n.getKey('source'),
	                itemId: 'source'
				}, {
	                id: 'firstNameSearchField',
	                name: 'firstName',
	                xtype: 'textfield',
	                fieldLabel: i18n.getKey('firstName'),
	                itemId: 'firstName'
	       		}, {
	                id: 'lastNameSearchField',
	                name: 'lastName',
	                xtype: 'textfield',
	                fieldLabel: i18n.getKey('lastName'),
	                itemId: 'lastName'
	       		}]
			}
		});
		
		me.add(newCustomerd);
		
		me.model=Ext.ModelManager.getModel("CGP.order.actions.modifyuser.model.Order");
		me.model.load(me.orderId,{
				success : function(record,operation){
					me.loadOK(record);
				}
		});
	},
	
	loadOK : function(record){
		var me = this;
		me.order = record;
		me.getComponent("orderNumber").setValue(record.get("orderNumber"));
		me.getComponent("customerEmail").setValue(record.get("customerEmail"));
		me.getComponent("website").setValue(record.get("website").name);
		var filter = me.getComponent("newCustomerd").child("searchcontainer").filter;
		var websiteSearch = filter.getComponent("websiteCombo");
		websiteSearch.setValue(record.get("website").id);
		var grid = me.getComponent("newCustomerd").child("searchcontainer").grid;
		
		//如果用户store中有这个订单的原客户，把这个客户从store中移除。
		var customerId = record.get("customerId");
		grid.getStore().on("load",function(store, records, successful, eOpts){
			var user = store.getById(customerId);
			if(user != null){
				store.remove(user);
			}
		});
		grid.getStore().load();
	},
	
	save : function(){
		var me = this;
		var grid = me.getComponent("newCustomerd").child("searchcontainer").grid;
		var selectRecord = grid.getSelectionModel( ).getSelection( )[0];
		if(Ext.isEmpty(selectRecord) || Ext.isEmpty(selectRecord.get("id"))){
			Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('selectCustomer'));
			return ;
		}
		if(me.order.get("website").id != selectRecord.get("website").id){
			Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('mustSameWebsite'));
			return ;
		}
		Ext.Ajax.request({
			url : adminPath + 'api/orders/'+me.order.get("id")+'/modifyUser',
			method : "PUT",
            headers : {
                Authorization : 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {id: selectRecord.get("id")},
			callback : function(option, suc, resp){
				var response = Ext.JSON.decode(resp.responseText);
				if(response.success){
					Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'),callback);
                    function callback(){
                        JSOpen({
                            id: 'modifyCustomer',
                            url: path + 'partials/order/modifycustomer.html?id=' + me.orderId,
                            title: i18n.getKey('modifyCustomer'),
                            refresh: true
                        });
                    }
				}else{
					Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('savefailure')+" :"+response.data.message);
				}
			}
		});
	}
	
});
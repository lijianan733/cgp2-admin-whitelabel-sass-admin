Ext.onReady(function(){


	
	// JS的去url的参数的方法，用来页面间传参
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	} 
	
	var paymentStore = Ext.data.StoreManager.lookup("ShippingMethod");
	paymentStore.load({
		params : {websiteId : ''+getQueryString("websiteId")+''},
		callback : function(records,options,success){
			
		}
	});
	var configPaymentStore = Ext.data.StoreManager.lookup("shippingConfigStore");
	configPaymentStore.load({
		params : {websiteId : ''+getQueryString("websiteId")+''},
		callback : function(records,options,success){
			
		}
	});
//	var StatusStore = Ext.data.StoreManager.lookup("orderStatusStore");
	
	//页面
	var page = Ext.create('Ext.grid.Panel',{
//			xtype :'grid',
			title : i18n.getKey('shippingMethod'),
			store: paymentStore,
			region : 'center',
			autoScroll: true,
		    columns: [ {
		    	
	                xtype: 'rownumberer',
	                autoSizeColumn: false,
	                itemId: 'rownumberer',
	                width: 30,
	                resizable: true,
	                menuDisabled: true,
	                tdCls: 'vertical-middle'
            	},{
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width : 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [{
	                    iconCls: 'icon_edit icon_margin',
	                    itemId: 'actionedit',
	                    tooltip: i18n.getKey('edit'),
	                    handler: function(view, rowIndex, colIndex ){
	                    	editAction(view, rowIndex, colIndex);
	                    }
	                },{
	                	iconCls: 'icon_remove icon_margin',
	                    itemId: 'actiondelete',
	                    tooltip: i18n.getKey('destroy'),
	                    handler: function(view, rowIndex, colIndex ){
	                    	Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function(btn){
	                    		if(btn == 'yes'){
	                    			var store = page.getStore();
			                    	var modelData = store.getAt(rowIndex);
			                    	store.removeAt(rowIndex);
			                    	store.sync({
			                    		success  : function(rec,rod,oen,e){
			                    			Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('deleteSuccess') + '!');
			                    		}
			                    	});
	                    		}
	                    	});
	                    }
	                }]
                },{
                	text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                    	var text = "启用";
                    	if(record.get('available')){
                    		text = '禁用';
                    	}
                        return {
                        	xtype  : 'button',
                        	text : text,
                        	handler : function(){
                        		var store = page.getStore();
                        		var modeldata = store.getById(record.get('id'));
                        		if(modeldata.get('available')){
                        			modeldata.set('available',false);
                        		} else {
                        			modeldata.set("available",true);
                        		}
                        		//modeldata.save();
                        		store.sync();
                        	}
                        };
                    }
                },{text: i18n.getKey('id'),  dataIndex: 'id',sortable : false},
		        { text: i18n.getKey('code'),  dataIndex: 'code',sortable : false},
		        { text: i18n.getKey('title'), dataIndex: 'title' ,sortable : false},
		        { text: i18n.getKey('description'), dataIndex: 'description' ,sortable : false },
		        { text: i18n.getKey('sortOrder'), dataIndex: 'sortOrder'},
		        { text: i18n.getKey('available'), dataIndex: 'available',sortable : false,
		        	renderer : function(value){
		        		var va = value ? "yes":"no";
		        		return i18n.getKey(va);
		        	}
		        }
		       
		    ],
		    tbar : [{
		    	xtype : 'button',
				text : i18n.getKey('addShippingMethod'),
				width : 100,
				style : {
					marginLeft : '5px'
				},
				handler : function(button){
					var window = Ext.getCmp("paymentWindow");
					if(! window){
						createWindow(false,paymentStore);
					}
				}
		    }]
		});
	
	//最后把page放到viewport中 只适应大小
			new Ext.container.Viewport({
				renderTo: Ext.getBody(),
				id : 'viewport',
				items: [page],
				layout: 'border'
			});
//		}
//	});
	
	
	function editAction(view, rowIndex, colIndex){
		var window = Ext.getCmp("paymentWindow");
		if(window == null ){
			createWindow(true);
			window = Ext.getCmp("paymentWindow");
			var codeField = window.child('form').getComponent('code');
			codeField.setDisabled(true);
		}
		var store = page.getStore();
	    var data = store.getAt(rowIndex);
        window.shippingId = data.getId();
		formLoadData(data,window.child("form"));
	}
	function formLoadData(data,form){
		form.form.currentMode = 'editing';
		form.form.setValuesByModel(data);
	}
});
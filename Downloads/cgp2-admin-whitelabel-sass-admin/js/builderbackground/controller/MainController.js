Ext.define("CGP.builderbackground.controller.MainController",{
	

	constructor : function(config){
		var me = this;

		me.callParent(arguments);
	},
	
	// 将产品查询中的输入的字段加入到store中的extraParams中
    // 查询产品
    productSearch : function(btn){
    	var query = [];
    	var items = btn.ownerCt.items.items;

    	var store = btn.ownerCt.ownerCt.getStore();
    	
    	for(var i = 0; i < items.length; i++){
    		if(items[i].xtype != 'button' && !Ext.isEmpty(items[i].getValue())){
    			var filter = {};
    			filter.value = "%"+ items[i].getValue() + "%";
    			filter.name =items[i].name;
    			filter.type = 'string';
    			query.push(filter);
    		}
    	}
    	if(!Ext.isEmpty(query)){
    		store.proxy.extraParams = {
	            filter: Ext.JSON.encode(query)
	        };
    	}else{
    		store.proxy.extraParams = null;
    	}
    	store.loadPage(1);
    },
    // 清空产品查询中输入的字符
    // 并设置store中的extraParams为空
    clearProductSearch : function(btn){
    	var items = btn.ownerCt.items.items;
    	var store = btn.ownerCt.ownerCt.getStore();
    	
    	for(var i = 0;i < items.length;i++){
    		if(items[i].xtype == 'button'){
    			continue;
    		}
    		items[i].setValue(null);
    	}
    	store.proxy.extraParams = null;
    },
    
    
    //由grid的rowexpand插件的展开事件触发
    expandBody : function(rowNode, record, expandRow){
    	var expandDom;
    	expandDom = document.getElementById("builder_background_"+record.get("id"));
    	if(!expandDom.innerHTML){
	    	var expandGrid = Ext.create("CGP.builderbackground.view.plugin.ExpandGrid",{
	    		renderTo : expandDom,
	    		record : record
	    	});
    	}
    },
    
    checkCategory : function(record){
    	var me = this;
    	var win = Ext.create("Ext.window.Window",{
    		title : i18n.getKey('ModifyCategory'),
    		width : 300,
    		height : 200,
    		modal : true,
    		bodyStyle : {
    			padding : "5px"
    		},
    		bbar : ["->",{
				text : i18n.getKey('save'),
				handler : function(){
					me.saveCategory(record,win);
				}
    		},{
    			text : i18n.getKey('cancel'),
    			handler : function(){
    				win.close();
    			}
    		}],
    		items : [{
    			xtype : 'combo',
    			labelAlign : 'right',
				name : "backgroundClassIds",
				fieldLabel : i18n.getKey('builderbackgroundclass'),
				allowBlank : false,
				itemId : 'backgroundClass',
				store : Ext.create("CGP.builderbackgroundclass.store.BuilderBackgroundClass",{
					pageSize:1000
				}),
				displayField : "name",
				valueField : 'id',
				multiSelect : true,
				value : record.get("backgroundClassIds")
    		}]
    	});
    	win.show();
    },
    saveCategory : function(record,win){
    	var me = this;
    	var value = win.getComponent("backgroundClass").getValue();
    	var url = adminPath + 'api/admin/builderbackground/'+record.get("id")+"/modifyclass";
    	var paramsStr = "";
    	for(var i = 0 ; i < value.length ;i++){
    		paramsStr = paramsStr + "backgroundClassIds=" + value[i];
    		if(i < value.length - 1){
				paramsStr = paramsStr + "&";    			
    		}
    	}
    	if(!Ext.isEmpty(value)){
	    	Ext.Ajax.request({
	    		url : url + "?" +paramsStr,
	    		method : 'PUT',
	    		headers : {
	    			"Content-Type" : "application/json;charset=UTF-8",
					Authorization : 'Bearer' + Ext.util.Cookies.get("token")	
	    		},
	    		success : function(response,options){
	    			win.close();
	    			record.set("backgroundClassIds",value);
	    			record.commit();
	    			var r = Ext.decode(response.responseText);
	    			Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
	    		},
	    		failure : function(response,options){
	    			var r = Ext.decode(response.responseText);
	    			Ext.Msg.alert(i18n.getKey('prompt'),r.message);
	    		}
	    	});
    	}
    },
    
    checkProduct : function(record){
    	var me = this;
    	
    	//这里新建这个controller只为用里面的setSubmitValue方法；
    	var controller = Ext.create("CGP.builderbackground.controller.Product");
    	
    	var win = Ext.create("Ext.window.Window",{
    		title : i18n.getKey('modifyProduct'),
    		modal : true,
    		layout : 'fit',
    		bbar : ["->",{
				text : i18n.getKey('save'),
				handler : function(){
					me.saveProduct(record,win);
				}
    		},{
    			text : i18n.getKey('cancel'),
    			handler : function(){
    				win.close();
    			}
    		}],
    		items : [{
				xtype : 'gridfield',
				colspan : 2,
				labelAlign : "right",
				name : 'skuProductIds',
				valueType : 'id',
				width : 780,
//				height : 340,
				setSubmitValue: controller.setSubmitValue,
				itemId : 'product',
				fieldLabel : i18n.getKey('applyToProduct'),
				gridConfig : {
					height : 340,
					autoScroll : true,
					itemId : 'productList',
					store : Ext.create("CGP.builderbackground.store.Product",{
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
						handler : function(btn){
							var data = btn.ownerCt.ownerCt.getStore().data.items;
							var grid = btn.ownerCt.ownerCt;
							controller.openSelectProductWin(data,grid);
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
						width : 50,
						xtype : 'gridcolumn',
						itemId : 'id'
					},{
	                    text: i18n.getKey('name'),
	                    dataIndex: 'name',
	                    xtype: 'gridcolumn',
	                    itemId: 'name'
	                },{
	                    text: i18n.getKey('type'),
	                    dataIndex: 'type',
	                    xtype: 'gridcolumn',
	                    itemId: 'type'
	                },{
	                    text: i18n.getKey('sku'),
	                    dataIndex: 'sku',
	                    autoSizeColumn: false,
	                    width: 120,
	                    xtype: 'gridcolumn',
	                    itemId: 'sku'
	                },{
	                    text: i18n.getKey('model'),
	                    dataIndex: 'model',
	                    xtype: 'gridcolumn',
	                    itemId: 'model'
	                },{
	                    text: i18n.getKey('maincategory'),
	                    dataIndex: 'mainCategory',
	                    xtype: 'gridcolumn',
	                    itemId: 'mainCategory',
	                    renderer: function (mainCategory) {
	                        return mainCategory.name;
	                    }
	                }]
				}
			}]
    	});
    	win.show();
    	win.getComponent("product").setSubmitValue(record.get("skuProductIds"));
    	
    },
	
    //
    saveProduct : function(record,win){
    	var me = this;
    	var store = win.getComponent("product")._grid.getStore();
    	var value = [];
    	store.each(function(record){
    		value.push(record.get("id"));
    	});
    	if(!Ext.isEmpty(value)){
    		var url = adminPath + "api/admin/builderbackground/" +record.get("id")+ "/modifyproduct";
    		var params = "";
    		for(var i = 0 ; i < value.length; i++){
    			params = params + "productIds=" + value[i];
    			if(i < value.length - 1){
    				params = params + "&";
    			}
    		}
    		Ext.Ajax.request({
    			url : url + "?"+params,
    			method : 'PUT',
    			headers : {
    				Authorization : 'Bearer' + Ext.util.Cookies.get("token")
    			},
    			success : function(response,options){
    				win.close();
    				record.set("skuProductIds",value);
    				Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
    			},
    			failure : function(response,options){
    				var r = Ext.decode(response.responseText);
    				Ext.Msg.alert(i18n.getKey('prompt'),r.message);
    			}
    		});
    	}
    }
});
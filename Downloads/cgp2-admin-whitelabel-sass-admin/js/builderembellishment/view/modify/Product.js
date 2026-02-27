Ext.define("CGP.builderembellishment.view.modify.Product",{
	extend : 'Ext.window.Window',
	

	width : 900,
	height : 430,
	modal : true,
	
	controller : null,
	
	record : null, //一条装饰记录。
	initComponent : function(){
		var me = this;

		
		me.title = i18n.getKey('modifyProduct');
		me.bbar = ["->",{
			xtype : 'button',
			text : i18n.getKey('save'),
			iconCls : 'icon_save',
			handler : function(btn){
				me.controller.save(me.record,me.down("gridfield")._grid,me);
			}
		},{
			xtype : 'button',
			iconCls : "icon_cancel",
			text : i18n.getKey('cancel'),
			handler : function(btn){
				me.close();
			}
		}];
		me.items  = [{
				xtype : 'gridfield',
				colspan : 2,
				name : 'productIds',
				valueType : 'id',
				labelWidth :80,
				width : 800,
				itemId : 'product',
				fieldLabel : i18n.getKey('product'),
				labelAlign : 'right',
				gridConfig : {
					minHeight : 340,
					autoScroll : true,
					itemId : 'productList',
					store : Ext.create("CGP.promotionrule.store.Product",{
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
							var data = me.getComponent("product")._grid.getStore().data.items;
							var grid = me.getComponent("product")._grid;
							me.controller.openSelectProductWin(data,grid);
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
	                }, {
	                    text: i18n.getKey('maincategory'),
	                    dataIndex: 'mainCategory',
	                    xtype: 'gridcolumn',
	                    itemId: 'mainCategory',
	                    renderer: function (mainCategory) {
	                        return mainCategory.name;
	                    }
	                }]
				}
			}];
		me.callParent(arguments);
		me.initProduct();
	},
	initProduct : function(){
		var me = this;
		if(me.record != null && !Ext.isEmpty(me.record.get("products"))){
			var productIds = me.record.get("products");
			var url = adminPath + "api/admin/product/many";
			Ext.Ajax.request({
				url : url,
				params : {
					productIds : productIds
				},
				method : "GET",
				headers : {
					Authorization : 'Bearer'+ Ext.util.Cookies.get("token")
				},
				success : function(response,options){
					var r = Ext.decode(response.responseText);
					me.down("gridfield")._grid.getStore().loadData(r.data);
				}
			});
		}
	}
	
});
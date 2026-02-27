Ext.define("CGP.promotionrule.view.condition.ProductCondition",{
	extend : 'Ext.window.Window',
	alias : "widget.productCondition",
	requires : ["CGP.promotionrule.view.field.TreeField","CGP.promotionrule.view.field.GridField"],
	
	

	
	//存放的是控制自己这个控件的一些方法
	productController : null,
	
	constructor : function(config){
		var me = this;

		me.callParent(arguments);
		me.productController = Ext.create("CGP.promotionrule.controller.product.ProductController",{productCondition : this});
	},
	
	record : null,//一个产品条件model
	bodyPadding : '5 5 5 5',
	modal : true,
	width : 1000,
	height : 700,
	autoScroll : true,
	websiteId : null,
	
	initComponent : function(){
		var me = this;
		me.title = i18n.getKey('productCondition');
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
		
		me.productPage = Ext.create("Ext.form.FieldContainer",{
			fieldLabel : i18n.getKey('product'),
			labelAlign : 'right',
			labelWidth : 80,
			items : [{
				xtype : 'grid',
				minHeight : 300,
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
						var data = me.productPage.down("grid").getStore().data.items;
						me.productController.showAddProductWin(data,me.websiteId);
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
			}]
		});
		me.categoryPage = Ext.create("Ext.form.FieldContainer",{
			fieldLabel : i18n.getKey('maincategory'),
			labelAlign : 'right',
			labelWidth : 80,
			items : [Ext.create("CGP.promotionrule.view.product.CategoryTree",{
				websiteId : me.websiteId
			})]
		});
		
		me.items = [{
			xtype : 'radiogroup',
			itemId : 'productRule',
			name : 'productRule',
            fieldLabel : i18n.getKey('joinActive'),
            labelAlign: 'right',
            defaultType: 'radiofield',
            width : 300,
            columns: 2,
            items: [
                {
                    boxLabel  : i18n.getKey('allow'),
                    name      : 'productRule',
                    inputValue: 1
                }, {
                    boxLabel  : i18n.getKey('noAllow'),
                    name      : 'productRule',
                    checked : true,
                    inputValue: 0
                }
            ]
        },me.productPage,me.categoryPage];
		me.callParent(arguments);
		
		//如果record不是空就是编辑模式。
		if(!Ext.isEmpty(me.record) && me.record.get("id") != null){
				me.setValue(me.record.get("conditionObject"));
		}
		
	},
	
	getValue : function(){
		var me = this,
		productRule = me.getComponent("productRule"),
		records = me.productPage.down("grid").getStore().data.items,
		category = me.categoryPage.down("treepanel").getChecked( );
		
		var value = {type : 'product'};
			value.productRule = productRule.getValue().productRule;
		if(!Ext.isEmpty(records)){
			var ids = [];
			for(var i = 0; i < records.length;i++){
				ids.push(records[i].get("id"));
			}
			value.products = ids;
		}
		if(!Ext.isEmpty(category)){
			var ids = [];
			for(var i = 0; i < category.length;i++){
				ids.push(category[i].get("id"));
			}
			value.productCategories = ids;
		}
		if(records != null || category != null){
			return value;
		}
	},
	
	setValue : function(value){
		var me = this,productRule;
		//设置规则
		productRule = me.getComponent("productRule");
		var obj = {}; obj.productRule = value.productRule; 
		productRule.setValue(obj);
		//设置选择了那些产品
		if(!Ext.isEmpty(value.products))
		me.setProductValue(value);
		//设置选择了什么类目
		if(!Ext.isEmpty(value.productCategories))
		me.setCategoryValue(value);
	},
	
	setProductValue : function(value){
		var me = this, grid;
		grid =  me.productPage.down("grid");
		var store = grid.getStore();
		var newStore = Ext.create("Ext.data.Store",{
			model : 'CGP.promotionrule.model.Product',
			proxy: {
				extraParams : {
					productIds : value.products
				},
		        type: 'uxrest',
		        url: adminPath + "api/admin/product/many",
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
	},
	
	setCategoryValue : function(value){
		var me = this,categoryTree,rootNode,categoryIds;
		categoryTree = me.categoryPage.items.items[0];
		categoryIds = value.productCategories;
		categoryTree.on("initNode",function(tree, rootObject, successful){
			var ergodic = function(node,categoryIds){
				if(!Ext.isEmpty(node.children)){
					var childrens = node.children;
					for(var i = 0;i < childrens.length; i++){
						ergodic(childrens[i],categoryIds);
					}
				}
				if(categoryIds.includes(node.id)){
					node.checked = true;
				}
			}
			ergodic(rootObject,categoryIds);
		});
		
	}

	
});
Ext.Loader.setPath({
	enabled : true,
	"CGP.builderbackground" : path + 'js/builderbackground',
	"CGP.builderbackgroundclass" : path + 'js/builderbackgroundclass'
});
Ext.Loader.syncRequire("CGP.builderbackground.model.BuilderBackground");
Ext.Loader.syncRequire("CGP.builderbackground.view.face.BackgroundFaceGrid");
Ext.onReady(function(){


	
	var queryParams = Ext.Object.fromQueryString(location.search);
	
	var controller = Ext.create("CGP.builderbackground.controller.Product");
	
	var editPage = Ext.widget({
		xtype : 'uxeditpage',
		block : 'builderbackground',
		gridPage: 'builderbackground.html',
		formCfg : {
			model : "CGP.builderbackground.model.BuilderBackground",
			romoteCfg : false,
			defaults : {
				labelAlign : 'right'
			},
			items : [{
				xtype : 'textfield',
				name : 'name',
				fieldLabel : i18n.getKey('name'),
				itemId : 'name',
				allowBlank : false
			},{
				xtype : 'numberfield',
				name : 'sortOrder',
				fieldLabel : i18n.getKey('sortOrder'),
				allowBlank : false,
				allowDecimals : false,
				allowExponential : false,
				itemId : "sortOrder",
				value : 2
			},{
				xtype : 'textarea',
				name : 'keywords',
				fieldLabel : i18n.getKey('keywords'),
				allowBlank : false,
				itemId : 'keywords',
				height : 60
			},{
				xtype : 'textarea',
				name : 'description',
				fieldLabel : i18n.getKey('description'),
				allowBlank : false,
				itemId : 'description',
				height : 60
			},{
				xtype : 'combo',
				colspan : 2,
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
				value : queryParams.backgroundclass == null? null:Number(queryParams.backgroundclass)
			},{
				xtype : 'gridfield',
				colspan : 2,
				name : 'skuProductIds',
				valueType : 'id',
				width : 770,
				setSubmitValue: controller.setSubmitValue,
				itemId : 'product',
				fieldLabel : i18n.getKey('applyToProduct'),
				gridConfig : {
					minHeight : 200,
					maxHeight : 300,
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
	                    width : 130,
	                    xtype: 'gridcolumn',
	                    itemId: 'mainCategory',
	                    renderer: function (mainCategory) {
	                        return mainCategory.name;
	                    }
	                }]
				}
			},
				{
				xtype : 'backgroundfacegrid',
				name : "backgroundFaces",
				fieldLabel : i18n.getKey('backgroundImg'),
				store : Ext.create("CGP.builderbackground.store.TemporalFace"),
				itemId: "backgroundface"
			}]
		}
	});
	
});
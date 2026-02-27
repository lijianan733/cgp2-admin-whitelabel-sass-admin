Ext.define("CGP.builderembellishment.view.upload.Upload", {
	extend : 'Ext.window.Window',



	layout : 'border',
	modal : true,
	width : 1000,
	height : 600,
	builderEmbellishmentStore : null,
	
	initComponent : function() {
		var me = this;


		me.title = i18n.getKey('upload ')+ i18n.getKey('embellishmentImg');
		var embellishmentClassStore = Ext.create("CGP.builderembellishment.store.BuilderEmbellishmentClass");
		var uploadController = Ext.create("CGP.builderembellishment.controller.Upload");
		
		me.items = [{
			xtype : "uxform",
			id : 'uploadform',
//			model : 'CGP.builderembellishment.store.BuilderEmbellishment',
			frame : true,
			name : 'Upload new BuilderBackground',
			region : 'center',
			formBind : true,
			layout : {
				type : 'table',
				columns : 2
			},
			items : [{
				xtype : 'textfield',
//				width : 300,
				name : 'name',
				fieldLabel : i18n.getKey('name'),
				labelAlign : 'right',
				itemId : 'name',
				allowBlank : false
			},{
				xtype : 'combo',
//				width : 300,
				name : 'embellishmentClassIds',
				multiSelect : true,
				allowBlank : false,
				itemId : 'embellishment',
				fieldLabel : i18n.getKey('embellishmentclass'),
				store  : embellishmentClassStore,
				displayField : "name",
				valueField : 'id'
			},{
				xtype : 'textarea',
				labelAlign : 'right',
				allowBlank : false,
				width: 380,
				height : 130,
				name : 'keywords',
				itemId : 'keywords',
				fieldLabel : i18n.getKey('keywords')
			},{
				xtype : 'uxfilefield',
				labelAlign : 'right',
				name : 'files',
                onlyImage: true,
				allowBlank : false,
				buttonText : i18n.getKey('browser'),
				fieldLabel : i18n.getKey('embellishmentImg'),
				buttonConfig : {
					width : 70
				},
				width : 580,
				height : 130,
				itemId : 'file'
			},{
				xtype : 'gridfield',
				colspan : 2,
				name : 'productIds',
				valueType : 'id',
				width : 900,
				itemId : 'product',
				fieldLabel : i18n.getKey('product'),
				labelAlign : 'right',
				gridConfig : {
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
							var data = me.down("form").getComponent("product")._grid.getStore().data.items;
							var grid = me.down("form").getComponent("product")._grid;
							uploadController.openSelectProductWin(data,grid);
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
			}],
			bbar : ["->",{
						xtype : 'button',
						iconCls : 'icon_save',
						text : i18n.getKey('submit'),
						handler : function() {
							me.upload();
						}
					}, {
						xtype : 'button',
						text : i18n.getKey('cancel'),
						iconCls : 'icon_delete',
						handler : function() {
							var form = this.ownerCt.ownerCt;
							form.ownerCt.close();
						}
					}]
		}];
		
		me.callParent(arguments);
	},

	//上传装饰图的方法
	upload : function() {
		var me = this, form = me.child("uxform");
		var file = form.getComponent('file').getValue();

		// 将items转为htmlform
		if(form.isValid( )){
			form.getForm().submit({
						success : function(form, action) {
							var response = action.response;
							if (response.success) {
								me.builderEmbellishmentStore.loadPage(1);
								me.close();
							} else {
								Ext.Msg.alert(i18n.getKey('prompt'), response.message);
							}
						}
					});
		}
	}
});
Ext.Loader.setPath({
	enabled : true,
	"CGP.builderbackground" : path + 'js/builderbackground',
	"CGP.builderbackgroundclass" : path + 'js/builderbackgroundclass'
});

Ext.onReady(function(){


	
	var queryParams = Ext.Object.fromQueryString(location.search);
	
	var backgroundStore = Ext.create("CGP.builderbackground.store.BuilderBackground");
	var backgroundClassStore = Ext.create("CGP.builderbackgroundclass.store.BuilderBackgroundClass",{
		pageSize : 1000,
		listeners : {
			load : function(store, records, successful){
				mainPage.grid.getView().refresh();
			}
		}
	});
	var controller = Ext.create("CGP.builderbackground.controller.MainController");
	var productStore = Ext.create("CGP.builderbackground.store.Product");
	
	var mainPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builderbackground'),
        block: 'builderbackground',
        editPage: 'edit.html',
        gridCfg: {
            store: backgroundStore,
            frame: false,
//            columnDefaults: {
//                autoSizeColumn: true
//            },
            plugins : [{
            	ptype : 'rowexpander',
            	rowBodyTpl : new Ext.XTemplate("<div id='builder_background_{id}'></div>")
            }],
            viewConfig : {
            	listeners : {
            		expandbody : function(rowNode, record, expandRow){
            			controller.expandBody(rowNode, record, expandRow);
            		}
            	}
            },
            columns: [{
            	xtype : 'componentcolumn',
            	text : i18n.getKey('operation'),
            	itemId : 'operation',
            	renderer : function(value,metadata,record){
            		return {
            			xtype : 'toolbar',
            			layout : 'column',
            			style : 'padding : 0',
            			items : [{
	            			text : i18n.getKey('options'),
	            			width : '100%',
	            			menu : {
	            				items : [{
	            					text : i18n.getKey('ModifyCategory'),
	            					handler : function(btn){
	            						controller.checkCategory(record);
	            					}
	            				},{
	            					text : i18n.getKey('modifyProduct'),
	            					handler : function(){
										controller.checkProduct(record);     					
	            					}
	            				}]
	            			}
	            		}]
            		};
            	}
            },{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
   			}, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                width : 100,
                itemId: 'name',
                sortable: false
   			}, {
                text: i18n.getKey('keywords'),
                dataIndex: 'keywords',
                xtype: 'gridcolumn',
                itemId: 'keywords',
                width : 100,
                sortable: false
   			}, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                xtype: 'gridcolumn',
                itemId: 'description',
                sortable: false,
                minWidth : 150
   			},{
   				text : i18n.getKey('applyToFace'),
   				dataIndex : 'backgroundFaces',
   				xtype : 'gridcolumn',
   				itemId : 'backgroundFaces',
   				sortable : false,
   				renderer : function(value,metadata,record){
   					var faces = record.get("backgroundFaces");
   					var valueStr = "";
   					for(var i = 0; i < faces.length; i++){
   						valueStr = valueStr + faces[i].name;
						if(i <faces.length -1){
							valueStr = valueStr + ",";
						}   					
   					}
   					return valueStr;
   				}
   			},{
   				text : i18n.getKey('builderbackgroundclass'),
   				dataIndex : 'backgroundClassIds',
   				renderer : function(value, metadata, record){
   					if(Ext.isEmpty(backgroundClassStore.data.items)){
   						return "";
   					}else{
   						var result = "";
   						for(var i = 0; i < value.length; i++){
   							var record = backgroundClassStore.getById(value[i]);
   							result = result + record.get("name");
   							if(i < value.length - 1)
   								result = result + ",";
   						}
   						return result;
   					}
   				}
   			}]
        },
        filterCfg: {
            items: [{
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'keywords',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('keywords'),
                itemId: 'keywords'
            },{
            	name : "backgroundClass",
            	xtype : 'combo',
            	store : Ext.create("CGP.builderbackgroundclass.store.BuilderBackgroundClass"),
            	displayField : "name",
            	valueField : 'id',
            	fieldLabel : i18n.getKey('builderbackgroundclass'),
            	itemId : 'backgroundClass',
            	value : queryParams.backgroundclass == null? null:Number(queryParams.backgroundclass)
            },{
            	name : 'faceCode',
            	xtype : "combo",
            	store : Ext.create("CGP.builderbackground.store.SelectFace"),
            	displayField : 'name',
            	valueField : 'code',
            	fieldLabel : i18n.getKey('applyToFace'),
            	itemId : "faceCode"
            }, {
				name : 'products',
				xtype : 'gridcombo',
				width : 360,
				fieldLabel : i18n.getKey('product'),
				itemId : 'product',
				store : productStore,
				multiSelect : false,
				displayField : "name",
				valueField : 'id',
				matchFieldWidth : false,
				pickerAlign : 'bl',
				queryMode : 'remote',
				gridCfg : {
					store : productStore,
					width : 600,
					height : 300,
					columns : [{
								text : i18n.getKey('id'),
								width : 60,
								dataIndex : 'id'
					}, {
								text : i18n.getKey('name'),
								width : 250,
								dataIndex : 'name'
					}, {
								text : i18n.getKey('model'),
								width : 130,
								dataIndex : 'model'
					}, {
								text : i18n.getKey('sku'),
								width : 140,
								dataIndex : 'sku'
					}],
					tbar : {
							layout : 'column',
							defaults : {
							width : 170
							},
							items : [{
									xtype : 'textfield',
									name : "name",
									labelWidth : 40,
									fieldLabel : i18n.getKey('name')
							}, {
									xtype : 'textfield',
									name : 'model',
									labelWidth : 40,
									fieldLabel : i18n.getKey('model')
							}, {
									xtype : 'textfield',
									name : 'sku',
									labelWidth : 40,
									fieldLabel : i18n.getKey('sku')
							}, {
									xtype : 'button',
									itemId : 'search',
									text : i18n.getKey('search'),
									width : 80,
									handler : function(btn) {
										controller.productSearch(btn);
									}
							}, {
									xtype : 'button',
									text : i18n.getKey('clear'),
									width : 80,
									handler : function(btn) {
										controller.clearProductSearch(btn);
									}
							}]
						},
					bbar : Ext.create('Ext.PagingToolbar', {
							store : productStore,
							displayInfo : true, // 是否 ? 示， 分 ? 信息
							emptyMsg : i18n.getKey('noData')
					}),
					listeners : {
							"render" : function(comp) {
							comp.el.on("keydown", function(event,target) {
									if (event.button == 12) {
										var toolbar = comp.child("toolbar");
										var searchButton = toolbar.getComponent("search");
										searchButton.handler(searchButton);
									}
							});
						}
					}
				}
			}]
        }
    });
});
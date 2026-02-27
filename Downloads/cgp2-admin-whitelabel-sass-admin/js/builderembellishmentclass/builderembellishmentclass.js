Ext.onReady(function () {




    var store = Ext.data.StoreManager.lookup('builderBackgroundClassStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('embellishmentclass'),
        block: 'builderembellishmentclass',
        editPage: 'edit.html',
        activeBtn: ['create', 'load', 'export'],
        gridCfg: {
            store: store,
            frame: false,
            columns: [{
            		xtype : 'componentcolumn',
            		text : i18n.getKey('operation'),
            		itemId : 'operation',
            		sortable : false,
            		renderer : function(value, metadata,record){
            			return {
            				xtype : 'toolbar',
            				layout : 'column',
            				style : 'padding : 0px',
            				items : [{
            					width : '100%',
            					text : i18n.getKey('options'),
            					menu : {
            						items : [{
            							text : i18n.getKey('checkEmbellishment'),
										handler : function(){
											JSOpen({
												refresh: true,
                                                id: 'builderembellishmentpage',
                                                url: path + 'partials/builderembellishment/builderembellishment.html?embellishmentclass='+record.get('id') 
                                                	+"&name=" +record.get("name"),
                                                title: i18n.getKey('embellishment')
                                            });
										}
            						}]
            					}
            				}]
            			}
            		}
            	},{
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true,
                    width: '10%'
   				}, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: true,
                    width: 200
   				}, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: true,
                    width: 460
   				}]
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
     		}, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
     		}, {
                id: 'descriptionSearchField',
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
     		}]
        }
    });
});
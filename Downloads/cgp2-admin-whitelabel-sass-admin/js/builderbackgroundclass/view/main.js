Ext.Loader.setPath({
	enabled : true,
	"CGP.builderbackgroundclass" : path + "js/builderbackgroundclass"
});
Ext.onReady(function(){
	


	
	var store = Ext.create("CGP.builderbackgroundclass.store.BuilderBackgroundClass");
	
	var mainPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builderbackgroundclass'),
        block: 'builderbackgroundclass',
        editPage: 'edit.html',
        activeBtn: ['create', 'load', 'export'],
        tbarCfg : {
        	disabledButtons :["delete"]
        },
        gridCfg: {
            store: store,
            frame: false,
            columns: [{
            		text : i18n.getKey('operation'),
            		xtype : 'componentcolumn',
            		sortable: false,
            		width : 100,
            		renderer : function(value,metadata,record){
            			return {
            				xtype : 'toolbar',
            				layout : "column",
            				style : 'padding : 0px',
            				items : [{
            					width : '100%',
            					text : i18n.getKey('options'),
            					menu : {
            						items : [{
										text : i18n.getKey('checkBackground'),
										handler : function(){
											JSOpen({
                                                id: 'builderbackgroundpage',
                                                url: path + 'partials/builderbackground/builderbackground.html?backgroundclass='+record.get('id'),
                                                title: i18n.getKey('builderbackground')
                                            });
										}
            						},{
            							text : i18n.getKey('create') + i18n.getKey('builderbackground'),
            							handler : function(){
            								JSOpen({
                                                id: 'builderbackground_edit',
                                                url: path + 'partials/builderbackground/edit.html?backgroundclass='+record.get("id"),
                                                title: i18n.getKey('create')+"_"+i18n.getKey('builderbackground')
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
Ext.Loader.setPath({
	enabled : true,
	"CGP.builderembellishment" : path + 'js/builderembellishment'
});
Ext.onReady(function () {




//    var controller = Qpp.CGP.BuilerBackground.Controller;
	var embellishmentClassStore = Ext.create("CGP.builderembellishment.store.BuilderEmbellishmentClass");
    
    // JS的去url的参数的方法，用来页面间传参
    var urlParams = Ext.Object.fromQueryString(location.search);
    var modifyProductController = Ext.create("CGP.builderembellishment.controller.ModifyProduct");
    
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18Block: i18n.getKey('builderBackground'),
        block: 'builderBackground',
        id: 'bbgGridPage',
        //editPage: 'edit.html',
        gridCfg: {
            editAction: false,
            store: Ext.create("CGP.builderembellishment.store.BuilderEmbellishment"),
            columns: [{
                text: i18n.getKey('operation'),
                xtype : "componentcolumn",
                width: 100,
                tdCls: 'vertical-middle',
                itemId: 'roleColumn',
                renderer: function (value,metadata,record) {
//                    return "<a href='#' style=' text-decoration:none'><font color='blue'>" + resource.ModifyCategory + "</font></a>";
                	return {
                		xtype : 'toolbar',
                		layout : 'column',
                		style : 'padding : 0',
                		items : [{
                			text : i18n.getKey('options'),
                			width : '100%',
                			flex: 1,
                			menu : {
                				xtype : 'menu',
                				items: [{
                                        text: i18n.getKey('ModifyCategory'),
                                        handler: function () {
                                            onModify(record);
                                        }
                                }, {
                                        text: i18n.getKey('modifyProduct'),
                                        handler: function () {
                                            modifyProductController.openModifyProductWin(record);
                                        }
                                }]
                			}
                		}]
                	}
                }
     		},{
                dataIndex: 'bbgClasses',
                text: i18n.getKey('backgroundclass'),
                itemId: 'backgroundClass',
                autoSizeColumn: true,
                tdCls: 'vertical-middle',
                renderer: function (value) {
                    var newValue = [];
                    if (Ext.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            embellishmentClassStore.each(function(record){
                            	if(record.get("id") == value[i]){
                            		 newValue.push(record.get("name"));
                            	}
                            });
                        }
                    }
                    return newValue.join('<br/>');
                }
            }, {
                text: i18n.getKey('thumbnail'),
                itemId: 'thumbnail',
                renderer: function (value, metadata, record) {
                    var url = imageServer + record.get('fileName') + '/100/100/png';
                    return '<img src="' + url + '" />';
                }
            }, {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                itemId: 'name',
                tdCls: 'vertical-middle'
            }, {
                dataIndex: 'format',
                text: i18n.getKey('format'),
                itemId: 'format',
                tdCls: 'vertical-middle'
            }, {
                dataIndex: 'width',
                text: i18n.getKey('width'),
                itemId: 'width',
                tdCls: 'vertical-middle'
            }, {
                dataIndex: 'height',
                text: i18n.getKey('height'),
                itemId: 'height',
                tdCls: 'vertical-middle'
            }, {
                dataIndex: 'originalFileName',
                text: i18n.getKey('originalFileName'),
                itemId: 'originalFileName',
                tdCls: 'vertical-middle'
            }],
            viewConfig: {
                listeners: {
                    viewready: function (dataview) {
                        Ext.each(dataview.panel.headerCt.gridDataColumns, function (column) {
                            if (column.autoSizeColumn === true)
                                column.autoSize();
                        })
                    }
                }
            }

        },
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('upload'),
                handler: function () {
                    var store = this.ownerCt.ownerCt.getStore();
                    var uploadPage = Ext.create("CGP.builderembellishment.view.upload.Upload",{
                    	builderEmbellishmentStore : store
                    });
                    uploadPage.show();
                    var field = uploadPage.child("uxform").getComponent("embellishment");
                    field.setValue(Ext.getCmp("bbgClassesSearchField").getSubmitValue());
                }
            }
        },
        filterCfg: {
            items: [{
                name: 'embellishmentName',
                itemId: 'nameSearchField',
                fieldLabel: i18n.getKey('name'),
                xtype: 'textfield'
            }, {
                name: 'format',
                itemId: 'formatSearchField',
                fieldLabel: i18n.getKey('format'),
                xtype: 'textfield'
            }, {
                name: 'width',
                itemId: 'widthSearchField',
                fieldLabel: i18n.getKey('width'),
                xtype: 'numberfield'
            }, {
                name: 'height',
                itemId: 'heightSearchField',
                fieldLabel: i18n.getKey('height'),
                xtype: 'numberfield'
            }, {
                name: 'originalFileName',
                itemId: 'originalFileNameSearchField',
                fieldLabel: i18n.getKey('originalFileName'),
                xtype: 'textfield'
            }, {
                name: 'bbgClass',
                id: 'bbgClassesSearchField',
                itemId: 'bbgClass',
                fieldLabel: i18n.getKey('embellishmentclass'),
                xtype: 'gridcombo',
                multiSelect: false,
                displayField: 'name',
                valueField: 'id',
                labelAlign: 'right',
                store: embellishmentClassStore,
                queryMode: 'remote',
                matchFieldWidth: false,
                pickerAlign: 'bl',
                gridCfg: {
                    store: embellishmentClassStore,
                    height: 200,
                    width: 400,
                    columns: [{
                        text: i18n.getKey('id'),
                        width: 40,
                        dataIndex: 'id'
     				}, {
                        text: i18n.getKey('name'),
                        width: 120,
                        dataIndex: 'name'
     				}, {
                        text: i18n.getKey('description'),
                        width: 200,
                        dataIndex: 'description'
     				}],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: embellishmentClassStore,
                        displayInfo: true
                    })
                },
                listeners:{
                	render : function (p) {
						var bbgClassSearch = p;
		                var searcher = Ext.Object.fromQueryString(location.search);
		                if (!Ext.isEmpty(searcher.embellishmentclass)) {
		                	var value = {};
		                	value.id = parseInt(searcher.embellishmentclass);
		                	value.name = searcher.name;
//		                    bbgClassSearch.store.load({
//		                        callback: function (records, options, success) {
		                            bbgClassSearch.setValue(value);
//		                            page.grid.getStore().loadPage(1);
//		                        }
//		                    });
		                }
		            }
                }
            }]
        }
//        listeners: {
//            afterload: function (p) {
//				var bbgClassSearch = p.filter.getComponent('bbgClass');
//                var searcher = Ext.Object.fromQueryString(location.search);
//                if (!Ext.isEmpty(searcher.embellishmentclass)) {
//                	var value = {};
//                	value.id = parseInt(searcher.embellishmentclass);
//                	value.name = searcher.name;
//                    bbgClassSearch.store.load({
//                        callback: function (records, options, success) {
//                            bbgClassSearch.setValue(value);
//                            p.grid.getStore().loadPage(1);
//                        }
//                    });
//
//                }
//               
//
//            }
//        }
    });


});

// 此方法用于父iframe调用来加载 改变页面数据
function iframeLoad(id, name) {
    var p = Ext.getCmp('bbgGridPage');
    var bbgClassSearch = p.filter.getComponent('bbgClass');
    var searcher = {
        id: id,
        name: name
    };
    if (!Ext.isEmpty(searcher)) {
        bbgClassSearch.store.load({
            callback: function (records, options, success) {
                bbgClassSearch.setValue(searcher);
                p.grid.getStore().loadPage(1);
            }
        });

    }
}
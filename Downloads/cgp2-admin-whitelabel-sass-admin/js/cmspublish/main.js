Ext.onReady(function () {




//    initController(window, optionStore, resource, adminPath + 'api/admin/attribute/{0}/option');
    //选项管理的controller
    var controller = Ext.create("CGP.cmspublish.controller.MainController");

    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('cmspublish'),
        block: 'cmspublish',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create("CGP.cmspublish.store.CmsPublishStore"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('operator'),
                width : 120,
                xtype : "componentcolumn",
                renderer: function (value, metadata, record) {
                        return {
                            xtype : 'displayfield',
                            value : '<a href="#")>'+i18n.getKey('managerPublishTask')+'</a>',
                            listeners : {
                                render : function(display){
                                    display.getEl().on("click",function(){
                                        controller.openOptionWindow(record);
                                    });
                                }
                            }
                        };
                }
            }, {
                text: i18n.getKey('id'),
                width : 60,
                dataIndex: 'id',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width : 100,
                itemId: 'name',
                sortable: true
            }, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                width : 150,
                itemId: 'description',
                sortable: true
            }/*, {
                text: i18n.getKey('publishTasks'),
                dataIndex: 'tasks',
                width : 350,
                delimiter: ';',
                xtype: 'arraycolumn',
                itemId: 'tasks',
                sortable: false,
                lineNumber: 1,
                renderer: function (v, record) {
                    return "("+i18n.getKey('taskCommand')+':'+v['command']+','+i18n.getKey('description')+':'+v['description']+")";
                }
            }*/]
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                id: 'description',
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }]
        }
    });
});
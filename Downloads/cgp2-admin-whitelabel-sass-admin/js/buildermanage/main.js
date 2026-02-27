Ext.onReady(function () {

    var controller = Ext.create("CGP.buildermanage.controller.Controller");
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: []
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('builder')+i18n.getKey('manager'),
        block: 'buildermanage',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'buildermanage',
                        url: path + 'partials/buildermanage/edit.html?editOrNew=new',
                        title: i18n.getKey('new')+i18n.getKey('builder'),
                        refresh: true
                    });
                }
            }
        },
        gridCfg: {
            //store.js
            store: Ext.create("CGP.buildermanage.store.ConfigStore"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            editActionHandler: showTabEdit,
            columns: [
                /*{
                    text: i18n.getKey('operator'),
                    width: 80,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        var configModelId = record.getId();
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#">' + i18n.getKey('managerOptions') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        Ext.create('CGP.buildermanage.view.ManageConfigVersion',{
                                            configModelId: configModelId
                                        })
                                    });
                                }
                            }
                        };
                    }
                },*/
                {
                    text: i18n.getKey('id'),
                    width: 120,
                    isLike: false,
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('builder')+i18n.getKey('name'),
                    dataIndex: 'builderName',
                    width: 120,
                    itemId: 'builderName'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 200,
                    itemId: 'description'
                }, {
                    text: i18n.getKey('相关配置的支持版本'),
                    dataIndex: 'schemaVersion',
                    minWidth: 150,
                    flex: 1,
                    itemId: 'supportLanguage',
                    renderer: function (value, metadata, record) {
                        var result = [];
                        if (value) {
                            result.push({
                                title: '导航配置支持版本',
                                value: value['supportNavigationSchemaVersion']
                            });
                            result.push({
                                title: 'builderView支持版本',
                                value: value['supportBuilderViewSchemaVersion']
                            });
                        }
                        return JSCreateHTMLTable(result);
                    }
                }
            ]
        },
        filterCfg: {
            minHeight: 125,
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    id: 'nameSearchField',
                    name: 'builderName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('builderName'),
                    itemId: 'builderName'
                }
            ]
        }
    });
    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.get('_id');
        JSOpen({
            id: 'buildermanage',
            url: path + 'partials/buildermanage/edit.html?recordId=' + id+'&editOrNew=edit',
            title: i18n.getKey('edit')+i18n.getKey('builder'),
            refresh: true
        });
    }
});

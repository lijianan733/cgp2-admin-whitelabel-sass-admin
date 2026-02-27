Ext.onReady(function () {

    var controller = Ext.create("CGP.threedmodelconfig.controller.Controller");
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: []
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('threeDModel'),
        block: 'threedmodelconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: '3dmodelConfig',
                        url: path + 'partials/threedmodelconfig/edit.html?editOrNew=new',
                        title: i18n.getKey('new') + i18n.getKey('3dmodel'),
                        refresh: true
                    });
                }
            }
        },
        listeners: {
            afterload: function (p) {
                controller.copyModelConfig(p);
            }
        },
        gridCfg: {
            //store.js
            store: Ext.create("CGP.threedmodelconfig.store.ConfigStore"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            editActionHandler: showTabEdit,
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var modelId = record.getId();
                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            height: 26,
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            menu: [
                                {
                                    text: i18n.getKey('runtimeConfig'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        Ext.create('CGP.threedmodelconfig.view.ModelRunTimeConfigWin', {
                                            modelId: modelId
                                        });
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    width: 120,
                    isLike: false,
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'modelName',
                    width: 350,
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    itemId: 'description',
                    flex: 1
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
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
                    name: 'modelName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }
            ]
        }
    });

    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.get('_id');
        JSOpen({
            id: '3dmodelConfig',
            url: path + 'partials/threedmodelconfig/edit.html?recordId=' + id + '&editOrNew=edit',
            title: i18n.getKey('edit') + i18n.getKey('3dmodel'),
            refresh: true
        });
    }
});

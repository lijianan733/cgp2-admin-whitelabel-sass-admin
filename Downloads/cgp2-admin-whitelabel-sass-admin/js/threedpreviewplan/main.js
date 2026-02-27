Ext.onReady(function () {
    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('threeDPreviewPlan'),
        block: 'threedpreviewplan',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create("CGP.threedpreviewplan.store.store"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    dataIndex: '_id',
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
                            menu: [{
                                text: i18n.getKey('preview') + i18n.getKey('testPlan'),
                                disabledCls: 'menu-item-display-none',
                                handler: function () {
                                    var defaultTestPlan = value;
                                    JSOpen({
                                        id: 'previewTestPlan',
                                        url: path + "partials/threedpreviewplan/preview.html?defaultTestPlan=" + defaultTestPlan,
                                        title: i18n.getKey('preview') + '_' + i18n.getKey('testPlan'),
                                        refresh: true
                                    });
                                }
                            }]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    width: 120,
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true
                }, {
                    text: i18n.getKey('status'),
                    width: 70,
                    dataIndex: 'status',
                    itemId: 'status',
                    renderer: function (value) {
                        return i18n.getKey(value);
                    }

                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 100,
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 250,
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
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    id: 'descriptionSearchField',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }
    });
});

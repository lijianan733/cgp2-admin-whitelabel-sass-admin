Ext.Loader.syncRequire(['CGP.common.store.WebsiteObject']);
Ext.onReady(function () {


    var websiteStore = Ext.StoreManager.lookup('websiteStore');
    var store = Ext.create("CGP.cmsvariable.store.CmsVariable");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmsvariable'),
        block: 'cmsvariable',
        editPage: 'edit.html',

        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 180,
                    sortable: false,
                    itemId: 'variableName'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'variableType',
                    sortable: false
                },
                {
                    text: i18n.getKey('selector'),
                    dataIndex: 'selector',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'selector',
                    sortable: false
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 180,
                    xtype: 'gridcolumn',
                    itemId: 'variableCode',
                    sortable: false
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 180,
                    itemId: 'description',
                    sortable: false
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    width: 120,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value.name + '"';
                        return value.name;
                    }
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'value',
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex) {
                        return {
                            xtype: 'displayfield',
                            value: "<a href='#' style='text-decoration: none'>" + i18n.getKey('check') + "</font>",
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];
                                    var ela = Ext.fly(a);
                                    ela.on("click", function () {
                                        var win = Ext.create("Ext.window.Window", {
                                            id: "cmsvariablevalue",
                                            width: 400,
                                            height: 400,
                                            modal: true,
                                            autoScroll: true,
                                            title: i18n.getKey('value'),
                                            html: value
                                        });
                                        win.show();
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'variableName'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'variableCode'
                },
                {
                    name: 'selector',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('selector'),
                    itemId: 'selector'
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    itemId: 'variableType',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'REST_API_LIST', value: 'REST_API_LIST'
                            },
                            {
                                type: 'JSON_OBJ', value: 'JSON_OBJ'
                            },
                            {
                                type: 'REST_API', value: 'REST_API'
                            },
                            {
                                type: 'CONSTANT', value: 'CONSTANT'
                            },
                            {
                                type: 'URL', value: 'URL'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('type'),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local',
                },
                {
                    fieldLabel: i18n.getKey('website'),
                    id: 'websiteSearch',
                    name: 'website.id',
                    itemId: 'website',
                    xtype: 'combo',
                    store: websiteStore,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    value: 11,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                this.insert(0, {
                                    id: null,
                                    name: i18n.getKey('allWebsite')
                                });
                                // combo.select(store.getAt(0));
                            });
                        }
                    }
                }
            ]
        }

    });
});
/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    "CGP.systembuilderconfig.model.SystemBuilderConfigModel"
]);
Ext.onReady(function () {
    var languageStore = Ext.create('CGP.language.store.LanguageStore')
    var editPage = Ext.widget({
        block: 'systembuilderconfig',
        xtype: 'uxeditpage',
        readOnly:true,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.systembuilderconfig.model.SystemBuilderConfigModel',
            layout: {
                type: 'vbox'
            },
            fieldDefaults: {
                width: 450,
            },
            useForEach: true,
            remoteCfg: false,
            items: [
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfig'
                },
                {
                    name: 'builderUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('builderUrl'),
                    itemId: 'builderUrl',
                    allowBlank: false
                },
                {
                    name: 'version',
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('version'),
                    itemId: 'version'
                },
                {
                    name: 'userPreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('userPreviewUrl'),
                    allowBlank: true,
                    itemId: 'userPreviewUrl',
                },
                {
                    name: 'manufacturePreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('manufacturePreviewUrl'),
                    allowBlank: true,
                    itemId: 'manufacturePreviewUrl',
                },
                {
                    name: 'platform',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('platform'),
                    allowBlank: false,
                    itemId: 'platform',
                    editable: false,
                    valueField: 'value',
                    value: 'PC',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'PC',
                                display: 'PC'
                            }, {
                                value: 'Mobile',
                                display: 'Mobile'
                            }
                        ]
                    })
                },
                {
                    name: 'supportLanguage',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('supportLanguage'),
                    allowBlank: false,
                    itemId: 'supportLanguage',
                    displayField: 'name',
                    valueField: 'id',
                    msgTarget: 'side',
                    store: languageStore,
                    matchFieldWidth: false,
                    editable: false,
                    pickerAlign: 'bl',
                    multiSelect: true,
                    gridCfg: {
                        store: languageStore,
                        height: 280,
                        width: 800,
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                xtype: 'gridcolumn',
                                itemId: 'id',
                                sortable: true
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                xtype: 'gridcolumn',
                                itemId: 'name',
                                sortable: true
                            }, {
                                text: i18n.getKey('locale'),
                                dataIndex: 'locale',
                                xtype: 'gridcolumn',
                                itemId: 'locale',
                                sortable: true,
                                renderer: function (v) {
                                    if (v) {
                                        return v.name + '(' + v.code + ')';
                                    }
                                }
                            }, {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                xtype: 'gridcolumn',
                                itemId: 'code',
                                sortable: true,
                                renderer: function (v) {
                                    return v.code;
                                }
                            }, {
                                text: i18n.getKey('image'),
                                dataIndex: 'image',
                                xtype: 'gridcolumn',
                                minWidth: 120,
                                itemId: 'image',
                                sortable: true,
                                renderer: function (v) {
                                    var url = imageServer + v + '/64/64/png';
                                    return '<img src="' + url + '" />';
                                }
                            }, {
                                text: i18n.getKey('directory'),
                                dataIndex: 'directory',
                                xtype: 'gridcolumn',
                                itemId: 'directory',
                                sortable: true
                            }, {
                                text: i18n.getKey('sortOrder'),
                                dataIndex: 'sortOrder',
                                xtype: 'gridcolumn',
                                itemId: 'sortOrder',
                                sortable: true
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: languageStore,
                            displayInfo: true,
                            width: 275,
                            displayMsg: '',
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                },
                {
                    name: 'isSystemDefault',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('isSystemDefault'),
                    allowBlank: false,
                    itemId: 'isSystemDefault',
                    editable: false,
                    readOnly: true,
                    fieldStyle: 'background-color: silver',//设置文本框的样式
                    valueField: 'value',
                    value: 'false',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: true,
                                display: 'true'
                            }, {
                                value: false,
                                display: 'false'
                            }
                        ]
                    })
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'schemaVersion',
                    fieldLabel: i18n.getKey('相关配置的支持版本'),
                    itemId: 'schemaVersion',
                    labelAlign: 'top',
                    items: [
                        {
                            hidden: true,
                            value: 'com.qpp.cgp.domain.product.config.v2.builder.SchemaVersionConfig',
                            xtype: 'textfield',
                            name: 'clazz',
                            diySetValue: function () {
                                //调用空白的设置值处理，使其值不变

                            },
                        },
                        {
                            fieldLabel: i18n.getKey('builderView支持版本'),
                            name: 'supportBuilderViewSchemaVersion',
                            itemId: 'supportBuilderViewSchemaVersion',
                            xtype: 'multicombobox',
                            editable: false,
                            width: 400,
                            haveReset: true,
                            multiSelect: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'V1',
                                        display: 'V1'
                                    }, {
                                        value: 'V2',
                                        display: 'V2'
                                    }
                                ]
                            }),
                            valueField: 'value',
                            displayField: 'display'
                        },
                        {
                            fieldLabel: i18n.getKey('导航配置支持版本'),
                            name: 'supportNavigationSchemaVersion',
                            itemId: 'supportNavigationSchemaVersion',
                            xtype: 'multicombobox',
                            editable: false,
                            width: 400,
                            haveReset: true,
                            multiSelect: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'V1',
                                        display: 'V1'
                                    }, {
                                        value: 'V2',
                                        display: 'V2'
                                    }
                                ]
                            }),
                            valueField: 'value',
                            displayField: 'display'
                        }
                    ]
                }
            ]
        }
    });
});
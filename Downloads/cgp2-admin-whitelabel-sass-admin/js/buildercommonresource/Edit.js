/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    "CGP.buildercommonresource.model.CommonResourceModel"
]);
Ext.onReady(function () {
    var languageStore = Ext.create('CGP.language.store.LanguageStore')
    var editPage = Ext.widget({
        block: 'buildercommonresource',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.buildercommonresource.model.CommonResourceModel',
            layout: {
                type: 'vbox'
            },
            fieldDefaults: {
                width: 400,
            },
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
                }, {
                    name: 'version',
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('version'),
                    itemId: 'version'
                }, {
                    name: 'userPreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('userPreviewUrl'),
                    allowBlank: true,
                    itemId: 'userPreviewUrl',
                }, {
                    name: 'manufacturePreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('manufacturePreviewUrl'),
                    allowBlank: true,
                    itemId: 'manufacturePreviewUrl',
                }, {
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
                }, {
                    name: 'supportLanguage',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('supportLanguage'),
                    allowBlank: false,
                    itemId: 'supportLanguage',
                    displayField: 'name',
                    valueField: 'id',
                    msgTarget: 'side',
                    width: 400,
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
                    fieldStyle:'background-color: silver',//设置文本框的样式
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
                }]
        }
    });
});
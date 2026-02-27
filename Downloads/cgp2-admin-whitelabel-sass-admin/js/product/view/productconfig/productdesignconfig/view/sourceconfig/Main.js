/**
 * Created by nan on 2019/9/25.
 */
Ext.Loader.require([
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.view.EditSourceConfigWindow',
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.view.ExtraInfoColumn'
])
Ext.onReady(function () {
    // 创建一个GridPage控件
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var productBomConfigId = JSGetQueryString('productBomConfigId');
    var designId = JSGetQueryString('designId');
    var productId = JSGetQueryString('productId');
    var materialViewTypeIds = [];//记录已经添加了的数据
    var isLock = builderConfigTab.isLock;
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
        listeners: {
            load: function (store, records) {
                for (var i = 0; i < records.length; i++) {
                    if (records[i].get('materialViewTypeId')) {
                        materialViewTypeIds.push(records[i].get('materialViewTypeId'))
                    }
                }
                console.log(materialViewTypeIds);
            }
        }
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('add'),
                handler: function (view) {
                    var win = Ext.widget('editsourceconfigwindow', {
                        designId: designId,
                        readOnly: isLock,
                        sourceconfigstore: store,
                        materialViewTypeIds: materialViewTypeIds
                    });
                    win.show();
                }
            }
        },
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {
                var win = Ext.widget('editsourceconfigwindow', {
                    designId: designId,
                    readOnly: isLock,
                    sourceconfigstore: store,
                    record: record,
                    materialViewTypeIds: materialViewTypeIds
                });
                win.show();
            },
            columnDefaults: {
                autoSizeColumn: true,
                width: 200,
                tdCls: 'vertical-middle'
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: '_id',
                width: 100,
                itemId: 'id'
            }, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                itemId: 'description'
            }, {
                text: i18n.getKey('isNeedInitPageContent'),
                dataIndex: 'isNeedInitPageContent',
                itemId: 'isNeedInitPageContent'
            }, {
                text: i18n.getKey('type'),
                dataIndex: 'clazz',
                itemId: 'clazz',
                flex: 1,
                renderer: function (value, metadata, record) {
                    return value.split('.').pop();
                }
            }, {
                text: i18n.getKey('额外信息'),
                dataIndex: 'clazz',
                itemId: 'extraInfo',
                flex: 2,
                xtype: 'sourcedataextrainfocolumn',
            }]
        },
        // 查询输入框
        filterCfg: {
            defaults: {
                labelWidth: 150,
                width: 300
            },
            items: [
                {
                    name: 'designId',
                    xtype: 'textfield',
                    isLike: false,
                    hidden: true,
                    value: designId,
                    fieldLabel: i18n.getKey('designId'),
                    itemId: 'designId'
                },
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                }, {
                    xtype: 'combo',
                    name: 'clazz',
                    fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                    itemId: 'clazz',
                    editable: false,
                    valueField: 'value',
                    multiSelect: false,
                    displayField: 'display',
                    matchFieldWidth: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig',
                                display: 'RtObjectSourceConfig'
                            },
                            {
                                value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                                display: 'PageContentSourceConfig'
                            },
                            {
                                value: 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig',
                                display: 'PageContentTemplateSourceConfig'
                            },
                            {
                                value: 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig',
                                display: 'StaticPageContentLibrarySourceConfig'
                            }
                        ]
                    })
                }
            ]
        },
        listeners:{
            afterrender:function (){
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }
    });
});

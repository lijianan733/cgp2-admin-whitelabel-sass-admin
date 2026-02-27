/**
 * Created by nan on 2021/4/6
 */
Ext.Loader.syncRequire([])
Ext.onReady(function () {
    var store = Ext.create('CGP.productset.store.ProductSetStore');
    // 创建一个GridPage控件
    var productSetStore = Ext.create('CGP.productset.store.ProductSetStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'clazz',
                type: 'string',
                value: 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet'
            }])
        }
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('productSet'),
        block: 'productset',
        // 编辑页面
        editPage: 'edit.html',
        gridCfg: {
            // store是指store.js
            store: store,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    autoSizeColumn: false,
                    width: 120,
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    renderer: function (value, metadata, record) {
                        var mode = record.get('mode');
                        var modeResource = {'TEST': '测试', 'RELEASE': '正式'};
                        return value + '<' + '<text style="color: red">' + modeResource[mode] + '</text>' + '>';
                    }
                },
                {
                    dataIndex: 'clazz',
                    width: 200,
                    text: i18n.getKey('type'),
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.productssuit.SkuProductSet') {
                            return 'SKU';
                        } else if (value == 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet') {
                            return 'Configurable';
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 250,
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 250,
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    width: 250,
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('enabledDate'),
                    dataIndex: 'dateAvailable',
                    xtype: 'datecolumn',
                    itemId: 'dateAvailable',
                    renderer: function (date) {
                        return Ext.Date.format(date, 'Y-m-d');
                    }
                },
                {
                    text: i18n.getKey('salePrice'),
                    dataIndex: 'salePrice',
                    xtype: 'gridcolumn',
                    itemId: 'salePrice'
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('enabledDate'),
                    dataIndex: 'dateAvailable',
                    xtype: 'datecolumn',
                    itemId: 'dateAvailable',
                    renderer: function (date) {
                        return Ext.Date.format(date, 'Y-m-d');
                    }
                },
                {
                    text: i18n.getKey('salePrice'),
                    dataIndex: 'salePrice',
                    xtype: 'gridcolumn',
                    itemId: 'salePrice'
                },
                {
                    text: i18n.getKey('subCategories'),
                    dataIndex: 'subCategories',
                    xtype: 'gridcolumn',
                    itemId: 'subCategories',
                    renderer: function (subCategories) {

                        var value = [];
                        Ext.Array.each(subCategories, function (subCategory) {
                            value.push(subCategory.name + '(' + subCategory.id + ')');
                        })
                        return value.join(",");
                    }
                },
                {

                    dataIndex: 'configurableProductSet',
                    flex: 1,
                    minWidth: 250,
                    text: i18n.getKey('configurable') + i18n.getKey('productSet') + i18n.getKey('id'),
                    renderer: function (value, mateData, record) {
                        if (value) {
                            return value.id;
                        }
                    }
                },
            ]
        },
        // 查询输入框
        filterCfg: {
            minHeight: 120,
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    name: 'id',
                    isLike: false,
                    itemId: '_id'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    itemId: 'name'

                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    name: 'description',
                    itemId: 'description'
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    name: 'clazz',
                    itemId: 'clazz',
                    editable: false,
                    valueField: 'value',
                    isLike: false,
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet',
                                display: 'ConfigurableProductSet'
                            },
                            {
                                value: 'com.qpp.cgp.domain.productssuit.SkuProductSet',
                                display: 'SkuProductSet'
                            }
                        ]

                    })
                },
                {
                    xtype: 'gridcombo',
                    name: 'configurableProductSet._id',
                    valueType: 'idReference',
                    allowBlank: true,
                    haveReset: true,
                    fieldLabel: i18n.getKey('configurable') + i18n.getKey('productSet') + i18n.getKey('id'),
                    itemId: 'configurableProductSet',
                    displayField: 'id',
                    valueField: 'id',
                    msgTarget: 'side',
                    store: productSetStore,
                    matchFieldWidth: false,
                    editable: false,
                    multiSelect: false,
                    infoUlr: adminPath + 'api/productsets',
                    gridCfg: {
                        store: productSetStore,
                        height: 300,
                        width: 600,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 120,
                                dataIndex: 'id',
                                itemId: 'id',
                            },

                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 250,
                                itemId: 'name'
                            },
                            {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                itemId: 'description',
                                flex: 1
                            },
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: productSetStore,
                            displayInfo: true,
                        })
                    },
                    filterCfg: {
                        layout: {
                            type: 'column',
                            columns: 3
                        },
                        defaults: {
                            margin: 5
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                isLike: false,
                                itemId: '_id'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('description'),
                                name: 'description',
                                itemId: 'description'
                            }
                        ]
                    },
                }
            ]
        }
    });
});

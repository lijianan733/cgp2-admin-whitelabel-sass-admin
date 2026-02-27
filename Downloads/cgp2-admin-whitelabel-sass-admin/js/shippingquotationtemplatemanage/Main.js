/**
 *Created by shirley on 2021/8/23
 * 运费报价管理组件
 *
 * */

Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.store.AreaShippingConfigGroupStore',
    'CGP.shippingquotationtemplatemanage.store.CurrencyStore'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.shippingquotationtemplatemanage.store.AreaShippingConfigGroupStore');
    var currencyData = Ext.create('CGP.shippingquotationtemplatemanage.store.CurrencyStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('shippingQuotationTemplate'),
        block: 'shippingquotationtemplatemanage',
        editPage: 'edit.html',
        // 查询输入框
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    isLike: false
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    //TODO 接口不支持多个tag查询，待优化
                    name: 'tags',
                    xtype: 'multicombobox',
                    itemId: 'tags',
                    fieldLabel: i18n.getKey('Tag'),
                    editable: true,
                    multiSelect: true,
                    haveReset: true,
                    valueField: 'tag',
                    displayField: 'tag',
                    store: {
                        xtype: 'store',
                        fields: [{
                            name: 'tag',
                            type: 'string'
                        }],
                        data: []
                    }
                },
                {
                    name: 'currencyCode',
                    xtype: 'gridcombo',
                    itemId: 'currencyCode',
                    fieldLabel: i18n.getKey('currencyCode'),
                    editable: false,
                    isLike: true,
                    haveReset: true,
                    value: 'code',
                    displayField: 'code',
                    matchFieldWidth: false,
                    autoScroll: true,
                    getValue: function () {
                        var me = this;
                        if (!Ext.isEmpty(this.value[this.getRawValue()])) {
                            var data = this.value[this.getRawValue()];
                            return data.code;
                        }
                    },
                    store: currencyData,
                    filterCfg: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            margin: '5 0 5 0',
                            isLike: false,
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                isLike: false,
                                itemId: 'id',
                                hideTrigger: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('title'),
                                name: 'title',
                                itemId: 'title',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('code'),
                                name: 'code',
                                itemId: 'code',
                            },
                            {
                                xtype: 'numberfield',
                                name: 'website.id',
                                value: 11,
                                hidden: true
                            }
                        ]
                    },
                    gridCfg: {
                        height: 300,
                        width: 550,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                width: 50
                            },
                            {
                                name: '_id',
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('title'),
                                flex: 1,
                                dataIndex: 'title',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('code'),
                                flex: 1,
                                dataIndex: 'code',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('value'),
                                flex: 1,
                                dataIndex: 'value',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('symbol'),
                                flex: 1,
                                dataIndex: 'symbol',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: currencyData,
                        })
                    }
                }
            ]
        },
        tbarCfg: {
            //    TODO 重写删除方法
            btnDelete: {
                handler: function () {
                    var me = this.ownerCt.ownerCt.ownerCt;
                    //TODO destorySelected方法，待完善
                    //TODO 模板被删除时，需进行提示“此模板已关联xxx（id）、xxxx(id)产品，是否确定要修改/删除"
                    me.grid.destorySelected();
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true,
                    flex: 1,
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    width: 250,
                    sortable: true,
                    flex: 3,
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('tags'),
                    dataIndex: 'tags',
                    xtype: 'gridcolumn',
                    width: 450,
                    itemId: 'tags',
                    sortable: true,
                    flex: 3,
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('currencyCode'),
                    dataIndex: 'currencyCode',
                    xtype: 'gridcolumn',
                    itemId: 'currencyCode',
                    sortable: true,
                    flex: 2,
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                }]
        }
    });
});


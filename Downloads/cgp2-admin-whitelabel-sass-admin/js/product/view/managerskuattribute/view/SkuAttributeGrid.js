Ext.Loader.syncRequire([
    'CGP.product.view.managerskuattribute.view.SelectAttributeGrid',
    'CGP.product.model.Product',
    'CGP.product.view.managerskuattribute.view.SelectNoSkuAttributeGrid'
])

Ext.define('CGP.product.view.managerskuattribute.view.SkuAttributeGrid', {
    extend: 'Ext.grid.Panel',
    title: i18n.getKey('configurable') + i18n.getKey('attribute'),
    tbar: [],
    columns: [],
    isSpecialSku: null,
    //selType: 'checkboxmodel',
    viewConfig: {
        enableTextSelection: true,
        listeners: {
            viewready: function (dataview) {
                Ext.each(dataview.panel.headerCt.gridDataColumns, function (column) {
                    if (column.autoSizeColumn === true)
                        column.autoSize();
                })
            }
        }
    },
    productId: null,
    constructor: function (config) {
        var me = this;
        var id = config.aimUrlId;
        var isSku = config.isSku;
        var controller = config.controller;
        var profileController = Ext.create('CGP.product.view.productattributeprofile.controller.Controller');
        var tab = config.tab;
        var isProductSku = config.isProductSku;
        var buttonText = isProductSku ? i18n.getKey('add') + '非' + i18n.getKey('skuAttribute') : i18n.getKey('add') + i18n.getKey('skuAttribute');
        me.features = [
            {
                ftype: 'grouping',
                groupHeaderTpl: [
                    i18n.getKey('attributeType') + '：',
                    '<span style="color:red;">{name:this.isSku}</span>',
                    ' ',
                    {
                        isSku: function (name) {
                            if (name === true) {
                                return 'sku属性'
                            } else {
                                return '非sku属性'
                            }
                        }
                    }
                ]

            }
        ];
        var basicColumns = [
            {
                xtype: 'rownumberer',
                autoSizeColumn: false,
                itemId: 'rownumberer',
                width: 45,
                resizable: true,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                tdCls: 'vertical-middle',
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = me.store;
                            var editOrNew = 'modify';
                            controller.modifySkuAttribute(record.get('displayName'), 'meta', record, rowIndex, isSku, id, me);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Remove',
                        isDisabled: false,
                        handler: function (view, colIndex, rowIndex, item, e, record, row) {
                            Ext.Msg.confirm('提示', '确定删除么', function (btn, text) {
                                if (btn == 'yes') {
                                    // 处理文本值并且关闭...
                                    controller.removeSkuAttribute(record.get('attribute').id, id, record.get('inputType'), record.get('id'), me);
                                }
                            });
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('operation'),
                sortable: false,
                width: 105,
                hidden: config.isSpecialSku,
                autoSizeColumn: false,
                xtype: 'componentcolumn',
                tdCls: 'vertical-middle',
                renderer: function (value, metaData, record, rowIndex, colIndex, data, gridView) {
                    var grid = gridView.ownerCt;
                    return {
                        xtype: 'toolbar',
                        hidden: !isSku,
                        layout: 'column',
                        style: 'padding:0',
                        items: [
                            {
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text: i18n.getKey('manager') + i18n.getKey('attributeConstraint'),
                                            handler: function () {
                                                var skuAttributeId = record.getId();
                                                var store = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeConstraint', {
                                                    skuAttributeId: skuAttributeId
                                                });
                                                //输入类型
                                                var inputType = record.get('attribute').inputType;
                                                controller.managerSkuAttriConstraint(tab, skuAttributeId, id, store, inputType);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('manager') + i18n.getKey('attributeConstraint') + 'V2',
                                            handler: function () {
                                                var skuAttributeId = record.getId();
                                                var inputType = record.get('attribute').inputType;
                                                controller.managerSkuAttriConstraintV2(tab, skuAttributeId, id, grid.store, inputType, record);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('manager') + i18n.getKey('SkuAttributeProperty'),
                                            handler: function () {
                                                var skuAttributeId = record.getId();
                                                var inputType = record.get('attribute').inputType;
                                                var productId = me.productId;
                                                var isLock = JSCheckProductIsLock(productId);
                                                var manageSkuAttributePropertyWindow = Ext.create('CGP.product.view.managerskuattribute.view.ManageSkuAttributePropertyWindow', {
                                                    skuAttributeId: skuAttributeId,
                                                    inputType: inputType,
                                                    isLock: isLock,
                                                    skuAttribute: record.getData()
                                                });
                                                manageSkuAttributePropertyWindow.show();
                                            }
                                        }

                                    ]
                                }
                            }
                        ]
                    };
                }
            },
            {
                dataIndex: 'id',
                tdCls: 'vertical-middle',
                width: 80,
                text: i18n.getKey('id')
            },
            {
                dataIndex: 'attribute',
                width: 80,
                tdCls: 'vertical-middle',
                xtype: "componentcolumn",
                text: i18n.getKey('attributeId'),
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('attribute') + '"';
                    if (value) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + value.id + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        JSOpen({
                                            id: 'attributepage',
                                            url: path + 'partials/attribute/attribute.html?attributeId=' + value.id,
                                            title: i18n.getKey('attribute'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        };
                    } else {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + '' + '</a>'
                        };
                    }


                }
            },
            {
                text: i18n.getKey('displayName'),
                dataIndex: 'displayName',
                itemId: 'displayName',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('defaultValue'),
                dataIndex: 'defaultValue',
                itemId: 'defaultValue',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    var returnStr = '';
                    var selectType = record.get('attribute').selectType;
                    if (selectType == 'MULTI' || selectType == 'SINGLE') {
                        var options = null;
                        var optionIds = value.split(',');
                        options = record.get('attribute').options;
                        var displayName = [];
                        Ext.Array.each(options, function (data) {
                            for (var i = 0; i < optionIds.length; i++) {
                                if (data.id + '' == optionIds[i]) {
                                    displayName.push(data.name);
                                }
                            }
                        })
                        if (record.get('attribute').inputType == 'Color') {//现在inputType没得配置
                            var color = [];
                            Ext.Array.each(displayName, function (c) {
                                color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[0] + '"></a>');
                            })
                            displayName = color;
                        }
                        returnStr = displayName.join(',');

                    } else {
                        returnStr = value;
                    }
                    //是颜色option 展示颜色块
                    return returnStr;
                }
            },
            {
                text: i18n.getKey('readOnly'),
                dataIndex: 'readOnly',
                itemId: 'readOnly',
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('required'),
                tdCls: 'vertical-middle',
                dataIndex: 'required'
            },
            {
                text: i18n.getKey('enable'),
                tdCls: 'vertical-middle',
                dataIndex: 'enable'
            },
            {
                text: i18n.getKey('hidden'),
                tdCls: 'vertical-middle',
                dataIndex: 'hidden'
            },
            {
                dataIndex: 'name',
                tdCls: 'vertical-middle',
                text: i18n.getKey('name'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').name;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'code',
                tdCls: 'vertical-middle',
                text: i18n.getKey('code'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').code;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'valueType',
                tdCls: 'vertical-middle',
                text: i18n.getKey('valueType'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        return record.get('attribute').valueType;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'selectType',
                tdCls: 'vertical-middle',
                text: i18n.getKey('selectType'),
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        var selectType = record.get('attribute').selectType;
                        var str = '';
                        if (selectType == 'NON') {
                            str = '输入型';
                        } else if (selectType == 'MULTI') {
                            str = '多选型';
                        } else {
                            str = '单选型';
                        }
                        return str;
                    } else {
                        return value;
                    }
                }
            },
            {
                dataIndex: 'detail',
                tdCls: 'vertical-middle',
                text: i18n.getKey('detail'),
                renderer: function (value, metadata, record) {
                    return value;
                }
            },
            {
                dataIndex: 'placeholder',
                tdCls: 'vertical-middle',
                text: i18n.getKey('placeholder'),
                renderer: function (value, metadata, record) {
                    return value;
                }
            },
            /*{
                dataIndex: 'sortOrder',
                tdCls: 'vertical-middle',
                text: i18n.getKey('sortOrder')
            },*/
            {
                text: i18n.getKey('options'),
                dataIndex: 'options',
                tdCls: 'vertical-middle',
                itemId: 'options',
                width: 300,
                renderer: function (value, metadata, record) {
                    if (isSku) {
                        value = record.get('attribute').options;
                    }
                    var v = [];
                    for (var i = 0; i < value.length; i++) {
                        var data = value[i];
                        if ((i + 1) % 3 == 0) {
                            v.push(data.name + '<br>');
                        } else {
                            v.push(data.name);
                        }
                    }
                    if (record.get('attribute').inputType == 'Color') {//颜色类型
                        var color = [];
                        for (var i = 0; i < v.length; i++) {
                            var c = v[i];
                            color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[0] + '"></a>');
                        }
                        v = color;
                    }
                    console.log(v);
                    v = v.join(',');
                    return v;
                }
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                width: 250,
                itemId: 'description',
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }
        ];
        var basicTbar = [
            {
                xtype: 'button',
                text: buttonText,
                iconCls: 'icon_create',
                handler: function () {
                    controller.addSkuAttribute(me);
                },
                id: 'addbutton'
            },
            {
                xtype: 'button',
                text: i18n.getKey('add') + '非' + i18n.getKey('skuAttribute'),
                iconCls: 'icon_create',
                hidden: isProductSku,
                handler: function () {
                    controller.addNoSkuAttribute(me);
                },
                id: 'addnoskuattribute'
            }, {
                iconCls: 'icon_create',
                text: i18n.getKey('create') + i18n.getKey('default') + i18n.getKey('profile'),
                handler: function () {
                    profileController.createDefaultProfile(me.productId, me.tab);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_reset',
                handler: function (button) {
                    var store = button.ownerCt.ownerCt.getStore();
                    store.load();
                },
                id: 'refreshbutton'
            }
        ]
        me.columns = Ext.Array.merge(me.columns, basicColumns);
        me.tbar = Ext.Array.merge(me.tbar, basicTbar);
        me.store = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
            aimUrlId: config.aimUrlId
        });
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = me.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }

})

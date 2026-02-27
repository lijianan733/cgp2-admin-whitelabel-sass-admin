/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.OptionalConfigContainer',
    'partner.productSupplier.view.EditAttributeMapping',
])
Ext.define('partner.productSupplier.view.AttributeMapping', {
    extend: 'Ext.container.Container',
    alias: 'widget.attribute_mapping',
    productId: null,
    attributeVersionId: '',
    diyGetValue: function () {
        var result = {};
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
        })
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
        })
    },
    initComponent: function () {
        var me = this;
        var attributeVersionId = me.attributeVersionId;
        var store = Ext.create('Ext.data.Store', {
            fields: ['name', 'strategyType', 'attributeKey', 'whitelabel', 'defaultValue', {
                name: 'convertValue',
                type: 'object'
            }, {
                name: 'iskey',
                type: 'string',
                convert: function (value, record) {
                    var defaultValue = record.get('defaultValue');
                    var attributeKey = record.get('attributeKey');
                    return defaultValue || attributeKey;
                }
            }],
            data: []
        });
        me.items = [
            {
                xtype: 'optionalconfigcontainerv3',
                name: 'manufactureProduct',
                itemId: 'manufactureProduct',
                width: '100%',
                allowBlank: false,
                title: me.title,
                status: 'FINISHED',
                titleFn: Ext.emptyFn,
                toolbarItems: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        text: i18n.getKey('添加属性映射'),
                        handler: function (btn) {
                            var parent = me.ownerCt;
                            var container = parent.getComponent('container');
                            var productScope = container.getComponent('productScope');
                            var manufactureProduct = me.getComponent('manufactureProduct');
                            var containerItem = manufactureProduct.getComponent('container');
                            var attributeMappings = containerItem.getComponent('attributeMappings');
                            var productId = productScope.getValue();
                            var win = Ext.create('partner.productSupplier.view.EditAttributeMapping', {
                                title: i18n.getKey('add') + '_' + i18n.getKey('属性映射'),
                                isEdit: false,
                                parentStore: store,
                                productId: productId,
                                attributeVersionId:attributeVersionId,
                                parentGrid: attributeMappings,
                            }).show();
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_check',
                        text: i18n.getKey('查看whitelabel属性列表'),
                        handler: function (btn) {
                            var parent = me.ownerCt;
                            var container = parent.getComponent('container');
                            var productScope = container.getComponent('productScope');
                            var productId = productScope.getValue();
                            var win = Ext.create('Ext.window.Window', {
                                title: i18n.getKey('check') + '_' + i18n.getKey('whitelabel属性'),
                                modal: true,
                                width: 800,
                                height: 500,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'grid',
                                        itemId: 'grid',
                                        viewConfig: {
                                            enableTextSelection: true
                                        },
                                        columns: [
                                            {
                                                xtype: 'rownumberer',
                                                tdCls: 'vertical-middle'
                                            },
                                            {
                                                text: i18n.getKey('displayName'),
                                                dataIndex: 'displayName',
                                                width: 120
                                            },
                                            {
                                                text: i18n.getKey('isSku'),
                                                dataIndex: 'isSku',
                                                hidden: true,
                                            },
                                            {
                                                text: i18n.getKey('valueType'),
                                                dataIndex: 'attribute',
                                                renderer: function (v) {
                                                    return v && v.valueType;
                                                }
                                            },
                                            {
                                                text: i18n.getKey('inputType'),
                                                dataIndex: 'attribute',
                                                renderer: function (v) {
                                                    var inputTypeGroup = {
                                                        CheckBox: '多选型',
                                                        DropList: '单选型',
                                                        TextField: '输入型',
                                                    }
                                                    return v && inputTypeGroup[v.inputType];
                                                }
                                            },
                                            {
                                                text: i18n.getKey('code'),
                                                dataIndex: 'code',
                                                flex: 1
                                            },
                                            {
                                                text: i18n.getKey('selectType'),
                                                dataIndex: 'selectType',
                                                flex: 1,
                                            },
                                        ],
                                        store: Ext.create('Ext.data.Store', {
                                            fields: [
                                                {
                                                    name: 'id',
                                                    type: 'int',
                                                    useNull: true
                                                }, 'code', 'name', 'inputType',
                                                {
                                                    name: 'options',
                                                    type: 'array',
                                                    convert: function (value, record) {
                                                        if (Ext.isEmpty(record.get('attribute').options)) {
                                                            return [];
                                                        } else {
                                                            return record.get('attribute').options;
                                                        }
                                                    }
                                                },
                                                {
                                                    name: 'displayName',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'description',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'attribute',
                                                    type: 'object'
                                                },
                                                {
                                                    name: 'attributeId',
                                                    type: 'int',
                                                    convert: function (value, record) {
                                                        var attributeId = record.get('attribute').id;
                                                        return attributeId;
                                                    }
                                                },
                                                {//显示的是sku属性的信息
                                                    name: 'attributeName',
                                                    type: 'string',
                                                    convert: function (value, record) {
                                                        var result = record.get('displayName') + '<' + record.get('id') + '>';
                                                        return result;
                                                    }
                                                },
                                                {//显示的是属性的信息
                                                    name: 'attributeNameV2',
                                                    type: 'string',
                                                    convert: function (value, record) {
                                                        var attributeId = record.get('attribute').id;
                                                        var name = record.get('attribute').name;
                                                        var result = name + '<' + attributeId + '>';
                                                        return result;
                                                    }
                                                },
                                                {
                                                    name: 'isSku',
                                                    type: 'boolean'
                                                },
                                                {
                                                    name: 'detail',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'placeholder',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'selectType',
                                                    type: 'string',
                                                    convert: function (value, record) {
                                                        return record.get('attribute').selectType;
                                                    }
                                                },
                                                {
                                                    //标识是否为必填
                                                    name: 'required',
                                                    type: 'boolean'
                                                }
                                            ],
                                            autoLoad: true,
                                            proxy: {
                                                type: 'memory',
                                                data: []
                                            },
                                        })
                                    }
                                ],
                                listeners: {
                                    afterrender: function (comp) {
                                        var grid = comp.getComponent('grid');
                                        var controller = Ext.create('partner.productSupplier.controller.Controller');
                                        grid.store.getProxy().data = controller.getIsSkuData(productId, attributeVersionId);
                                        grid.store.load();
                                    }
                                }
                            }).show();
                        }
                    },
                ],
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '0 0 10 10',
                        allowBlank: true,
                    },
                },
                diyGetValue: function () {
                    var me = this;
                    var result = {};
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                    })
                },
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => isValid = item.isValid && item.isValid());
                    return isValid;
                },
                containerItems: [
                    {
                        xtype: 'textfield',
                        name: 'productId',
                        hidden: true,
                        diyGetValue: function () {
                            var form = me.ownerCt;
                            var container = form.getComponent('container');
                            var manufactureProduct = container.getComponent('manufactureProductId');
                            return manufactureProduct.getValue();
                        },
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.ConfigManufactureProduct',
                    },
                    {
                        xtype: 'grid',
                        name: 'attributeMappings',
                        itemId: 'attributeMappings',
                        store: store,
                        width: 700,
                        maxHeight: 200,
                        allowScroll: true,
                        isValid: function () {
                            var me = this;
                            var isValid = true;
                            var store = me.store;
                            var data = me.store.getProxy().data;
                            if (!data.length > 0) {
                                isValid = false;
                                me.setBodyStyle('borderColor', '#cf4c35');
                            }
                            return isValid;
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.store.getProxy().data;
                            return data;
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.store.getProxy().data = data;
                            me.store.load();
                        },
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                width: 50,
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                        tooltip: 'Edit',
                                        handler: function (grid, rowIndex, colIndex, a, b, record) {
                                            var storeData = store.getProxy().data;
                                            var parent = me.ownerCt;
                                            var container = parent.getComponent('container');
                                            var productScope = container.getComponent('productScope');
                                            var productId = productScope.getValue();
                                            var win = Ext.create('partner.productSupplier.view.EditAttributeMapping', {
                                                title: i18n.getKey('edit') + '_' + i18n.getKey('属性映射'),
                                                isEdit: true,
                                                parentStore: store,
                                                rowIndex: rowIndex,
                                                productId: productId,
                                                attributeVersionId:attributeVersionId,
                                            }).show();
                                            win.diySetValue(storeData[rowIndex]);
                                        }
                                    },
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        tooltip: 'Delete',
                                        handler: function (view, rowIndex, colIndex, a, b, record) {
                                            Ext.Msg.confirm('提示', '确定删除？', callback);

                                            function callback(id) {
                                                if (id === 'yes') {
                                                    store.proxy.data.splice(rowIndex, 1);
                                                    store.load();
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                flex: 1,
                                dataIndex: 'attributeKey',
                                text: i18n.getKey('供应商属性名称'),
                            },
                            {
                                flex: 1,
                                dataIndex: 'strategyType',
                                text: i18n.getKey('赋值策略'),
                                renderer: function (value) {
                                    var group = {
                                        DIRECTLY: '直接赋值',
                                        INDIRECT: '属性值映射'
                                    }
                                    return group[value];
                                }
                            },
                            {
                                xtype: 'atagcolumn',
                                flex: 1,
                                align: 'center',
                                dataIndex: 'iskey',
                                text: i18n.getKey('赋值'),
                                getDisplayName: function (value, metadata, record) {
                                    var strategyType = record.get('strategyType');
                                    var displayValue = '<font color=blue style="text-decoration:underline">' + "<a>编辑</a>" + '</font>';
                                    return strategyType === 'DIRECTLY' ? value : displayValue;
                                },
                                clickHandler: function (value, metadata, record) {
                                    var rowIndex = record.index;
                                    var storeData = store.getProxy().data;
                                    var parent = me.ownerCt;
                                    var container = parent.getComponent('container');
                                    var productScope = container.getComponent('productScope');
                                    var productId = productScope.getValue();
                                    var win = Ext.create('partner.productSupplier.view.EditAttributeMapping', {
                                        title: i18n.getKey('edit') + '_' + i18n.getKey('属性映射'),
                                        isEdit: true,
                                        parentStore: store,
                                        rowIndex: rowIndex,
                                        productId: productId,
                                        attributeVersionId:attributeVersionId
                                    }).show();
                                    win.diySetValue(storeData[rowIndex]);
                                }
                            },
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
})
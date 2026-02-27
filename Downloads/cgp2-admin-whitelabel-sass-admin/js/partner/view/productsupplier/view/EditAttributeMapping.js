/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.view.EditAttributeMapping', {
    extend: 'Ext.window.Window',
    alias: 'widget.edit_attribute_mapping',
    width: 600,
    layout: 'fit',
    modal: true,
    isEdit: false,
    rowIndex: null,
    parentStore: null,
    parentGrid: null,
    productId: '',
    attributeVersionId: '',
    title: i18n.getKey('edit') + '_' + i18n.getKey('属性映射'),
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
            item.diySetValue ? item.diySetValue(data) : item.setValue(data)
        })
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('partner.productSupplier.controller.Controller');
        var productData = controller.getIsSkuData(me.productId, me.attributeVersionId);
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                name: 'form',
                layout: 'vbox',
                diyGetValue: function () {
                    var result = {};
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        !item.hidden && (result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var items = me.items.items;

                    items.forEach(item => {
                        var name = item.name;
                        switch (name) {
                            case 'whitelabel':
                                item.diySetValue(data);
                                break;
                            case 'convertValue':
                                item.diySetValue(data['convertValue']['optionValueMappings']);
                                break;
                            default:
                                item.setValue(data[name]);
                                break;
                        }
                    })
                },
                defaults: {
                    xtype: 'textfield',
                    margin: '0 0 10 10',
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('供应商属性'), //供应商属性
                        name: 'attributeKey',
                        allowBlank: false,
                        margin: '10 0 10 10',
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('赋值策略'), //赋值策略
                        name: 'strategyType',
                        displayField: 'value',
                        valueField: 'name',
                        editable: false,
                        allowBlank: false,
                        value: 'INDIRECT',
                        store: {
                            xtype: 'store',
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'DIRECTLY',
                                    value: '直接赋值'
                                },
                                {
                                    name: 'INDIRECT',
                                    value: '属性值映射'
                                },
                            ]
                        },
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var form = field.ownerCt;
                                var defaultValue = form.getComponent('defaultValue');
                                var itemIdGroup = ['whitelabel', 'attributeOptions'];
                                itemIdGroup.forEach(item => {
                                    var comp = form.getComponent(item);
                                    comp.setVisible(newValue === 'INDIRECT');
                                    comp.setDisabled(newValue !== 'INDIRECT');
                                    // defaultValue.setVisible(newValue !== 'INDIRECT');
                                })
                                defaultValue.setVisible(newValue !== 'INDIRECT');
                                defaultValue.setDisabled(newValue === 'INDIRECT');
                            }
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('赋值'), //赋值
                        name: 'defaultValue',
                        itemId: 'defaultValue',
                        hidden: true,
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: i18n.getKey('whitelabel属性'), //whitelabel属性
                        editable: false,
                        displayField: 'displayName',
                        valueField: 'id',
                        width: 310,
                        allowBlank: false,
                        tipInfo: '若产品未配置whitelabel属性,请选择直接赋值策略',
                        name: 'whitelabel',
                        itemId: 'whitelabel',
                        store: {
                            xtype: 'store',
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
                                    name: 'selectType',
                                    type: 'string'
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
                                    //标识是否为必填
                                    name: 'required',
                                    type: 'boolean'
                                }
                            ],
                            data: productData //过滤过的sku属性数据
                        },
                        diySetValue: function (data) {
                            var me = this;
                            var convertValue = data['convertValue'];
                            var attributeId = convertValue['attributeId'];
                            var storeData = me.store.getProxy().data;
                            storeData.forEach(item => {
                                item.attributeId === attributeId && me.setValue(item.id);
                            })
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var form = comp.ownerCt;
                                var whitelabelSelectData = [];
                                var data = comp.store.getProxy().data;
                                var attributeOptions = form.getComponent('attributeOptions');
                                var container = attributeOptions.getComponent('container');
                                var grid = container.getComponent('grid');
                                data.forEach(item => {
                                    var id = item['id'];
                                    id === newValue && (whitelabelSelectData = item.attribute.options);
                                });
                                grid.store.getProxy().data = whitelabelSelectData;
                                grid.store.load();
                            }
                        }
                    },
                    {
                        xtype: 'optionalconfigcontainerv3',
                        allowBlank: false,
                        title: i18n.getKey('属性选项值映射:'),
                        width: '100%',
                        status: 'FINISHED',
                        margin: '0 0 0 0',
                        titleFn: Ext.emptyFn,
                        diyGetValue: function () {
                            var me = this;
                            var selectType = null,
                                attributeId = null;
                            var skuAttributeCode = '';
                            var optionValueMappings = [];
                            var form = me.ownerCt;
                            var whitelabel = form.getComponent('whitelabel');
                            var container = me.getComponent('container');
                            var grid = container.getComponent('grid');
                            var storeData = grid.store.getProxy().data;
                            var textfield = grid.query('[itemId*=textfield]');
                            textfield.forEach((item, index) => storeData[index]['valueField'] = item.getValue())
                            grid.store.load();
                            productData.forEach((item, index) => {
                                if (item['id'] === whitelabel.getValue()) {
                                    selectType = item['attribute']['selectType'];
                                    attributeId = item['attributeId'];
                                    skuAttributeCode = item.code;
                                }
                            })
                            storeData.forEach((item, index) => {
                                item['valueField'] && (optionValueMappings[index] = {
                                    optionId: item['id'],
                                    value: item['valueField'],
                                    optionValue: item.value

                                });
                            });
                            optionValueMappings = optionValueMappings.filter(function (item) {
                                return !Ext.isEmpty(item);
                            });
                            return {
                                attributeId: attributeId,
                                skuAttributeCode: skuAttributeCode,
                                optionValueMappings: optionValueMappings,
                                type: selectType,
                                clazz: 'com.qpp.cgp.domain.partner.cooperation.manufacture.OptionValueConvert'
                            };
                        },
                        diySetValue: function (data) {
                            var me = this;
                            var container = me.getComponent('container');
                            var grid = container.getComponent('grid');
                            var storeData = grid.store.getProxy().data;
                            data.length > 0 && storeData.forEach((storeItem, index) => {
                                data.forEach(dataItem => {
                                    if (storeItem.id === dataItem.optionId) {
                                        storeItem['valueField'] = dataItem['value'];
                                        storeItem['id'] = dataItem['optionId'];
                                    }
                                })
                            })
                            grid.store.load();
                        },
                        containerConfig: {
                            defaults: {
                                margin: '0 0 10 20',
                                allowBlank: true,
                            },
                        },
                        itemId: 'attributeOptions',
                        name: 'convertValue',
                        containerItems: [
                            {
                                xtype: 'grid',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['id', 'displayValue', 'valueField'],
                                    data: []
                                }),
                                width: 400,
                                maxHeight: 300,
                                itemId: 'grid',
                                columns: [
                                    {
                                        text: i18n.getKey('whitelabel选项值'),
                                        flex: 1,
                                        dataIndex: 'id',
                                        renderer: function (value, metadata, record) {
                                            var result = '';
                                            if (value) {
                                                var displayValue = record.get('displayValue');
                                                result = displayValue + '<' + value + '>';
                                            }
                                            return result;
                                        }
                                    },
                                    {
                                        xtype: 'componentcolumn',
                                        flex: 1,
                                        dataIndex: 'valueField',
                                        text: i18n.getKey('供应商属性值'),
                                        renderer: function (value, metadata, record) {
                                            return {
                                                xtype: 'textfield',
                                                itemId: 'textfield',
                                                name: 'value',
                                                value: value,
                                                width: '100%',
                                            }
                                        }
                                    },
                                ]
                            }
                        ]
                    }
                ],
                bbar: ['->',
                    {
                        xtype: 'button',
                        iconCls: "icon_save",
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            var formValue = form.diyGetValue();
                            var storeData = me.parentStore.getProxy().data || [];
                            if (form.isValid()) {
                                me.isEdit ? storeData.splice(me.rowIndex, 1, formValue) : storeData.push(formValue);
                                !me.isEdit && me.parentGrid.setBodyStyle('borderColor', 'silver');
                                me.parentStore.load();
                                win.close();
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt.ownerCt;
                            win.close();
                        }
                    },
                ]
            }
        ];
        me.callParent();
    }
})
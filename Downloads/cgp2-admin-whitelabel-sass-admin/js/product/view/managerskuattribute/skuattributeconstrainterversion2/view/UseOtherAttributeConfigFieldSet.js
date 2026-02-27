/**
 * Created by nan on 2019/10/22.
 * 通用的前置条件组件，有产品的profile,和产品的属性值判断
 * 可选的属性过滤掉非连续值的属性,过滤掉自己这个属性，现在有不需要过滤，可以选择所有属性
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.UseOtherAttributeConfigFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.configfieldsetwithotherattribute',
    createOrEdit: 'create',//新建时就有同时创建作用于其他属性的约束的功能
    productAttributeStore: null,
    productId: null,
    skuAttributeId: null,//配置约束的skuAttribute
    initComponent: function () {
        var me = this;
        var productAttributeStore = me.productAttributeStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                {
                    name: 'id',
                    type: 'string'
                },
                'displayName',
                'inputType',
                {
                    name: 'showName',
                    convert: function (value, record) {
                       
                        return record.data.displayName + '的值'
                    }
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/products/configurable/' + me.productId + '/skuAttributes',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners: {
                load: function (store, record) {//过滤掉非连续值的属性,过滤掉自己这个属性
                    store.filterBy(function (item) {
                    /*    if (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], item.raw.attribute.inputType)) {//过滤掉离散型属性
                            return false;
                        }*/
                        if (item.raw.id == me.skuAttributeId) {//过滤掉自己这个属性
                            return false;
                        }
                        return true;
                    })
                }
            }
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        fieldLabel: i18n.getKey('description'),
                        xtype: 'textfield',
                        allowBlank: false,
                        width: 400,
                        name: 'description'
                    },
                    {
                        xtype: 'fieldcontainer',
                        itemId: 'valueField',
                        layout: {
                            type: 'hbox',
                            align: 'middle'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                displayField: 'display',
                                valueField: 'value',
                                editable: false,
                                fieldLabel: i18n.getKey('该属性的值范围'),
                                matchFieldWidth: false,
                                value: '==',
                                width: 200,
                                name: 'operator',
                                labelWidth: 100,
                                margin: '0 10 0 0',
                                listConfig: {
                                    itemTpl: Ext.create('Ext.XTemplate',
                                        '<div title="{title}" ext:qtitle="title" ext:qtip="{display} : {display} tip" >{display}</div>'),
                                },
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'display',
                                        'value',
                                        'title'
                                    ],
                                    data: [
                                        {
                                            display: '=',
                                            value: '=='
                                        },
                                        {
                                            display: '<',
                                            value: '<'
                                        },
                                        {
                                            display: '>',
                                            value: '>'
                                        },
                                        {
                                            display: '<=',
                                            value: '<='
                                        },
                                        {
                                            display: '>=',
                                            value: '>='
                                        },
                                        {
                                            display: '!=',
                                            value: '!='
                                        }/*,
                                        {
                                            display: '[min,max]',
                                            value: '[min,max]',
                                            title: 'min<=属性值<=max'
                                        }, {
                                            display: '[min,max)',
                                            value: '[min,max)',
                                            title: 'min<=属性值<max'
                                        }, {
                                            display: '(min,max)',
                                            value: '(min,max)',
                                            title: 'min<属性值<max'
                                        }, {
                                            display: '(min,max]',
                                            value: '(min,max]',
                                            title: 'min<属性值<=max'
                                        }*/
                                    ]
                                }),
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var minSkuAttributeId = field.ownerCt.getComponent('minSkuAttributeId');
                                        var complexInput = field.ownerCt.getComponent('complexInput');
                                        var isCreateMaxAttribute = field.ownerCt.ownerCt.getComponent('isCreateMaxAttribute');
                                        if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                                            minSkuAttributeId.hide();
                                            minSkuAttributeId.setDisabled(true);
                                            complexInput.show();
                                            complexInput.setDisabled(false);
                                            isCreateMaxAttribute.show();
                                            isCreateMaxAttribute.setDisabled(false);
                                        } else {
                                            complexInput.hide();
                                            complexInput.setDisabled(true);
                                            minSkuAttributeId.show();
                                            minSkuAttributeId.setDisabled(false);
                                            isCreateMaxAttribute.hide();
                                            isCreateMaxAttribute.setDisabled(true);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'combo',
                                itemId: 'minSkuAttributeId',
                                editable: false,
                                allowBlank: false,
                                name: 'minSkuAttributeId',
                                store: productAttributeStore,
                                displayField: 'showName',
                                valueField: 'id',
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var isCreateMinAttribute = field.ownerCt.ownerCt.getComponent('isCreateMinAttribute');
                                        isCreateMinAttribute.setBoxLabel('此约束是否同时作用于属性：' + field.getDisplayValue().split('的')[0]);
                                       
                                    }
                                }
                            },
                            {
                                xtype: 'fieldcontainer',
                                hidden: true,
                                disabled: true,
                                itemId: 'complexInput',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'combo',
                                        editable: false,
                                        labelWidth: 50,
                                        width: 250,
                                        labelAlign: 'right',
                                        allowBlank: false,
                                        name: 'minSkuAttributeId',
                                        itemId: 'minSkuAttributeId',
                                        fieldLabel: i18n.getKey('min'),
                                        store: productAttributeStore,
                                        displayField: 'showName',
                                        valueField: 'id',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var isCreateMinAttribute = field.ownerCt.ownerCt.ownerCt.getComponent('isCreateMinAttribute');
                                                isCreateMinAttribute.setBoxLabel('此约束是否同时作用于属性：' + field.getDisplayValue().split('的')[0]);
                                               
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'combo',
                                        editable: false,
                                        labelWidth: 50,
                                        width: 250,
                                        labelAlign: 'right',
                                        allowBlank: false,
                                        name: 'maxSkuAttributeId',
                                        itemId: 'maxSkuAttributeId',
                                        fieldLabel: i18n.getKey('max'),
                                        store: productAttributeStore,
                                        displayField: 'showName',
                                        valueField: 'id',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var isCreateMinAttribute = field.ownerCt.ownerCt.ownerCt.getComponent('isCreateMaxAttribute');
                                                isCreateMinAttribute.setBoxLabel('此约束是否同时作用于属性：' + field.getDisplayValue().split('的')[0]);
                                            }
                                        }
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        fieldLabel: i18n.getKey('错误提示信息模板'),
                        xtype: 'textfield',
                        width: 400,
                        name: 'promptTemplate',
                        allowBlank: false
                    },
                    {
                        boxLabel: '此约束是否同时作用于A属性',
                        name: 'isCreateA',
                        inputValue: true,
                        xtype: 'checkbox',
                        hidden: me.createOrEdit == 'edit',
                        disabled: me.createOrEdit == 'edit',
                        checked: false,
                        itemId: 'isCreateMinAttribute'
                    },
                    {
                        boxLabel: '此约束是否同时作用于B属性',
                        name: 'isCreateB',
                        inputValue: true,
                        hidden: true,
                        disabled: true,
                        xtype: 'checkbox',
                        checked: false,
                        itemId: 'isCreateMaxAttribute'
                    }
                ]
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = me.items.items[0].getValues();
        console.log(result);
        result.clazz = 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint';
        result.executeCondition = null;
        result.skuAttributeId = me.skuAttributeId;
        result.skuAttribute = me.skuAttribute;
        result.minSkuAttributeId = result.minSkuAttributeId;
        result.minSkuAttribute = me.productAttributeStore.findRecord('id', result.minSkuAttributeId).raw;
        if (result.maxSkuAttributeId) {
            result.maxSkuAttributeId = result.maxSkuAttributeId;
            result.maxSkuAttribute = me.productAttributeStore.findRecord('id', result.maxSkuAttributeId).raw;
        }
        return result;
    },
    setValue: function (data) {
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            var me = this;
            var fields = me.items.items[0].form.getFields().items;
            for (var i = 0; i < fields.length; i++) {
                var value = data[fields[i].getName()];
                if (!Ext.isEmpty(value)) {
                    fields[i].setValue(value.toString());
                }
            }
        }
    }
})

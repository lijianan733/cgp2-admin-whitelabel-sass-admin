/**
 * Created by admin on 2019/12/21.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyPath', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    height: 110,
    colspan: 2,
    productId: null,
    title: i18n.getKey('attributePropertyPath'),
    defaults: {
        /*
         labelAlign: 'top',
         */
        allowBlank: false,
        width: 250,
        margin: '10 10 0 10'
    },
    layout: {
        type: 'table',
        columns: 3
    },
    style: {
        borderRadius: '10px'
    },
    inputTypeProperty: [//选项类型的可用操作符
        {
            value: 'Value',
            display: 'Value'
        },
        {
            value: 'Enable',
            display: 'Enable'
        },
        {
            value: 'Hidden',
            display: 'Hidden'
        },
        {
            value: 'Required',
            display: 'Required'
        },
        {
            value: 'ReadOnly',
            display: 'ReadOnly'
        },
        {
            value: 'OriginalValue',
            display: 'OriginalValue'
        },
        {
            value: 'OriginalEnable',
            display: 'OriginalEnable'
        },
        {
            value: 'OriginalHidden',
            display: 'OriginalHidden'
        },
        {
            value: 'OriginalRequire',
            display: 'OriginalHidden'
        }
    ],
    optionTypeProperty: [//离散输入型的可用操作符
        {
            value: 'EnableOption',
            display: 'EnableOption'
        },
        {
            value: 'HiddenOption',
            display: 'HiddenOption'
        },
        {
            value: 'OriginalEnableOption',
            display: 'OriginalEnableOption'
        },
        {
            value: 'OriginalHiddenOption',
            display: 'OriginalHiddenOption'
        }
    ],
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var items = me.items.items;
        ;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.getName() == 'skuAttributeId') {
                var currentRecord = item.getStore().getById(item.getValue());
                result[item.getName()] = item.getValue();
                result['skuAttribute'] = currentRecord.getData();
            } else if (item.getName() == 'entryLink') {
                if (Ext.isEmpty(item.getValue()) || Ext.Object.isEmpty(item.getValue())) {
                    //不填值
                } else {
                    result[item.getName()] = {
                        _id: Object.keys(item.getValue())[0],
                        clazz: 'com.qpp.cgp.domain.attributecalculate.MappingLink'
                    };
                }
            } else if (item.getName() == 'attributeProfile') {
                result[item.getName()] = {
                    _id: item.getValue(),
                    clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile'
                };
            } else {
                result[item.getName()] = item.getValue();
            }
        }
        result.clazz = 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto'
        return result
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.getName() == 'entryLink') {
                if (data[item.getName()])
                    item.setInitialValue([data[item.getName()]._id]);
            } else if (item.getName() == 'attributeProfile') {
                item.setValue(data[item.getName()]._id);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
    },
    initComponent: function () {
        var me = this;
        var mappingLinksStore = Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
            pageSize: 10,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }])
            }
        });
        me.items = [
            {
                xtype: 'combo',
                store: Ext.data.StoreManager.get('profileStore'),
                valueField: '_id',
                itemId: 'attributeProfile',
                editable: false,
                name: 'attributeProfile',
                queryMode: 'local',
                displayField: 'displayName',
                haveReset: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('attributeProfile'),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var skuAttributeCombo = combo.ownerCt.getComponent('skuAttributeId');
                        if (newValue) {
                            var skuAttributes = [];
                            var profileData = this.store.findRecord('_id', this.getValue()).getData();
                            for (var i = 0; i < profileData.groups.length; i++) {
                                skuAttributes = skuAttributes.concat(profileData.groups[i].attributes);
                            }
                            skuAttributeCombo.store.proxy.data = skuAttributes;
                            skuAttributeCombo.store.load();
                            skuAttributeCombo.setValue();
                        } else {
                            var skuAttributes = [];
                            for (var i = 0; i < ProductAttributeStore.getCount(); i++) {
                                skuAttributes = skuAttributes.concat(ProductAttributeStore.data.items[i].getData());
                            }
                            skuAttributeCombo.store.proxy.data = skuAttributes;
                            skuAttributeCombo.store.load();
                        }
                    }
                }
            },
            {
                xtype: 'multicombobox',
                itemId: 'skuAttributeId',
                fieldLabel: i18n.getKey('参数属性'),
                name: 'skuAttributeId',
                store: Ext.data.StoreManager.get('productProfileAttributeStore'),
                displayField: 'comboDisplay',
                valueField: 'id',
                editable: false,
                matchFieldWidth: true,
                allowBlank: false,
                listeners: {
                    change: function (currCombo, newValue, oldValue) {
                        var propertyCombo = currCombo.ownerCt.getComponent('propertyName');
                        if (!Ext.isEmpty(newValue)) {
                            propertyCombo.setDisabled(false);
                            propertyCombo.setFieldStyle('background-color: white');
                            propertyCombo.addCls(propertyCombo.invalidCls)
                        } else {
                            propertyCombo.setDisabled(true);
                            propertyCombo.setFieldStyle('background-color: silver');
                        }
                        if (!Ext.isEmpty(newValue)) {
                            var skuAttribute = currCombo.getStore().getById(currCombo.getValue()).getData();
                            if (skuAttribute.attribute.options.length > 0) {
                                //选项类型
                                propertyCombo.store.proxy.data = me.inputTypeProperty.concat(me.optionTypeProperty);
                            } else {
                                //输入类型
                                propertyCombo.store.proxy.data = me.inputTypeProperty;
                            }
                            propertyCombo.store.load();
                        }
                        propertyCombo.setValue();
                    }
                }
            },
            {
                xtype: 'combo',
                name: 'propertyName',
                itemId: 'propertyName',
                store: Ext.create('Ext.data.Store', {
                    fields: ['display', 'value'],
                    data: me.optionTypeProperty.concat(me.inputTypeProperty)
                }),
                disabled: true,
                fieldStyle: 'background-color: silver',
                valueField: 'value',
                editable: false,
                displayField: 'display',
                allowBlank: false,
                fieldLabel: i18n.getKey('property')
            },
            {
                xtype: 'gridcombo',
                itemId: 'entryLink',
                fieldLabel: i18n.getKey('作为哪条链的入口'),
                name: 'entryLink',
                displayField: 'linkName',
                valueField: '_id',
                id: 'entryLink',
                store: mappingLinksStore,
                multiSelect: false,
                editable: false,
                haveReset: true,
                allowBlank: true,
                matchFieldWidth: false,
                tipInfo: '一次操作，只能触发一条链',
                gridCfg: {
                    store: mappingLinksStore,
                    width: 350,
                    maxHeight: 280,
                    columns: [
                        {
                            dataIndex: '_id',
                            width: 100,
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'linkName',
                            flex: 1,
                            text: i18n.getKey('linkName'),
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: mappingLinksStore,
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                listeners: {
                    expand: function (gridCombo) {
                        var mappingLinks = Ext.getCmp('mappingLinks');
                        var mappingLinksIds = Object.keys(mappingLinks.getValue());
                        gridCombo.store.proxy.extraParams = {
                            filter:
                                Ext.JSON.encode([{
                                    name: 'includeIds',
                                    type: 'string',
                                    value: '[' + mappingLinksIds.toString() + ']'
                                }])
                        };
                        gridCombo.store.load();
                    }
                }
            }
        ];
        me.callParent(arguments);
    }

});

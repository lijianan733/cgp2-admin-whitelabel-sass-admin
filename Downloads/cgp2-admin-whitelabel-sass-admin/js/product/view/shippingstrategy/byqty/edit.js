Ext.Loader.syncRequire(["CGP.product.view.shippingstrategy.byqty.model.ConfigModel",
    'CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer',
    'CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller',
    'CGP.common.valueExV3.ValueExField',
    'CGP.common.condition.ConditionFieldV3']);
Ext.define('CGP.product.view.shippingstrategy.byqty.edit', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    autoShow: true,
    bodyStyle: 'padding:10px',
    initComponent: function () {
        var me = this;
        var shippingConfigStore = Ext.create('CGP.product.view.shippingstrategy.byqty.store.ShippingConfigStore');
        var controller = Ext.create('CGP.product.view.shippingstrategy.byqty.controller.Controller');
        if (me.configId != null) {
            configModel = Ext.ModelManager.getModel("CGP.product.view.shippingstrategy.byqty.model.ConfigModel");
        }
        var contentData = controller.buildContentData(me.productId);
        me.title = i18n.getKey(me.editOrNew);
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('save'),
            itemId: 'modifyPassword',
            iconCls: 'icon_save',
            handler: function () {
                if (me.form.isValid()) {
                    var data = {};
                    me.form.items.each(function (item) {
                        if (item.name == 'areaShippingConfigGroup') {
                            data[item.name] = item.diyGetValue();
                        } else {
                            data[item.name] = item.getValue();
                        }
                    });
                    var attributePredicateDto = me.form.getComponent('attributePredicateDto');
                    if (!Ext.isEmpty(attributePredicateDto.getExpression())) {
                        data.attributePredicate = attributePredicateDto.getExpression().expression;
                    }
                    if (Ext.isEmpty(data._id)) {
                        delete data._id;
                    }
                    controller.savePageContentSchemaGroup(data, me.store, me, me.editOrNew)
                }
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            defaults: {
                width: 430,
                margin: '5 25 5 25'
            },
            items: [
                {
                    xtype: 'valueexfield',
                    name: 'attributePredicate',
                    itemId: 'attributePredicate',
                    hidden: true,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('executeCondition'),
                    commonPartFieldConfig: {
                        uxTextareaContextData: true,
                        defaultValueConfig: {
                            type: 'Boolean',
                            clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                            typeSetReadOnly: true,
                            clazzSetReadOnly: false

                        }
                    },
                    tipInfo: '执行条件'
                },
                {
                    xtype: 'conditionfieldv3',
                    fieldLabel: i18n.getKey('executeCondition'),
                    itemId: 'attributePredicateDto',
                    checkOnly: false,
                    hidden: me.productType == 'SKU',
                    tipInfo: '执行条件',
                    contentData: contentData,
                    name: 'attributePredicateDto',
                    allowBlank: true,
                },
                {
                    xtype: 'checkbox',
                    itemId: 'defaultConfig',
                    allowBlank: true,
                    hidden: true,
                    tipInfo: '当该产品所有的计费配置条件都不成立时,<br>使用该字段为True的配置来进行计费',
                    fieldLabel: i18n.getKey('setDefault'),
                    listeners: {
                        afterrender: function (comp) {
                            if (me.productType == 'SKU') {
                                comp.setValue(true);
                            }
                        }
                    },
                    name: 'defaultConfig'
                },
                {
                    name: 'areaShippingConfigGroup',
                    fieldLabel: i18n.getKey('shippingCost') + i18n.getKey('config'),
                    itemId: 'areaShippingConfigGroup',
                    xtype: 'gridcombo',
                    haveReset: true,
                    allowBlank: false,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: '_id',
                    editable: false,
                    store: shippingConfigStore,
                    matchFieldWidth: false,
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setInitialValue([data._id])
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        if (me.getSubmitValue().length > 0) {
                            return {
                                _id: me.getSubmitValue()[0],
                                clazz: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfigGroup'
                            }
                        }
                        return null;

                    },
                    filterCfg: {
                        minHeight: 80,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        defaults: {
                            width: 200,
                            labelWidth: 50,
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                itemId: '_id',
                                isLike: false,
                            }, {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name',
                            }
                        ]
                    },
                    gridCfg: {
                        height: 300,
                        width: 500,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: '_id'
                            },
                            {
                                text: i18n.getKey('name'),
                                flex: 1,
                                dataIndex: 'name'
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: shippingConfigStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                },
                {
                    xtype: 'textfield',
                    itemId: 'clazz',
                    name: 'clazz',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.product.shipping.ProductAreaShippingConfig',
                    allowBlank: false
                },
                {
                    xtype: 'numberfield',
                    itemId: 'productId',
                    name: 'productId',
                    value: me.productId,
                    hidden: true,
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    itemId: 'id',
                    name: '_id',
                    hidden: true,
                    allowBlank: true
                }]
        };
        me.items = [form];
        me.callParent(arguments);
        if (!Ext.isEmpty(me.configId)) {
            configModel.load(Number(me.configId), {
                success: function (record, operation) {
                    configModel = record;
                    me.setValue(record.data);
                }
            });
        }
        me.form = me.down('form');
    },
    setValue: function (data) {
        var me = this;
        var items = me.form.items.items;
        Ext.Array.each(items, function (item) {
            if (item.name == 'areaShippingConfigGroup') {
                item.diySetValue(data[item.name])
            } else {
                item.setValue(data[item.name]);
            }
        })

    },
})

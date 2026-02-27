Ext.Loader.syncRequire(['CGP.product.view.productattributeconstraint.view.customcomp.CustomValueFieldSet', 'CGP.product.view.productattributeconstraint.view.customcomp.AttributeValuesFieldContainer']);
Ext.define('CGP.product.view.productattributeconstraint.view.EditMultiDiscreteValueConstraintItem', {
    extend: 'Ext.window.Window',
    width: 850,
    height: 700,
    modal: true,
    maximizable: true,
    layout: 'fit',
    autoScroll: true,
    autoShow: true,

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('multiDiscreteValueConstraintItem');
        var conditionGrid = {
            viewConfig: {
                enableTextSelection: true
            },
            height: 250,
            renderTo: '#condition',
            autoScroll: true,
            width: 800,
            store: Ext.create('Ext.data.Store', {
                autoSync: true,
                fields: [
                    {name: 'clazz', type: 'string'},
                    {name: 'expression', type: 'string'},
                    {name: 'expressionEngine', type: 'string'},
                    {name: 'inputs', type: 'object'},
                    {name: 'resultType', type: 'string'},
                    {name: 'promptTemplate', type: 'string'},
                    {name: 'min', type: 'object', defaultValue: undefined},
                    {name: 'max', type: 'object', defaultValue: undefined},
                    {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                ],
                data: [
                ]
            }),
            columns: [
                {
                    xtype: 'actioncolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                me.configurableId = me.skuAttributeStore.configurableId;
                                var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                                controller.nodifyData(view, rowIndex, me.configurableId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                            }
                        }

                    ]
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    tdCls: 'vertical-middle',
                    renderer: function (value) {
                        return value.split('.').pop();
                    }

                },
                {
                    text: i18n.getKey('expression'),
                    dataIndex: 'expression',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }

                },
                {
                    text: i18n.getKey('expressionEngine'),
                    dataIndex: 'expressionEngine',
                    tdCls: 'vertical-middle'

                },
                {
                    text: i18n.getKey('resultType'),
                    dataIndex: 'resultType',
                    tdCls: 'vertical-middle'

                },
                {
                    text: i18n.getKey('promptTemplate'),
                    dataIndex: 'promptTemplate',
                    tdCls: 'vertical-middle'

                }
            ],
            tbar: [
                {
                    text: i18n.getKey('create'),
                    iconCls: 'icon_create',
                    handler: function () {
                        me.configurableId = me.skuAttributeStore.configurableId;
                        var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                        controller.nodifyData(this.ownerCt.ownerCt, null, me.configurableId);

                    }
                }
            ]

        };
        var valueItems = [];
        Ext.Array.each(me.skuAttributeIds, function (item) {
            valueItems.push({
                xtype: 'customvaluefieldset',
                title: item,
                width: 320,
                configurableId: me.configurableId,
                name: item,
                height: 150,
                collapsible: false
            });
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                bodyPadding: 10,
                //layout: 'fit',
                autoScroll: true,
                items: [
                    {
                        xtype: 'gridfield',
                        name: 'conditions',
                        itemId: 'conditions',
                        fieldLabel: i18n.getKey('condition'),
                        labelAlign: 'top',
                        width: 600,
                        height: 230,
                        configurableId: me.skuAttributeIds,
                        gridConfig: conditionGrid
                    },
                    {
                        xtype: 'attributevaluesfieldcontainer',
                        //height: 500,
                        //width: 300,
                        layout: {
                            type: 'table',
                            // The total column count must be specified here
                            columns: 2},
                        name: 'attributeValues',
                        labelAlign: 'top',
                        fieldLabel: i18n.getKey('attributeValues'),
                        items: valueItems,
                        itemId: 'attributeValues'
                    }
                ],
                listeners: {
                    afterrender: function (comp) {
                        var attributeValues = comp.getComponent('attributeValues');
                        var conditions = comp.getComponent('conditions');
                        if (me.record) {
                            var data = me.record.getData();
                            conditions.setSubmitValue(data.conditions);
                            attributeValues.setArrayValue(data.attributeValues);
                        }
                    }
                }
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_add',
            handler: function () {
                var data = {};
                if (me.form.isValid()) {
                    var items = me.form.items.items;
                    Ext.Array.each(items, function (item) {
                        if (item.name == 'conditions') {
                            data[item.name] = item.getSubmitValue();
                        } else if (item.name == 'attributeValues') {
                            data[item.name] = item.getArrayValue();
                        }
                    });
                    if (me.editOrNew == 'edit') {
                        me.record.set('conditions', data.conditions);
                        me.record.set('attributeValues', data.attributeValues);
                    } else {
                        CGP.product.view.productattributeconstraint.view.FormToGrid.itemData.push(data);
                        me.itemsStore.getProxy().data = CGP.product.view.productattributeconstraint.view.FormToGrid.itemData;
                        me.itemsStore.load();
                        //me.itemsStore.add(data)
                    }
                    me.close();
                }
            }
        }, {
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});

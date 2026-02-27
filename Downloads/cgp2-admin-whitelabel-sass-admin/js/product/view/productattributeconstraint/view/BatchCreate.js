Ext.define('CGP.product.view.productattributeconstraint.view.BatchCreate', {
    extend: 'Ext.window.Window',
    width: 850,
    height: 700,
    modal: true,
    maximizable: true,
    layout: 'fit',
    autoScroll: true,
    createMode: 'arrayCreate',
    autoShow: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('batch') + i18n.getKey('create');
        var mainController = Ext.create('CGP.product.view.productattributeconstraint.controller.Controller');
        var conditionGrid = {
            viewConfig: {
                enableTextSelection: true
            },
            height: 250,
            renderTo: '#condition',
            autoScroll: true,
            //width: 800,
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
                                var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                                controller.nodifyData(view, rowIndex,me.configurableId);
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
                        var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                        controller.nodifyData(this.ownerCt.ownerCt,'',me.configurableId);

                    }
                }
            ]

        };
        me.items = [
            {
                xtype: 'form',
                border: false,
                bodyPadding: 10,
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    flex: 1
                },
                //layout: 'fit',
                autoScroll: true,
                items: [
                    {
                        xtype: 'gridfield',
                        name: 'conditions',
                        itemId: 'conditions',
                        fieldLabel: i18n.getKey('condition'),
                        labelAlign: 'top',
                        width: '100%',
                        height: 300,
                        gridConfig: conditionGrid
                    },
                    Ext.create('CGP.product.view.productattributeconstraint.view.customcomp.DataStructureTree', {
                        height: 300,
                        name: 'DataStructureTree',
                        width: '100%',
                        attributeArray: me.attributeArray
                    })


                ]
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm') + i18n.getKey('create'),
            iconCls: 'icon_agree',
            handler: function () {
                var items = me.form.items.items;
                var data = {};
                Ext.Array.each(items, function (item) {
                    if (item.name != 'DataStructureTree') {
                        if (item.name == 'conditions') {
                            data[item.name] = item.getSubmitValue();
                        } else {
                            data[item.name] = item.getValue();
                        }
                    }
                });
                var dataStructureTree = me.form.getComponent('dataStructureTree');
                var root = dataStructureTree.getRootNode();
                data.exclude = dataStructureTree.down('toolbar').getComponent('exclude').getValue();

                data.attributeGroup = mainController.createAttributeValues(root, me.attributeArray, data.exclude);

                //console.log(paths);

                var isCover = true;
                Ext.Msg.show({
                    title: '提示',
                    msg: '是否覆盖原数据？(否：在原数据上添加！)',
                    width: 300,
                    buttons: 13,
                    fn: callback,
                    multiline: false,
                    animateTarget: 'addAddressBtn'
                });
                function callback(id) {
                    if (id === 'ok') {
                        isCover = true;
                    } else if (id === 'no') {
                        isCover = false;
                    }
                    mainController.arrayBatchCreate(me.store, data, me.itemData, isCover, me)

                }
            }

        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});

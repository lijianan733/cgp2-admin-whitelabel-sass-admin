/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.InputKeys_back", {
    extend: "Ext.form.Panel",
    requires : [],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    defaults: {
        width: '100%'
    },
    data: null,
    initComponent: function () {
        var me = this;
        var controller=Ext.create('');
        var keyStore=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.InputKey');
        var conditionStore=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.ConditionInput');
        me.items=[
            {
                xtype:'gridfield',
                hideHeaders:true,
                gridConfig:{
                    renderTo:'inputKeysGrid',
                    store: keyStore,
                    maxHeight: 300,
                    width: 900,
                    layout:'fit',
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function () {
                                var me=this;
                                ///todo:add function valueConditionWind
                                controller.valueConditionWind(me.gridConfig,null);
                            }
                        }
                    ],
                    columns: [
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            xtype: 'componentcolumn',
                            itemId: 'name',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('valueType'),
                            dataIndex: 'valueType',
                            xtype: 'componentcolumn',
                            itemId: 'valueType',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看"';
                                return {
                                    name: 'jobBatchIds',
                                    //allowBlank: false,
                                    xtype: 'displayfield',
                                    fieldLabel: i18n.getKey('jobBatchIds'),
                                    itemId: 'jobBatchIds'
                                }
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            itemId: 'actioncolumn',
                            dataIndex:'inputKeys',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [

                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    handler: function (view, rowIndex, colIndex) {
                                        Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                            if (select == 'yes') {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                xtype:'gridfield',
                gridConfig:{
                    renderTo:'valueConditionGrid',
                    store: conditionStore,
                    maxHeight: 300,
                    width: 900,
                    layout:'fit',
                    tbar: [
                        '->',
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function () {
                                var me=this;
                                ///todo:add function valueConditionWind
                                controller.valueConditionWind(me.gridConfig,null);
                            }
                        }
                    ],
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            xtype: 'actioncolumn',
                            itemId: 'actioncolumn',
                            dataIndex:'inputKeys',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [

                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    handler: function (view, rowIndex, colIndex) {
                                        Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                            if (select == 'yes') {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                            }
                                        });
                                    }
                                },
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex) {

                                        var store = view.getStore();
                                        var record = store.getAt(rowIndex);
                                        controller.valueConditionWind(view,record);
                                    }
                                }
                            ]
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            xtype: 'gridcolumn',
                            itemId: 'description',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            xtype: 'componentcolumn',
                            itemId: 'condition',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看"';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" id="click-condition" style="color: blue">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById('click-condition');
                                            clickElement.addEventListener('click', function () {
                                                controller.valueConditionWind(view,record,isCheck);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setSubmitValue(data[item.name])
        })
    },
    getValue: function () {
        var me = this,data={"clazz":'com.qpp.impression.domain.container.layout.FixLayoutConfig'};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            data[item.name]=item.getSubmitValue();
        });
        return data;
    }
});

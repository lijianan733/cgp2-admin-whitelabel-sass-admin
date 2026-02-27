/**
 * Created by nan on 2017/11/20.
 */
Ext.define('CGP.product.view.managerskuattribute.view.modifySKuAttributeWindow', {
    extend: 'Ext.window.Window',
    requires: ['CGP.product.edit.model.Attribute'],
    title: i18n.getKey('modify'),
    modal: true,
    layout: 'fit',
    isLock:false,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var record = me.record;
        var skuAttributeGrid = me.skuAttributeGrid;
        var isSku = me.isSku;
        var id = me.id;
        var model = new CGP.product.edit.model.Attribute(record.getData().attribute);
        model.set('value', record.get('defaultValue'));

        var defaultValueField = Qpp.CGP.util.createColumnByAttribute(model, {
            fieldLabel: i18n.getKey('defaultValue'),
            labelAlign: 'right',
            labelWidth: 100,
            name: 'defaultValue',
            itemId: 'defaultValue',
            queryMode: 'local',
            haveReset: true,
            allowBlank: true
        });

        var width = defaultValueField.width > 380 ? defaultValueField.width : 380;
        defaultValueField.width = width;
        me.items = [
            {
                xtype: 'form',
                border: false,
                padding: '10px',
                margin: '10px',
                defaults: {
                    width: width,
                    labelAlign: 'right',
                    labelWidth: 100,
                    msgTarget: 'side'
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('newDisplayName'),
                        name: 'displayName',
                        value: record.get('displayName'),
                        itemId: 'displayName'
                    },
                    defaultValueField,
                    {
                        xtype: 'combo',
                        store: Ext.create("Ext.data.Store", {
                            fields: [
                                {name: 'name', type: 'string'},
                                {name: 'value', type: 'boolean'}
                            ],
                            data: [
                                {name: '是', value: true},
                                {name: '否', value: false}
                            ]
                        }),
                        value: record.get('readOnly'),
                        valueField: 'value',
                        displayField: 'name',
                        editable: false,
                        fieldLabel: i18n.getKey('readOnly'),
                        name: 'readOnly',
                        allowBlank: false
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('sortOrder'),
                        name: 'sortOrder',
                        minValue: 0,
                        hidden: true,
                        value: record.get('sortOrder'),
                        itemId: 'sortOrder',
                        allowBlank: false
                    }, {
                        xtype: 'combo',
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {name: 'value', type: 'boolean'}],
                            data: [{name: '是', value: true}, {name: '否', value: false}]
                        }),
                        value: record.get('required'),
                        valueField: 'value',
                        editable: false,
                        fieldLabel: i18n.getKey('required'),
                        displayField: 'name',
                        name: 'required',
                        allowBlank: false

                    }, {
                        xtype: 'combo',
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {name: 'value', type: 'boolean'}],
                            data: [{name: '是', value: true}, {name: '否', value: false}]
                        }),
                        valueField: 'value',
                        fieldLabel: i18n.getKey('enable'),
                        value: record.get('enable'),
                        name: 'enable',
                        displayField: 'name',
                        allowBlank: false

                    }, {
                        xtype: 'combo',
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {name: 'value', type: 'boolean'}],
                            data: [{name: '是', value: true}, {name: '否', value: false}]
                        }),
                        name: 'hidden',
                        fieldLabel: i18n.getKey('hidden'),
                        value: record.get('hidden'),
                        valueField: 'value',
                        displayField: 'name',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('placeholder'),
                        name: 'placeholder',
                        value: record.get('placeholder'),
                        itemId: 'placeholder',
                        colspan: 2,
                        allowBlank: true
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('description'),
                        name: 'description',
                        colspan: 2,
                        height: 100,
                        width: width*2,
                        value: record.get('description'),
                        itemId: 'description'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('detail'),
                        name: 'detail',
                        value: record.get('detail'),
                        itemId: 'detail',
                        allowBlank: true,
                        colspan: 2,
                        width: width*2
                    }
                ]
            }
        ];


        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('modify'),
                disabled:me.isLock,
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('form');
                    var a = record.get('skuAttributeId');
                    var controller = Ext.create('CGP.product.view.managerskuattribute.controller.Controller');
                    if (form.isValid()) {
                        var data = {};
                        form.items.each(function (item) {
                            if (item.xtype === 'checkboxgroup') {
                                var val = [];
                                Ext.each(item.getChecked(), function (checkItem) {
                                    val.push(checkItem.inputValue);
                                });
                                if (!Ext.isEmpty(val)) {
                                    data[item.name] = val.join(',');
                                }

                            } else {
                                if (!Ext.isEmpty(item.getValue())) {
                                    data[item.name] = item.getValue();
                                }

                            }
                        });
                        data.isSku = record.get('isSku');
                        controller.confirmModifySkuAttribute(id, data, record, skuAttributeGrid, win);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    this.ownerCt.ownerCt.close();
                }
            }]
        me.callParent()
    }
})

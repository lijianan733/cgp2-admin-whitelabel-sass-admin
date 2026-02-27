/**
 * Created by dick
 */
Ext.define('CGP.rttypes.view.information.attribute.EditRtAttr', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('modify'),
    modal: true,
    layout: 'fit',
    constructor: function (config) {
        var me = this;
        var record = config.record;
        me.items = [
            {
                xtype: 'form',
                border: false,
                padding: '10px',
                defaults: {
                    width: 380
                },
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('sortOrder'),
                        minValue: 0,
                        name: 'sortOrder',
                        allowBlank: false,
                        value: record.get('sortOrder'),
                        itemId: 'sortOrder'
                    },
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
                        value: record.get('required'),
                        valueField: 'value',
                        displayField: 'name',
                        editable: false,
                        fieldLabel: i18n.getKey('required'),
                        name: 'required',
                        allowBlank: false
                    }
                ]
            }
        ];


        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('modify'),
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('form');
                    var controller = Ext.create('CGP.rttypes.controller.Controller');
                    if (form.isValid()) {
                        var data = {};
                        form.items.each(function (item) {
                            data[item.name] = item.getValue();
                        });
                        data.isSku = record.get('isSku');
                        controller.modifyRtTypeAttr(data, record, me);
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
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments)
    }
})

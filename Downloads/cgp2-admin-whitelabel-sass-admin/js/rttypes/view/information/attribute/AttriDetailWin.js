Ext.define('CGP.rttypes.view.information.attribute.AttriDetailWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    height: 260,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey("attribute");
        var controller = Ext.create('CGP.rttypes.controller.Controller');
        me.items = [
            {
                xtype: 'form',
                padding: 20,
                width: 450,
                border: false,
                //height: 200,
                defaults: {
                    width: 350
                },
                items: [
                    {
                        xtype: 'fieldcontainer',
                        name: 'attribute',
                        itemId: 'attribute',
                        width: 400,
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textarea',
                                readOnly: true,
                                id: 'attributeMsg',
                                value: me.record == null ? null : me.record.attributeMsg,
                                width: 245
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('modify'),
                                handler: function () {
                                    var attributeDefId = Ext.getCmp('attributeDefId').getValue();
                                    controller.selectAttribute(attributeDefId,me.filterData);
                                }
                            }
                        ],
                        readOnly: false,
                        fieldLabel: i18n.getKey('attributeDefId')
                    },
                    {
                        xtype: 'textarea',
                        hidden: true,
                        name: 'attributeDefId',
                        id: 'attributeDefId',
                        itemId: 'attributeDefId',
                        value: me.record == null ? null : me.record.get('rtAttributeDef')['_id']
                    },
                    {
                        xtype: 'numberfield',
                        name: 'sortOrder',
                        itemId: 'sortOrder',
                        value: me.record == null ? null : me.record.get('sortOrder'),
                        //width: 250,
                        fieldLabel: i18n.getKey('sortOrder')
                    }

                ]
            }
        ];
        me.bbar = ["->", {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function () {
                if (me.form.isValid()) {
                    var data = me.form.getValues();
                    //data.attributeDefId = Ext.getCmp('attributeDefId').getValue();
                    data.rtAttributeDef = {
                        _id: Ext.getCmp('attributeDefId').getValue(),
                        idReference: 'RtAttributeDef',
                        clazz: domainObj['RtAttributeDef']
                    };
                    if (Ext.isEmpty(me.record)) {
                        me.store.add(data);
                    } else {
                        Ext.Object.each(data, function (key, value) {
                            me.record.set(key, value);
                        })
                    }
                    me.close();
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});
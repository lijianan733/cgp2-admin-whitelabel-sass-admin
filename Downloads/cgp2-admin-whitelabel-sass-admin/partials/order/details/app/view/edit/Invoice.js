Ext.define('CGP.orderdetails.view.edit.Invoice', {

    extend: 'Ext.window.Window',
    alias: 'widget.invoiceeditor',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Valuable', 'CGP.orderdetails.view.interface.Syncable'],


    url: adminPath + 'api/websites/{0}/orders/{1}/invoice',




    modal: true,
    bodyStyle: 'padding:10px',

    initComponent: function () {

        var me = this;



        me.items = {
            xtype: 'form',
            border:false,
            itemId: 'form',
            items:[{
            xtype: 'numberfield',
            itemId: 'id',
            hidden: true
        }, {
            xtype: 'radiogroup',
            fieldLabel: i18n.getKey('type'),
            columns: 2,
            vertical: false,
            width: 400,
            allowBlank:false,
            items: [{
                    boxLabel: i18n.getKey('person'),
                    name: 'type',
                    inputValue: 1,
                    listeners: {
                        change: function () {
                            if (this.getValue() === true) {
                                var title = me.form.getComponent('title');
                                title.setValue('');
                                title.setVisible(false);
                                title.allowBlank=true;
                            }
                        }
                    }
                }, {
                    boxLabel: i18n.getKey('company'),
                    name: 'type',
                    inputValue: 2,
                    listeners: {
                        change: function () {
                            if (this.getValue() === true) {
                                var title = me.form.getComponent('title');
                                title.setVisible(true);
                                title.allowBlank=false;
                            }
                        }
                    }
                }
            ],
            itemId: 'type'

        }, {
            xtype: 'textfield',
            fieldLabel: i18n.getKey('companyName'),
            name: 'title',
            itemId: 'title'
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('content'),
            name: 'content',
            itemId: 'content'
        }]};

        me.title = i18n.getKey('invoice');

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: function () {
                me.save();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }]


        me.callParent(arguments);

        me.form = me.getComponent('form');

    },

    setValue: function (order) {

        var me = this;
        me.order = order;
        var invoice = order.get('invoice');
        var content = me.form.getComponent('content');
        if (Ext.isEmpty(invoice)) {
            content.setValue("商品名称");
            return;
        }

        var id = me.form.getComponent('id');
        var type = me.form.getComponent('type');
        var title = me.form.getComponent('title');

        type.setValue({
            type: invoice.type
        });
        id.setValue(invoice.id);
        title.setValue(invoice.title);
        if (Ext.isEmpty(invoice.content)) {
            content.setValue("商品名称");
        } else
            content.setValue(invoice.content);

    },
    save: function () {

        var me = this;
        var invoice = me.ownerPanel;
        if(!me.form.isValid()) {
            throw new Error('error');
        }
        me.sync();

        var invoiceData = {};

        me.form.items.each(function (item) {

            if (item.itemId == 'type') {
                invoiceData[item.itemId] = item.getValue().type;
            } else
                invoiceData[item.itemId] = item.getValue();

        })
        me.order.set('invoice', invoiceData);
        invoice.setValue(me.order);
        me.close();

    },


    getSyncData: function () {
        var me = this;
        var data = {};

        var type = me.form.getComponent('type');
        var title = me.form.getComponent('title');
        var content = me.form.getComponent('content');

        data.type = type.getValue().type;
        data.title = title.getValue();
        data.content = content.getValue();

        return data;

    },

    getValue: function () {
        var me = this;
        if (me.sync)
            me.sync();
        var value = {};
        me.form.items.each(function (item) {
            value[item.name] = item.getValue();
        });
        return value;
    }


})

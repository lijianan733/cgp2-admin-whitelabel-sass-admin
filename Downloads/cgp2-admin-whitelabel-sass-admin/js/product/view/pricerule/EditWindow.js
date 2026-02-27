Ext.define('CGP.product.view.pricerule.EditWindow', {
    extend: 'Ext.window.Window',


    layout: 'fit',
    bodyStyle: 'padding:10px',
    modal: true,

    initComponent: function () {

         var me = this,
            record = this.record;

        me.items = [Ext.create('CGP.product.view.pricerule.Edit', {
            itemId: 'editform',
            border: false
        })];

        me.bbar = [
            '->', {
                xtype: 'button',
                text: i18n.getKey('save'),
                handler: function () {
                    me.form.updateRecord();
                    var record = me.form.getRecord();
                    var store = Ext.ComponentQuery.query('pricerulelist')[0].getStore();

                    if (!record.store) {
                        store.add(record);
                    }
//                    record.proxy = store.getProxy();
//                    record.save({
//                        callback: function() {
//                            lm.hide();
//                            me.close();
//                        }
//                    });
                    if ((store.getModifiedRecords().length > 0 || store.getNewRecords().length > 0) && store.getProxy().url) {
                        var lm = me.setLoading(true);
                        store.sync({
                            callback: function () {
                                lm.hide();
                                me.close();
                            }
                        });
                    } else {
                        record.commit();
                        me.close();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }
        ]
        ;

        me.title = i18n.getKey('editRule');

        me.callParent(arguments);
        me.form = me.getComponent('editform');
        me.form.loadRecord(record);
    }

})
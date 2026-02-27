Ext.define('CGP.orderdetails.view.details.OrderTotal', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailsordertotal',
    mixins: ['Ext.ux.util.ResourceInit'],



    store: Ext.create('CGP.orderdetails.store.OrderTotal'),
    bodyStyle: 'border-top:0;border-color:silver;',
    header: false,
    border: '0 1 1 1',
    defaults: {
        labelAlign: 'left',
        width: 250
    },
    layout: {
        type: 'vbox',
        //columns: 1
        align: 'right'
    },

    hideHeaders: true,

    initComponent: function () {

        var me = this;




        //        me.columns = [{
        //            text: i18n.getKey('title'),
        //            dataIndex: 'title'
        //        }, {
        //            text: i18n.getKey('text'),
        //            dataIndex: 'text'
        //        }];

        //me.title = '<font color=green>' + i18n.getKey('orderTotal') + '</font>'
        /*me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '1 0 0 0',
            items:[{
                xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('orderTotal') + '</font>'
            }]

        }];*/
        me.callParent(arguments);

    },
    setValue: function (order) {
        var me = this;
        me.removeAll();
        var data;
        if (!Ext.isArray(order))
            data = order.get('orderTotals');
        else
            data = order;


        Ext.Array.each(data, function (item) {
            me.add(Ext.widget({
                xtype: 'displayfield',
                labelWidth: 150,
                labelAlign: 'left',
                fieldLabel: item.title,
                value: item.text
            }));
        });

    }
})
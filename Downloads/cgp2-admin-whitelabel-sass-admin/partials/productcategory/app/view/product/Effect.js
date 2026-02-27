Ext.define('CGP.productcategory.view.product.Effect', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.producteffect',
    mixins: ['Ext.ux.util.ResourceInit'],





    initComponent: function () {

        var me = this;




        me.store = Ext.create('CGP.productcategory.store.Product', {
            data: me.data
        })

        me.columns = [{
            dataIndex: 'id',
            text: i18n.getKey('id')
        }, {
            dataIndex: 'type',
            text: i18n.getKey('type')
         }, {
            dataIndex: 'name',
            text: i18n.getKey('name')
         }, {
            dataIndex: 'model',
            text: i18n.getKey('model')
        }, {
            dataIndex: 'sku',
            text: i18n.getKey('sku')
        }];

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            action: 'effectmove'
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.ownerCt.close();
            }
        }];

        me.callParent(arguments);
    }

})
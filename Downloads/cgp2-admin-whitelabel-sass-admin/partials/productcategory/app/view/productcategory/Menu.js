Ext.define('CGP.productcategory.view.productcategory.Menu', {
    extend: 'Ext.menu.Menu',

    alias: 'widget.productcategorymenu',
    mixins: ['Ext.ux.util.ResourceInit'],



    initComponent: function () {
        var me = this;







        var deleteAction = {
            text: i18n.getKey('delete'),
            itemId: 'delete',
            action: 'delete'
        };

//        if (me.record.get('isMain') && me.record.parentNode.get('id') == -1) {
//            Ext.apply(deleteAction, {
//                style: 'display:none;'
//            })
//        }

        me.items = [{
            text: i18n.getKey('addCategory'),
            action: 'add'
        }, deleteAction, {
            text: i18n.getKey('checkProduct'),
            action: 'checkproduct'
        }, {
            text: i18n.getKey('move') + i18n.getKey('productCategory'),
            action: 'move'
        }];


        me.callParent(arguments);
    }

})
Ext.define('CGP.productcategory.view.productcategory.MoveWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.productcategorymovewindow',
    mixins: ['Ext.ux.util.ResourceInit'],




    width: 405,
    height: 500,
    layout: {
        type: 'hbox',
        align: 'stretch',
        padding: 5
    },
    defaults: {
        flex: 1
    },
    modal : true,
    autoDestroy: false,
    closeAction: 'hide',
    constructor : function(config){
    	var me = this;

    	me.callParent(arguments);
    },

    initComponent: function () {
         var me = this;

        me.items = [{
            xtype: 'productcategorymovetree',
            isMain: me.isMain,
            website: me.website
        }, {
            xtype: 'hidden',
            itemId: 'categoryId',
            value: 1
        }];

        me.callParent(arguments);
    }

})
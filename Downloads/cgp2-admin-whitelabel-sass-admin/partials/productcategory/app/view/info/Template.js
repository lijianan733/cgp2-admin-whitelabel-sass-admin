Ext.define('CGP.productcategory.view.info.Template', {
    extend: 'Ext.ux.form.Panel',
    alias: 'widget.infotemplate',
    mixins: ['Ext.ux.util.ResourceInit'],

    model: 'CGP.productcategory.model.ProductCategory',




    constructor: function (config) {
        var me = this;




        config.columnCount = 1;
        config.items = [{
            xtype: 'textfield',
            itemId: 'pageTitle',
            name: 'pageTitle',
            fieldLabel: i18n.getKey('pageTitle'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageKeyWords',
            name: 'pageKeyWords',
            fieldLabel: i18n.getKey('pageKeyWords'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageDescription',
            name: 'pageDescription',
            fieldLabel: i18n.getKey('pageDescription'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageUrl',
            name: 'pageUrl',
            fieldLabel: i18n.getKey('pageUrl'),
            style: 'margin:10px'
        }];

        me.callParent(arguments);

    },

    initComponent: function () {

        var me = this;



        me.title = i18n.getKey('template');

        me.items = [{
            xtype: 'textfield',
            itemId: 'pageTitle',
            name: 'pageTitle',
            fieldLabel: i18n.getKey('pageTitle'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageKeyWords',
            name: 'pageKeyWords',
            fieldLabel: i18n.getKey('pageKeyWords'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageDescription',
            name: 'pageDescription',
            fieldLabel: i18n.getKey('pageDescription'),
            style: 'margin:10px'
        }, {
            xtype: 'textfield',
            itemId: 'pageUrl',
            name: 'pageUrl',
            fieldLabel: i18n.getKey('pageUrl'),
            style: 'margin:10px'
        }];

        me.callParent(arguments);
    },

    refreshData: function (record) {
        var me = this;

        me.form.setValuesByModel(record);
    }
})
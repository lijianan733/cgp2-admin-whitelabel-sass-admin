Ext.define('CGP.productcategory.view.info.attribute.Attribute', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.infoattribute',
    mixins: ['Ext.ux.util.ResourceInit'],
    //    requires: ['CGP.productcategory.view.info.attribute.IncludedAttributes', 'CGP.productcategory.view.info.attribute.OtherAttributes', 'CGP.productcategory.view.info.attribute.ButtonPanel'],


    includeUrl: adminPath + 'api/productCategories/{0}/attribute',
    otherUrl: adminPath + 'api/productCategories/{0}/exclusiveAttribute',

    autoScroll: true,

    layout: {
        type: 'hbox',
        align: 'stretch',
        flex: 1,
        padding: 5
    },

    defaults: {
        flex: 1
    },

    initComponent: function () {

        var me = this;


        me.title = i18n.getKey('attribute');


        me.items = [{
            xtype: 'includedattributes',
            url: Ext.String.format(me.includeUrl, me.categoryId),
            itemId: 'included',
            minWidth: 300

        }, {
            xtype: 'buttonpanel',
            flex: 0.12,
            minWidth: 80,
            maxWidth: 80
        }, {
            xtype: 'otherattributes',
            url: Ext.String.format(me.otherUrl, me.categoryId),
            itemId: 'other',
            minWidth: 300,
            flex: 0.8
        }];

        me.callParent(arguments);
    },

    refreshData: function (record) {

        var me = this;
        me.categoryId = record.get('id');
        var includeStore = me.getComponent('included').getStore();
        includeStore.proxy.url = Ext.String.format(Ext.clone(me.includeUrl), record.get('id'));
        includeStore.url = Ext.String.format(Ext.clone(me.includeUrl), record.get('id'));
        includeStore.removeAll();
        includeStore.load();

        var exclusiveStore = me.getComponent('other').getStore();
        exclusiveStore.proxy.url = Ext.String.format(Ext.clone(me.otherUrl), record.get('id'));
        exclusiveStore.url = Ext.String.format(Ext.clone(me.otherUrl), record.get('id'));
        exclusiveStore.removeAll();
        exclusiveStore.load();
    }
});

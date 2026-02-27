/**
 * Created by nan on 2017/12/6.
 */
Ext.define('CGP.order.view.checkExtraParamsWindow.CheckExtraParamsWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('checkExtraParams'),
    height: 200,
    width: 450,
    modal: true,
    layout: 'fit',
    autoScroll: true,
    constructor: function (config) {
        var me = this;
        var data = config.objectJSON;
        var items = [{
            xtype: 'propertygrid',
            border: false,
            autoScroll: true,
            editable: false,
            source: data,
            viewConfig: {
                enableTextSelection: true
            },
            nameColumnWidth: 200,
            getCellEditor: function () {
                return false;
            }
        }];
        me.items = items;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    }
})

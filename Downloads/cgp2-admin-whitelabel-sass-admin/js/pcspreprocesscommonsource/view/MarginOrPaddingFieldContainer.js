
/**
 * Created by shirley on 2021/07/12
 * margin/pardding类型组件
 *
 */
Ext.define('CGP.pcspreprocesscommonsource.view.MarginOrPaddingFieldContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.marginorpaddingfieldcontainer',
    initComponent: function () {
        var me = this;
        me.columnCount = 2;
        me.layout = {
            type: 'column'
        };
        me.defaults = {
            width: 100,
            labelAlign: 'left',
            labelWidth: 40
        };
        me.items = [{
            name: 'top',
            xtype: "numberfield",
            fieldLabel: 'top',
            itemId: 'top',
            padding: '0 10 5 0',
            value: 0,
            step:1,
            allowBlank: true,
            columnWidth: 0.5,
            allowDecimals: false
        }, {
            name: 'right',
            xtype: "numberfield",
            fieldLabel: 'right',
            itemId: 'right',
            padding: '0 0 5 0',
            value: 0,
            step:1,
            allowBlank: true,
            columnWidth: 0.5,
            allowDecimals: false
        }, {
            name: 'bottom',
            xtype: "numberfield",
            fieldLabel: 'bottom',
            itemId: 'bottom',
            padding: '0 10 5 0',
            value: 0,
            step:1,
            allowBlank: true,
            columnWidth: 0.5,
            allowDecimals: false
        }, {
            name: 'left',
            xtype: "numberfield",
            fieldLabel: 'left',
            itemId: 'left',
            padding: '0 0 5 0',
            value: 0,
            step:1,
            allowBlank: true,
            columnWidth: 0.5,
            allowDecimals: false
        }]
        me.callParent(arguments);
    }
})
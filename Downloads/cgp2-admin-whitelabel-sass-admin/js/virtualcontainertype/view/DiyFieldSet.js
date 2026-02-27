/**
 * Created by nan on 2021/9/30
 */
Ext.define('CGP.virtualcontainertype.view.DiyFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.diyfieldset',
    collapsible: true,
    collapsed: false,
    width: '100%',
    setValue: function (data) {
        var me = this;
        me.items.items[0].diySetValue(data);
    },
    getValue: function (data) {
        var me = this;
        return me.items.items[0].diyGetValue();
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        return true;
    },
    border: '1 0 0 0 ',
    margin: 0,
    items: [],
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    }
})
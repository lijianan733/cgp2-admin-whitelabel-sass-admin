/**
 * VCTCombo
 * @Author: C-1316
 * @Date: 2021/11/1
 */
Ext.define("fullName", {
    extend: "parentFullName",
    alias: 'widget.',
    initComponent: function () {
        var me = this;

        items = [];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            data[item.name] = item.getValue()
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        for (var item of items) {
            item.setValue(data[item.name]);
        }
    }
});
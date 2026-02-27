Ext.define("CGP.attribute.controller.Edit", {
    optionWindow: null, //某属性下的选项列表
    page: null, //属性的编辑页面
    optionId: -1,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },
    openOptionWindow: function (page, record, valueType) {
        var me = this, isEdit = record;
        me.page = page;
        if (Ext.isEmpty(record)) {
            var store = me.page.form.getComponent("options").getStore();
            var count = store.getCount();
            record = Ext.create('CGP.attribute.model.AttributeOption', {
                id: me.optionId--,
                name: "",
                sortOrder: count,
                imageUrl: "",
                value: '',
                displayValue: ''
            });
        }
        if (Ext.isEmpty(me.optionWindow)) {
            me.optionWindow = Ext.create("CGP.attribute.view.window.AddOption", {
                record: record,
                controller: me,
                valueType: valueType,
                btnFunction: me.save
            });
        } else {
            delete me.optionWindow;
            me.optionWindow = Ext.create("CGP.attribute.view.window.AddOption", {
                record: record,
                controller: me,
                valueType: valueType,
                btnFunction: me.save
            });
        }
        if (Ext.isEmpty(isEdit)) {
            me.optionWindow.setTitle(i18n.getKey('create'));
        } else {
            me.optionWindow.setTitle(i18n.getKey('edit'));
        }
        me.optionWindow.show();
    },
    save: function (record, name, sortOrder, imgUrl, value, displayValue) {
        var me = this;
        var sotre = me.page.form.getComponent("options").getStore();
        record.set("name", name);
        record.set("sortOrder", sortOrder);
        record.set("imageUrl", imgUrl);
        record.set("value", value);
        record.set("displayValue", displayValue);
        if (record.get("id") <= 0) {
            sotre.insert(1, record);
        }
        sotre.sort("sortOrder", "ASC");
        me.optionWindow.close();
    }
});

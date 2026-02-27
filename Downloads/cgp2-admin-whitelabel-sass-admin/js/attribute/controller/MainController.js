Ext.define("CGP.attribute.controller.MainController", {


    optionWindow: null,//属性的选项管理window（显示）
    addOptionWindow: null,//添加一个选项的添加window（添加）

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },

    openOptionWindow: function (record, valueType) {
        var me = this;

        if (Ext.isEmpty(me.optionWindow)) {
            me.optionWindow = Ext.create("CGP.attribute.view.window.Option", {
                attributeId: record.get("id"),
                controller: me,
                valueType: valueType
            });
        } else {
            delete me.optionWindow;
            me.optionWindow = Ext.create("CGP.attribute.view.window.Option", {
                attributeId: record.get("id"),
                controller: me,
                valueType: valueType
            });
        }
        me.optionWindow.setTitle(i18n.getKey('attribute') + ": " + record.get("name"));
        me.optionWindow.show();
    },

    openAddOptionWindow: function (record, valueType) {
        var me = this;
        var length = me.optionWindow.store.getCount()

        if (Ext.isEmpty(record)) {
            record = Ext.create('CGP.attribute.model.AttributeOption', {
                id: null,
                name: "",
                sortOrder: length,
                imageUrl: "",
                displayValue: "",
                value: ""
            });
        }
        if (!me.addOptionWindow) {
            me.addOptionWindow = Ext.create("CGP.attribute.view.window.AddOption", {
                record: record,
                controller: me,
                valueType: valueType,
                btnFunction: me.addOption
            });
        } else {
            delete me.addOptionWindow;
            me.addOptionWindow = Ext.create("CGP.attribute.view.window.AddOption", {
                record: record,
                controller: me,
                valueType: valueType,
                btnFunction: me.addOption
            });
        }
        me.addOptionWindow.show();
    },

    /**
     * 将一个新建的选项加入到一个属性的 选项集合Store 中
     * 这个Store是自动同步的。
     */
    addOption: function (record, name, sortOrder, imgUrl, value, displayValue) {
        var me = this;
        var store = me.optionWindow.grid.getStore();
        if (Ext.isEmpty(record.get("id"))) {
            var r = Ext.create("CGP.attribute.model.AttributeOption", {
                id: null,
                name: name,
                sortOrder: sortOrder,
                imageUrl: imgUrl || "",
                value: value,
                displayValue: displayValue || ''
            });
            store.insert(1, r);
        } else {
            record.set("name", name);
            record.set("sortOrder", sortOrder);
            record.set("imageUrl", imgUrl);
            record.set("value", value);
            record.set("displayValue", displayValue);
        }
    }
});

Ext.define('CGP.rtoption.Edit', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    fieldDefaults: {
        width: 380,
        margin: '10 25 10 25',
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',
    rtOptionModel: null,
    optionId: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
                name: 'name',
                // regex: /^\S+.*\S+$/,
                // regexText: '值的首尾不能存在空格！',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                itemId: 'value',
                fieldLabel: i18n.getKey('value'),
                name: 'value',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                itemId: 'displayValue',
                fieldLabel: i18n.getKey('displayValue'),
                name: 'displayValue',
                allowBlank: false
            },
            {
                xtype: 'hiddenfield',
                itemId: 'tag',
                name: 'tag',
                value: me.tagId,
                allowBlank: false
            }
        ];

        me.callParent(arguments);
        if (!Ext.isEmpty(me.optionId)) {
            me.rtOptionModel = Ext.ModelManager.getModel("CGP.rtoption.model.RtOption");
            me.rtOptionModel.load(Number(me.optionId), {
                success: function (record, operation) {
                    me.rtOptionModel = record;
                    me.refreshData(record.data);
                }
            });
        }
    },

    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items, function (item) {
            if (item.name == 'tag') {
                data[item.name] = {
                    id: item.getValue(),
                    clazz: "com.qpp.cgp.domain.attribute.RtOptionTag"
                };
            } else {
                data[item.name] = item.getValue().trim();
            }
        });
        data.clazz = 'com.qpp.cgp.domain.attribute.RtOption';
        return data;
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.name == 'tag') {
                if (data[item.name])
                    item.setValue(data[item.name].id)
            } else {
                item.setValue(data[item.name]);
            }
        })
    }
});
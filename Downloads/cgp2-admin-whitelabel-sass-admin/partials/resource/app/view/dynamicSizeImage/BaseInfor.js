Ext.define("CGP.resource.view.dynamicSizeImage.BaseInfor", {
    extend: 'Ext.form.Panel',
    alias: 'widget.dsbaseinfor',
    requires: [
        'CGP.common.field.TemplateUpload'
    ],
    defaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },
    autoScroll: false,
    scroll: 'vertical',

    data: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                name: 'description',
            },
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            },
            {
                xtype: 'fileuploadv2',
                name: 'thumbnail',
                fieldLabel: i18n.getKey('thumbnail'),
                itemId: 'thumbnail',
                allowBlank: false,
                width:450,
                valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
            },
        ];
        me.callParent(arguments);
    },
    listeners: {
        // afterrender: function (comp) {
        //     if (!Ext.isEmpty(comp.data)) {
        //         comp.setValue(comp.data);
        //     }
        // }
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data||{};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue()
        });
        return data;
    }
});

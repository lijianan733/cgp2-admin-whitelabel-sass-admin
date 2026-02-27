Ext.define("CGP.virtualcontainerobject.view.ContentMapItems", {
    extend: 'Ext.form.Panel',
    alias: 'widget.contentmapitems',
    requires: [
        'CGP.common.field.TemplateUpload'
    ],
    autoScroll: false,
    defaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        margin: '5 25'
    },
    data: null,
    layout: {
        type: 'hbox',
        align: 'middle ',
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'contentmapgrid',
                itemId: 'contentMapGrid',
                width: '100%'
            },
            {
                xtype: 'contentmapedit',
                itemId: 'contentMapEdit',
                hidden: true,
                border: false,
            }

        ];
        me.callParent(arguments);
    },
    triggerShow: function (showComp, hideComp) {
        showComp.show();
        showComp.enable();
        hideComp.hide();
        hideComp.disable();
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
            if (!item.hidden) {
                if (item.xtype == 'contentmapgrid') {
                    item.setSubmitValue(data);
                } else {
                    item.setValue(data);
                }
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (!item.hidden) {
                data = item.diyGetValue ? item.diyGetValue() : item.getValue();
            }
        });
        return data;
    }
});

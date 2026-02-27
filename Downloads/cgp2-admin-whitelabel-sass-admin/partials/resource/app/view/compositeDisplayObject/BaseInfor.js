Ext.define("CGP.resource.view.compositeDisplayObject.BaseInfor", {
    extend: 'Ext.form.Panel',
    alias: 'widget.compositebaseinfor',
    requires: [
        'CGP.common.field.TemplateUpload'
    ],
    fieldDefaults: {
        labelAlign: 'right',
        width: 450,
        msgTarget: 'side'
    },
    autoScroll: false,
    scroll: 'vertical',

    data: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                name: 'description',
            },
            // {
            //     xtype: 'templatefield',
            //     id: 'cdThumnail',
            //     name: 'thumbnail',
            //     fieldLabel: i18n.getKey('thumbnail'),
            //     itemId: 'thumbnail',
            //     allowBlank: false,
            //     width: 380,
            //     fieldDefaults: {
            //         margin:'0 0 10 2'
            //     },
            //     formFileName: 'file',
            //     fileType: ['image/*', '.pdf'],
            //     url: imageServer + 'upload',
            //     callBack: function (fp, action) {
            //         var sucFile = action.response.data;
            //         var fileName = '', wind = fp.owner.ownerCt;
            //         if (sucFile) {
            //             Ext.getCmp('cdThumnail').setValue(sucFile.fileName);
            //             wind.close();
            //         }
            //     }
            // },
            {
                name: 'sourceContainerWidth',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('width'),
                itemId: 'sourceContainerWidth',
                allowBlank: false,
                allowDecimals: false
            },
            {
                name: 'sourceContainerHeight',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('height'),
                itemId: 'sourceContainerHeight',
                allowBlank: false,
                allowDecimals: false
            },
            {
                name: 'thumbnail',
                xtype: 'fileuploadv2',
                fieldLabel: i18n.getKey('thumbnail'),
                itemId: 'thumbnail',
                width: 450,
                valueUrlType: 'part',
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
        var data = me.data || {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue()
        });
        return data;
    }
});

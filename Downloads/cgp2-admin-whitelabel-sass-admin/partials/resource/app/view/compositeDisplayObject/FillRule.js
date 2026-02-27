Ext.define('CGP.resource.view.compositeDisplayObject.FillRule', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.fillrule',
    requires: [],
    // isValidForItems:true,
    fieldDefaults: {
        labelAlign: 'right',
        margin: '5',
        width: 450,
    },
    initComponent: function () {
        var me = this;
        me.items = [
            // {
            //     name: '_id',
            //     xtype: 'numberfield',
            //     fieldLabel: i18n.getKey('id'),
            //     itemId: '_id',
            //     hidden: true
            // },
            {
                name: 'clazz',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.CompositeDisplayObject'
            },
            {
                margin: '0 0 0 50',
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: i18n.getKey('information'),
                itemId: 'information',
                // disabled: true,
                fieldStyle: 'color:black;font-weight: bold'
            },
            {
                xtype: 'compositebaseinfor',
                itemId: 'compositeBaseInfor',
                bodyStyle: 'border-width: 1px 0 0 0;',
                margin: '5 10',
            },
            {
                xtype: 'rulegrid',
                itemId: 'ruleGrid',
                width: 750,
                fieldLabel: i18n.getKey('rule'),
                name: 'dynamicSizeFillRules',
                allowBlank: false
            }
        ];
        me.callParent(arguments);
    },
    // isValid: function () {
    //     var me = this;
    //     var isValid = true;
    //     if (me.rendered == true) {
    //         me.items.items.forEach(function (item) {
    //             if (!item.hidden && item.isValid() == false) {
    //                 isValid = false;
    //             }
    //         });
    //     }
    //     return isValid;
    // },
    diySetValue: function (data) {
        var me = this;
        me.data = data;
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'displayfield') {
                continue;
            }
            if (item.xtype == 'compositebaseinfor') {
                item.setValue(data);
            } else if (item.xtype == 'rulegrid') {
                item.setSubmitValue(data[item.name]);
            } else {
                item.setValue(data[item.name]);
            }
        }
    },
    diyGetValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'displayfield') {
                continue;
            }
            if (item.xtype == 'compositebaseinfor') {
                data = Ext.merge(data, item.getValue());
            } else if (item.xtype == 'rulegrid') {
                data[item.name] = item.getSubmitValue()
            } else {
                data[item.name] = item.getValue()
            }
        }
        return data;
    }
});
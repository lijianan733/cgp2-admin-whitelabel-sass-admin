Ext.define("CGP.resource.view.dynamicSizeImage.RuleForm", {
    extend: 'Ext.form.Panel',
    alias: 'widget.ruleform',
    requires: [],
    layout: {
        type: 'table',
        columns: 1
    },
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',
    border: false,
    padding: '10',
    data: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                name:'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
            },
            {
                xtype: 'fillruleform',
                itemId: 'fillRule',
                name:'rule',
            },
            {
                xtype: 'uxfieldset',
                name:'range',
                title: i18n.getKey('sizeRange'),
                items: [
                    {
                        xtype: 'rangeform',
                        itemId: 'rangeForm',
                        name:'rangeform',
                    }
                ]
            },

        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.record?.data)) {
                comp.setValue(comp.record.data);
            }
        }
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
        if(Ext.isEmpty(data)||Ext.Object.isEmpty(data)){
            return false;
        }
        me.data = data;
        var items = me.items.items;
        for(var item of items) {
            if(item.hidden) {
                continue;
            }
            if(item.xtype=='uxfieldset'){
                item.items.items[0].setValue(data[item.name]);
            }
            else {
                item.setValue(data[item.name]);
            }

        }
    },
    getValue: function () {
        var me = this;
        var data = me.data||{};
        var items = me.items.items;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            data._id=JSGetCommonKey();
            data.clazz = 'com.qpp.cgp.domain.pcresource.compositedisplayobject.DynamicSizeFillRule';
        }
        for(var item of items) {
            if(item.hidden){
                continue;
            }
            if(item.xtype=='uxfieldset'){
                data[item.name]=(item.getValue())?.rangeform;
            }
            else {
                data[item.name] = item.getValue()
            }
        }
        return data;
    }
});

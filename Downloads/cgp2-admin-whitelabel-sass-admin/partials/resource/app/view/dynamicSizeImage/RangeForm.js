Ext.define("CGP.resource.view.dynamicSizeImage.RangeForm", {
    extend: 'Ext.form.Panel',
    alias: 'widget.rangeform',
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
                xtype: 'checkboxgroup',
                margin: '5 0 5 80',
                columns: 2,
                vertical: true,
                items: [
                    {boxLabel: i18n.getKey('equalMin'), width: 80, name: 'equalMin', inputValue: 'true'},
                    {boxLabel: i18n.getKey('equalMax'), width: 80, name: 'equalMax', inputValue: 'true'}
                ],
            },
            {
                xtype: 'numberfield',
                name: 'minWidth',
                fieldLabel: i18n.getKey('minWidth'),
                itemId: 'minWidth',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false,
                // listeners:{
                //     chang:function(view, record){
                //         var task=new Ext.util.DelayedTask();
                //         task.delay(600, dealClick, this, [view,record]);
                //     }
                //
                // }
            },
            {
                xtype: 'numberfield',
                name: 'maxWidth',
                fieldLabel: i18n.getKey('maxWidth'),
                itemId: 'maxWidth',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },
            {
                xtype: 'numberfield',
                name: 'minHeight',
                fieldLabel: i18n.getKey('minHeight'),
                itemId: 'minHeight',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },
            {
                xtype: 'numberfield',
                name: 'maxHeight',
                fieldLabel: i18n.getKey('maxHeight'),
                itemId: 'maxHeight',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            }
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
        if(Ext.isEmpty(data)||Ext.Object.isEmpty(data)){
            return false;
        }
        me.data = data;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if(item.xtype=='checkboxgroup'){
                item.items.items.forEach(function (el){
                    el.setValue(data[el.name])
                })
            }
            else{
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data||{};
        var items = me.items.items;
        // if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
        //     data.clazz = 'com.qpp.cgp.domain.pcresource.SizeRange';
        // }
        Ext.Array.each(items, function (item) {
            if(item.xtype=='checkboxgroup'){
                item.items.items.forEach(function (el){
                    data[el.name]=el.checked;
                })
            }
            else{
                data[item.name] = item.getValue()
            }

        });
        return data;
    },
    getName:function (){
        var me=this;
        return me.name;
    }
});

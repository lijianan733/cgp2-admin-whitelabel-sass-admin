Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.DefinitionTextSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.definitiontextset',
    layout: 'vbox',
    autoScroll: true,
    labelAlign: 'top',
    /*defaults: {
        allowBlank: false
    },*/
    tipInfo: '至少填写dpi或最小分辨率，dpi优先级高',
    listeners: {},
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'numberfield',
                name: 'dpi',
                width: 295,
                fieldLabel: 'dpi',
                hideTrigger: true,
                minValue: 0
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('min') + i18n.getKey('resolution'),
                labelWidth: 100,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('width'),
                    minValue: 1,
                    width: 90,
                    labelWidth: 30,
                    name: 'minWidth',
                    itemId: 'minWidth'

                },
                    {
                        xtype: 'numberfield',
                        hideTrigger: true,
                        width: 90,
                        margin: '0 0 0 10',
                        fieldLabel: i18n.getKey('height'),
                        minValue: 1,
                        labelWidth: 30,
                        name: 'minHeight',
                        itemId: 'minHeight'

                    }]
            }

        ]
        me.callParent(arguments);
    },
    /**
     * 获取uxfieldcontainer中所有field的value
     * @returns {{}}
     */
    getValue: function () {
        var me = this;
        var resultSet = {};
        var items = me.items.items;
        Ext.Array.each(items,function (item){
            if(item.xtype == 'fieldcontainer'){
                var fieldcontainerItems = item.items.items;
                Ext.Array.each(fieldcontainerItems,function (fieldcontainerItem){
                    resultSet[fieldcontainerItem.name] = fieldcontainerItem.getValue();
                })
            }else{
                resultSet[item.name] = item.getValue();
            }

        })
        return resultSet;
    },
    /**
     *
     * @param data 为已配置对象，键名为对应的field.name，值为要设置的值
     */
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items,function (item){
            if(item.xtype == 'fieldcontainer'){
                /*item.on('afterrender',function (){
                    var fieldcontainerItems = item.items.items;
                    Ext.Array.each(fieldcontainerItems,function (fieldcontainerItem){
                        fieldcontainerItem.setValue(data[fieldcontainerItem.name])
                    })
                })*/
                var fieldcontainerItems = item.items.items;
                Ext.Array.each(fieldcontainerItems,function (fieldcontainerItem,index){
                    if(!(data[fieldcontainerItem.name] == 0 || data[fieldcontainerItem.name] == null)){
                        fieldcontainerItem.setValue(data[fieldcontainerItem.name])
                    }
                })
            }else{
                if(!(data[item.name] == 0 || data[item.name] == null)){
                    item.setValue(data[item.name]);
                }

            }
        })
    },
    /**
     * fieldcontainer原本是没有getName方法的，定义该方法使之更类似一个field
     * @returns {config.name|*|string}
     */
    getName: function () {
        return this.name;
    },
    setReadOnly: function (readOnly) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.setReadOnly) {
                item.setReadOnly(readOnly);
            }
        }
    },
    isValid: function () {
        var me = this;
        me.Errors = {};
        var items = me.items.items;
        var resultValue = {
            dpi: 0,
            minWidth: 0,
            maxHeight: 0
        }
        var valid = true;
        if (me.hidden == true) {
            //隐藏时就不作处理
            return true;
        }
        Ext.Array.each(items,function (item){
            if(item.xtype == 'fieldcontainer'){
                var fieldcontainerItems = item.items.items;
                Ext.Array.each(fieldcontainerItems,function (fieldcontainerItem){
                    resultValue[fieldcontainerItem.name] = fieldcontainerItem.getValue();
                })
            }else{
                resultValue[item.name] = item.getValue();
            }

        })
        if(resultValue.dpi +  resultValue.minWidth + resultValue.minHeight <= 0){
            valid = false;
            me.Errors[i18n.getKey('definition') + i18n.getKey('config')] = 'dpi或最小分辨率至少填一';
        }else if(resultValue.dpi < 1 &&(resultValue.minWidth < 1 || resultValue.minHeight < 1)){
            valid = false;
            me.Errors[i18n.getKey('definition') + i18n.getKey('config')] = 'dpi或最小分辨率至少填一';
        }
        return valid;
    },
    getErrors: function () {
        var me = this;
        return me.Errors;
    },
    reset: function () {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.reset) {
                item.reset();
            }
        }
    },
    getFieldLabel: function () {
        return this.title;
    }

});



Ext.Loader.setPath('CGP.resource', '../../../app');
Ext.define('CGP.resource.view.dynamicSizeImage.Edit', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.dsedit',
    requires: ['CGP.resource.model.DynamicSizeImage'],
    fieldDefaults: {
        labelAlign: 'right',
        width: '90%',
        margin: '5'
    },
    initComponent: function () {
        var me = this;
        me.dsId = JSGetQueryString('id');
        me.tbar = [
            {
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',

            },
            {
                xtype: 'button',
                itemId: "copy",
                text: i18n.getKey('copy'),
                iconCls: 'icon_copy',
                disabled: me.dsId == null,

            }
        ];
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
                value: 'com.qpp.cgp.domain.pcresource.dynamicimage.DynamicSizeImage'
            },
            {
                margin: '0 0 0 50',
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: i18n.getKey('information'),
                itemId: 'information',
                // disabled:true,
                fieldStyle: 'color:black;font-weight: bold'
            },
            {
                xtype: 'dsbaseinfor',
                itemId: 'dsBaseinfor',
                bodyStyle: 'border-width: 1px 0 0 0;',
                margin: '5 10',
            },
            {
                margin: '10 0 0 50',
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: i18n.getKey('createRule'),
                itemId: 'createRule',
                // disabled:true,
                fieldStyle: 'color:black;font-weight: bold'
            },
            {
                xtype: 'ruleinfor',
                itemId: 'ruleInfor',
                name:'generateRule',
                bodyStyle: 'border-width: 1px 0 0 0;',
                margin: '5 10',
            }

        ];
        me.callParent(arguments);
        if (me.dsId) {
            var dsModel = Ext.ModelManager.getModel("CGP.resource.model.DynamicSizeImage");
            dsModel.load(parseInt(me.dsId), {
                success: function (record, operation) {
                    me.setValue(record.data);
                }
            });
        }
    },
    listeners: {
        afterrender: function (comp) {

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
            if(item.xtype=='displayfield'){
                continue;
            }
            if (item.xtype == 'dsbaseinfor' ) {
                item.setValue(data);
            } else {
                item.setValue(data[item.name]);
            }
        }
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        for(var item of items) {
            if(item.xtype=='displayfield'){
                continue;
            }
            if (item.xtype == 'dsbaseinfor' ) {
                data=Ext.merge(data,item.getValue());
            }
            else {
                data[item.name] = item.getValue();
            }
        }
        return data;
    }
});
Ext.define("CGP.resource.view.dynamicSizeImage.RuleInfor", {
    extend: 'Ext.form.Panel',
    alias: 'widget.ruleinfor',
    requires: [],
    fieldDefaults: {
        labelAlign: 'right',
        width: 600,
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
                name: '_id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: '_id',
                hidden: true
            },
            {
                xtype: 'imagefield',
                itemId: 'imageField',
                title: i18n.getKey('image'),
                name: 'sourceImage',
                margin: '10',
                width:600
            },
            {
                name: 'clazz',
                xtype: 'combo',
                fieldLabel: i18n.getKey('createRule') + i18n.getKey('type'),
                itemId: 'createRule',
                displayField: 'displayName',
                valueField: 'value',
                value:'com.qpp.cgp.domain.pcresource.dynamicimage.MosaicImageGenerateRule',
                editable: false,
                allowBlank: false,
                // haveReset: true,
                queryMode: 'local',
                relevanceComp: ['rangeForm', 'ruleGrid'],
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.pcresource.dynamicimage.MosaicImageGenerateRule',
                            displayName: 'Mosaic'
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcresource.dynamicimage.DSFillImageGenerateRule',
                            displayName: 'DSFill'
                        }
                    ]
                }),
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var ruleForm=comp.ownerCt;
                        if (comp.relevanceComp && Ext.isArray(comp.relevanceComp)) {
                            for(var item of comp.relevanceComp){
                                ruleForm.getComponent(item).hide()
                            }
                        }
                        if(newValue.indexOf('Mosaic')>0){
                            ruleForm.getComponent('rangeForm').show();
                        }
                        else {
                            ruleForm.getComponent('ruleGrid').show();
                        }
                    }
                }
            },
            {
                xtype: 'rangeform',
                itemId: 'rangeForm',
                name:'range'
            },
            {
                xtype: 'rulegrid',
                itemId: 'ruleGrid',
                name:'ruleOfGenerates',
                msgTarget:'qtip',
                hidden:true,
                allowBlank: false
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
            if(item.xtype=='rulegrid'){
                item.setSubmitValue(data[item.name]);
            }
            else {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data||{};
        var items = me.items.items;
        for(var item of items) {
            if(item.xtype=='rulegrid'){
                data[item.name] = item.getSubmitValue()
            }
            else {
                data[item.name] = item.getValue()
            }

        }
        return data;
    }
});

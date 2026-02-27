Ext.define("CGP.resource.view.dynamicSizeImage.FillRule", {
    extend: 'Ext.form.Panel',
    alias: 'widget.fillruleform',
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
        var ruleStore = Ext.data.StoreManager.lookup('ruleStore');
        me.items = [
            {
                name: 'clazz',
                xtype: 'combo',
                fieldLabel: i18n.getKey('fill') + i18n.getKey('type'),
                itemId: 'fillType',
                displayField: 'displayName',
                valueField: 'value',
                editable: false,
                allowBlank: false,
                // haveReset: true,
                queryMode: 'local',
                store: ruleStore || Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.pcresource.dynamicimage.AlignClipRule',
                            displayName: 'AlignClipRule'
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcresource.dynamicimage.RepeatRule',
                            displayName: 'RepeatRule'
                        },
                        // {
                        //     value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.GeometricFillRule',
                        //     displayName: 'GeometricFillRule'
                        // }
                    ]
                }),
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var ruleForm = comp.ownerCt;
                        if (newValue.indexOf('AlignClipRule') > 0) {
                            ruleForm.getComponent('horizontalAlign').show();
                            ruleForm.getComponent('verticalAlign').show();
                            ruleForm.getComponent('horizontalAlign').enable(true);
                            ruleForm.getComponent('verticalAlign').enable(true);
                        } else {
                            ruleForm.getComponent('horizontalAlign').hide();
                            ruleForm.getComponent('verticalAlign').hide();
                        }
                    },
                    afterrender:function (comp){
                        if(comp.store.getAt(0)){
                            comp.setValue(comp.store.getAt(0).get('value'));
                        }
                    }
                }
            },
            {
                name: 'horizontalAlign',
                xtype: 'combo',
                fieldLabel: i18n.getKey('horizontalAlign'),
                itemId: 'horizontalAlign',
                displayField: 'displayName',
                valueField: 'value',
                value: 'Center',
                editable: false,
                allowBlank: false,
                hidden: true,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: 'Left',
                            displayName: i18n.getKey('Left')
                        },
                        {
                            value: 'Center',
                            displayName: i18n.getKey('Center')
                        },
                        {
                            value: 'Right',
                            displayName: i18n.getKey('Right')
                        },
                    ]
                }),
            },
            {
                name: 'verticalAlign',
                xtype: 'combo',
                fieldLabel: i18n.getKey('verticalAlign'),
                itemId: 'verticalAlign',
                displayField: 'displayName',
                valueField: 'value',
                value: 'Center',
                editable: false,
                allowBlank: false,
                hidden: true,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [

                        {
                            value: 'Top',
                            displayName: i18n.getKey('Top')
                        },
                        {
                            value: 'Center',
                            displayName: i18n.getKey('Center')
                        },
                        {
                            value: 'Bottom',
                            displayName: i18n.getKey('Bottom')
                        },
                    ]
                }),
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
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
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
            data[item.name] = item.getValue();
        });
        return data;
    },
    getName: function () {
        var me = this;
        return me.name;
    }
});

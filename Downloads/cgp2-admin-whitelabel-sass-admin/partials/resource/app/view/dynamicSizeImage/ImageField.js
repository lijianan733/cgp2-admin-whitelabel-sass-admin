Ext.define("CGP.resource.view.dynamicSizeImage.ImageField", {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.imagefield',
    requires: ['CGP.common.field.TemplateUpload'],
    style: {
        padding: '10 25',
        borderRadius: '4px'
    },
    layout: {
        type: 'table',
        columns: 1
    },
    defaults: {
        labelAlign: 'right',
        width: 450,
        labelWidth: 120,
        msgTarget: 'side',
    },
    data: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'clazz',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.pcresource.Image',
                hidden: true
            },
            {
                name: 'originalName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('originalName'),
                itemId: 'originalName',
                allowBlank: false
            },
            {
                xtype: 'fileuploadv2',
                name: 'imageName',
                fieldLabel: i18n.getKey('imageName'),
                itemId: 'uploadRuleImage',
                allowBlank: false,
                valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                uploadCallback: function (imageData) {
                    var fileuploadv2 = this;
                    var fileName = imageData.originalFileName;
                    fileuploadv2.ownerCt.getComponent('originalName').setValue(fileName.substring(0, fileName.lastIndexOf('.')));
                    fileuploadv2.ownerCt.getComponent('format').setValue(imageData.format);
                    fileuploadv2.ownerCt.getComponent('width').setValue(imageData.width);
                    fileuploadv2.ownerCt.getComponent('height').setValue(imageData.height);
                    fileuploadv2.ownerCt.getComponent('isVector').setValue(imageData.format.toLowerCase() == 'svg');
                }
            },
            {
                name: 'format',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('format'),
                itemId: 'format',
                allowBlank: false,
                readOnly: true
            },
            {
                name: 'width',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('width'),
                itemId: 'width',
                allowBlank: false,
                readOnly: true
            },
            {
                name: 'height',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('height'),
                itemId: 'height',
                allowBlank: false,
                readOnly: true
            },
            {
                name: 'unit',
                xtype: 'combo',
                fieldLabel: i18n.getKey('unit'),
                itemId: 'unit',
                displayField: 'displayName',
                valueField: 'value',
                editable: false,
                allowBlank: false,
                haveReset: true,
                queryMode: 'local',
                value: 'px',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: 'px',
                            displayName: 'px'
                        },
                        {
                            value: 'in',
                            displayName: 'in'
                        },
                        {
                            value: 'mm',
                            displayName: 'mm'
                        },
                        {
                            value: 'cm',
                            displayName: 'cm'
                        }
                    ]
                })
            },
            {
                name: 'isVector',
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('vector'),
                itemId: 'isVector',
                hidden: true
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
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            data._id = JSGetCommonKey();
        }
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue()
        });
        return data;
    }
});

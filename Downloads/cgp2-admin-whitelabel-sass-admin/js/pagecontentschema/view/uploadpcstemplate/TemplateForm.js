Ext.define('CGP.pagecontentschema.view.uploadpcstemplate.TemplateForm', {
    extend: 'Ext.form.Panel',
    bodyPadding: 20,
    initComponent: function () {
        var me = this;
        var pcsInfo = {
            xtype: 'uxfieldset',
            collapsible: false,
            profileStore: null,//所有能使用的profile,若没有则隐藏
            style: {
                borderRadius: '10px'
            },
            itemId: 'pcsInfo',
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('PCS') + i18n.getKey('info') + '</font>',
            defaults: {
                width: 500
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    xtype: 'textfield',
                    name: 'description',
                    fieldLabel: i18n.getKey('description'),
                },
                {
                    name: 'width',
                    fieldLabel: i18n.getKey('width'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'width',
                    minValue: 0,
                    allowBlank: false
                },
                {
                    name: 'height',
                    fieldLabel: i18n.getKey('height'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'height',
                    minValue: 0,
                    allowBlank: false
                }
            ]
        };
        var layerInfo = {
            xtype: 'uxfieldset',
            collapsible: false,
            profileStore: null,//所有能使用的profile,若没有则隐藏
            style: {
                borderRadius: '10px'
            },
            itemId: 'layerInfo',
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('layer') + '</font>',
            defaults: {
                width: 500
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'description',
                    fieldLabel: i18n.getKey('description'),
                },
                {
                    xtype: 'combo',
                    name: 'effectType',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', {name: 'value', type: 'string'}],
                        data: [{
                            name: i18n.getKey('Printing'),
                            value: 'Printing'
                        }, {
                            name: i18n.getKey('Laser'),
                            value: 'Laser'
                        }, {
                            name: i18n.getKey('GoldFoilStamping'),
                            value: 'GoldFoilStamping'
                        }, {
                            name: i18n.getKey('SilverFoilStamping'),
                            value: 'SilverFoilStamping'
                        }, {
                            name: i18n.getKey('Embroidery'),
                            value: 'Embroidery'
                        }, {
                            name: i18n.getKey('UV'),
                            value: 'UV'
                        }, {
                            name: i18n.getKey('Embossing'),
                            value: 'Embossing'
                        }, {
                            name: i18n.getKey('Glittering'),
                            value: 'Glittering'
                        }, {
                            name: i18n.getKey('Carve'),
                            value: 'Carve'
                        },{name: i18n.getKey('LeatherEmbossing'),value: 'LeatherEmbossing'}]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    queryMode: 'local',
                    itemId: 'effectType',
                    fieldLabel: i18n.getKey('effectType')
                }
            ]
        };
        var uploadPicture = {
            xtype: 'uxfieldset',
            collapsible: false,
            profileStore: null,//所有能使用的profile,若没有则隐藏
            style: {
                borderRadius: '10px'
            },
            itemId: 'uploadPicture',
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('uploadPicture') + '</font>',
            defaults: {
                width: 500
            },
            items: [
                {
                    name: 'x',
                    fieldLabel: i18n.getKey('x'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'x',
                    allowBlank: false
                },
                {
                    name: 'y',
                    fieldLabel: i18n.getKey('y'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'y',
                    allowBlank: false
                }, {
                    name: 'width',
                    fieldLabel: i18n.getKey('width'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    minValue: 0,
                    itemId: 'width',
                    allowBlank: false
                },
                {
                    name: 'height',
                    fieldLabel: i18n.getKey('height'),
                    xtype: 'numberfield',
                    hideTrigger: true,
                    minValue: 0,
                    itemId: 'height',
                    allowBlank: false
                }
            ]
        }
        me.items = [
            pcsInfo, layerInfo, uploadPicture
        ];
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var pcsInfo = me.getComponent('pcsInfo').getValue();
        var layerInfo = me.getComponent('layerInfo').getValue();
        var uploadPicture = me.getComponent('uploadPicture').getValue();
        layerInfo = Ext.Object.merge(layerInfo,{"clazz": "Layer",
            "tags": [],
            "readOnly": false,
            "_id": JSGetCommonKey()})
        var a = pcsInfo;
        uploadPicture = Ext.Object.merge(uploadPicture,{
            "clazz": "UploadPicture",
            "readOnly": false,
            "tags": [],
            "scale": 1,
            "printFile": "",
            "imageName": "",
            "_id": JSGetCommonKey()})
        layerInfo.items = [uploadPicture];
        pcsInfo.layers = [layerInfo];
        pcsInfo.clazz = 'com.qpp.cgp.domain.bom.PageContentSchema';

        return pcsInfo;
    }
});

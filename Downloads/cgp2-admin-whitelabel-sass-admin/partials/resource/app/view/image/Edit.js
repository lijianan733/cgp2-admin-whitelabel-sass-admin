/**
 * Created by miao on 2021/8/26.
 */
Ext.application({
    requires: [
        'Ext.container.Viewport',
        'CGP.common.field.TemplateUpload'
    ],
    name: 'CGP.resource',
    appFolder: '../../../app',
    models: ['Image'],
    controllers: [
        'Image'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/image',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            formCfg: {
                model: 'CGP.resource.model.Image',
                remoteCfg: false,
                useForEach: true,
                layout: {
                    layout: 'table',
                    columns: 1,
                    tdAttrs: {
                        style: {
                            'padding-right': '120px'
                        }
                    }
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        hidden: true
                    },

                    {
                        name: 'clazz',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.pcresource.Image'
                    },
                    {
                        xtype: 'fileuploadv2',
                        valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                        allowFileType: ['image/*', '.pdf'],
                        name: 'imageName',
                        fieldLabel: i18n.getKey('image'),
                        itemId: 'imageName',
                        allowBlank: false,
                        isUseParams: true,
                        uploadCallback: function (imageData) {
                            var fileuploadv2 = this;
                            var form = fileuploadv2.ownerCt;
                            form.getComponent('name').setValue(imageData.originalFileName.substring(0, imageData.originalFileName.lastIndexOf('.')));
                            form.getComponent('format').setValue(imageData.format);
                            form.getComponent('width').setValue(imageData.width);
                            form.getComponent('height').setValue(imageData.height);
                            form.getComponent('isVector').setValue(imageData.format.toLowerCase() == 'svg');
                        },
                    },
                    {
                        name: 'thumbnail',
                        xtype: 'fileuploadv2',
                        fieldLabel: i18n.getKey('thumbnail'),
                        itemId: 'thumbnail',
                        valueUrlType: 'part',
                        isUseParams: true,
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name',
                        allowBlank: false
                    },
                    {
                        name: 'isVector',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('isVector'),
                        itemId: 'isVector',
                        hidden: true
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
                    }
                ]
            },
            listeners: {
                afterload: function (page) {

                }
            }
        });
    }
});

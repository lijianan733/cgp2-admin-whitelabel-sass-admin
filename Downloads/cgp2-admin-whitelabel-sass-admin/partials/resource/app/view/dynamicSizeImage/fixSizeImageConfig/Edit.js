/**
 * Created by miao on 2021/8/26.
 */
Ext.application({
    requires: [
        'Ext.container.Viewport',
        'CGP.common.field.TemplateUpload'
    ],
    name: 'CGP.resource',
    appFolder: '../../../../app',
    models: ['FixSizeImageConfig'],
    controllers: [
        'FixSizeImageConfig'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/dynamicSizeImage/fixSizeImageConfig',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            formCfg: {
                model: 'CGP.resource.model.FixSizeImageConfig',
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
                        value: 'com.qpp.cgp.domain.pcresource.dynamicimage.FixSizeImageConfig'
                    },
                    {
                        xtype: 'fileuploadv2',
                        name: 'imageName',
                        fieldLabel: i18n.getKey('imageName'),
                        itemId: 'imageName',
                        allowBlank: false,
                        valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                        allowFileType: ['image/*', '.pdf'],
                        uploadCallback: function (imageData) {
                            var fileuploadv2 = this;
                            if (imageData) {
                                fileuploadv2.ownerCt.getComponent('width').setValue(imageData.width);
                                fileuploadv2.ownerCt.getComponent('height').setValue(imageData.height);
                            }
                        }
                    },
                    {
                        name: 'imageWidth',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('width'),
                        itemId: 'width',
                        allowBlank: false
                    },
                    {
                        name: 'imageHeight',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('height'),
                        itemId: 'height',
                        allowBlank: false
                    },
                    {
                        name: 'dynamicSizeImage',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('dynamicSizeImage'),
                        itemId: 'dynamicSizeImage',
                        hidden: true,
                        value: JSGetQueryString('dsId'),
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue(data?._id || JSGetQueryString('dsId'))
                        },
                        diyGetValue: function () {
                            var me = this;
                            return {
                                _id: me.getValue(),
                                clazz: 'com.qpp.cgp.domain.pcresource.dynamicimage.DynamicSizeImage'
                            }
                        }
                    }
                ]
            },
        });
    }
});
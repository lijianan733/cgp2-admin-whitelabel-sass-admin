/**
 * Created by admin on 2019/12/21.
 */
Ext.define('CGP.threedpreviewplan.view.component.TextureImageSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    colspan: 2,
    productId: null,
    title: i18n.getKey('texture'),
    padding: '10',
    defaults: {
        /*
         labelAlign: 'top',
         */
        allowBlank: false,
        margin: '10 0 0 0',
        width: 250
    },
    preview: false,
    style: {
        borderRadius: '10px'
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var items = me.items.items;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            result[item.getName()] = item.getValue();
        }
        //result.clazz = 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto'
        return result
    },
    setValue: function (data) {
        var me = this;
        data.clazz = '';
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data[item.getName()]);
        }
    },
    initComponent: function () {
        var me = this;
        me.margin = me.fieldMargin;
        me.items = [
            {
                name: 'useTransparentMaterial',
                xtype: 'checkbox',
                hidden: me.preview,
                fieldLabel: i18n.getKey('useTransparentMaterial'),
                itemId: 'useTransparentMaterial'
            },
            {
                xtype: 'fileupload',
                name: 'location',
                itemId: 'modelFileName',
                formFileName: 'files',
                height: 80,
                aimFileServerUrl: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),//指定文件夹
                fieldLabel: i18n.getKey('image'),
                uploadHandler: function () {
                    var formPanel = this.ownerCt.ownerCt;
                    var win = formPanel.ownerCt;
                    var file = formPanel.getComponent('file');
                    var url = win.fileUpLoadField.aimFileServerUrl;
                    var filePath = win.fileUpLoadField.getComponent('filePath');
                    if (!Ext.isEmpty(file.getRawValue())) {
                        var myMask = new Ext.LoadMask(win, {msg: "上传中..."});
                        myMask.show();
                        formPanel.getForm().submit({
                            url: url,
                            method: 'POST',
                            success: function (form, action) {
                                myMask.hide();
                                var response = action.response;
                                filePath.setValue(response.data[0].name);
                                win.close();
                            },
                            failure: function (form, action) {
                                myMask.hide();
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                            }
                        });
                    }
                },
                listeners: {
                    afterrender: function () {
                        var me = this;
                        var downLoadBtn = me.getComponent('buttonGroup').getComponent('downloadBtn');
                        downLoadBtn.hide();
                    }
                }
            }, {
                name: 'type',
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [{name: 'Dynamic', value: 'Dynamic'}, {name: 'Mesh', value: 'Mesh'}]
                }),
                hidden: me.preview,
                value: 'Dynamic',
                valueField: 'value',
                displayField: 'name',
                queryMode: 'local',
                itemId: 'type'
            }, {
                xtype: 'textfield',
                name: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.dto.product.config.model.AssetsInfo',

            }, {
                xtype: 'textfield',
                name: 'name',
                hidden: true,
                itemId: 'name'

            }
        ];
        me.callParent(arguments);
    }

});
